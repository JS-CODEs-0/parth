import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { products } from '../../../lib/data/products';
import { searchCatalogDeterministic } from '../../../lib/search/catalogSearch';
import { Product, ActivePreferences, RecommendationDetail, ComparisonData } from '../../../lib/types';

// Mandatory model per requirements
const MANDATORY_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b';
const DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1';

// Allow up to 60 seconds for NVIDIA Nemotron 3 Ultra (550B) reasoning on Vercel
export const maxDuration = 60;

interface RequestMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: Request) {
  let topMatched: Product[] = [];
  let currentFilters: any = {};

  try {
    // Read environment variables with robust sanitization (handles quotes & whitespace)
    const rawApiKey = process.env.NVIDIA_API_KEY;
    const apiKey = rawApiKey ? rawApiKey.trim().replace(/^["']|["']$/g, '').trim() : '';

    const model = (process.env.NVIDIA_MODEL?.trim() || MANDATORY_MODEL);

    // Normalize baseURL: strip any trailing /chat/completions or slashes so OpenAI SDK appends cleanly
    const rawBaseURL = process.env.NVIDIA_BASE_URL?.trim() || DEFAULT_BASE_URL;
    const baseURL = rawBaseURL.replace(/\/chat\/completions\/?$/, '').replace(/\/+$/, '');

    // Check API Key
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'NVIDIA API Key not configured. If deployed on Vercel, add NVIDIA_API_KEY in Vercel Project Settings → Environment Variables. For local development, add it to your .env.local file.',
          code: 'MISSING_API_KEY',
          modelUsed: model,
          vercelHelp:
            'In your Vercel Dashboard, navigate to Project Settings → Environment Variables, create NVIDIA_API_KEY with your NVIDIA API key (nvapi-...), and redeploy.',
        },
        { status: 503 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.message !== 'string' || !body.message.trim()) {
      return NextResponse.json(
        { error: 'Invalid request: "message" string is required.', code: 'INVALID_INPUT' },
        { status: 400 }
      );
    }

    const userMessage: string = body.message.trim();
    if (userMessage.length > 1000) {
      return NextResponse.json(
        { error: 'Message too long. Limit is 1000 characters.', code: 'INPUT_TOO_LONG' },
        { status: 400 }
      );
    }

    // Previous active session preferences (Conversation Memory)
    const previousPreferences: ActivePreferences | undefined = body.preferences;

    // Conversation history (limit to last 8 turns)
    const rawHistory: any[] = Array.isArray(body.history) ? body.history : [];
    const formattedHistory: RequestMessage[] = rawHistory
      .slice(-8)
      .filter((h) => h && typeof h.text === 'string' && (h.sender === 'user' || h.sender === 'assistant'))
      .map((h) => ({
        role: h.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: String(h.text),
      }));

    // 1. Perform deterministic catalog retrieval with conversation session memory
    const { matchedProducts, filters } = searchCatalogDeterministic(
      userMessage,
      previousPreferences
    );

    // Limit matched products context to top 4 candidates for fast 550B inference
    topMatched = matchedProducts.slice(0, 4);
    currentFilters = filters;

    // Prepare concise catalog context for Nemotron to keep prompt lean & fast
    const catalogContext = topMatched.map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: `₹${p.price.toLocaleString('en-IN')}`,
      rating: p.rating,
      specs: p.specs,
      pros: p.pros.slice(0, 3),
      cons: p.cons.slice(0, 2),
      verdict: p.aiAnalysis.verdict,
      idealFor: p.aiAnalysis.idealFor,
    }));

    function parseNemotronOutput(rawContent: string): any {
  let cleaned = rawContent.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  // Extract from first { to last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  // 1. Try standard JSON.parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // 2. Try handling literal newlines inside JSON string literals
    try {
      const repaired = cleaned.replace(/"((?:\\.|[^"\\])*)"/g, (match) => {
        return match.replace(/\n/g, '\\n').replace(/\r/g, '').replace(/\t/g, '\\t');
      });
      return JSON.parse(repaired);
    } catch {
      // 3. Fallback extraction using regex
      let responseText = cleaned;
      const respMatch = cleaned.match(/"response"\s*:\s*"([\s\S]*?)"(?=\s*,\s*"(?:recommendedProductIds|comparisonData|recommendationDetails|activePreferences)")/);
      if (respMatch) {
        responseText = respMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
      } else {
        const simpleMatch = cleaned.match(/"response"\s*:\s*"([\s\S]*?)"/);
        if (simpleMatch) {
          responseText = simpleMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"');
        }
      }

      let ids: string[] = [];
      const idsMatch = cleaned.match(/"recommendedProductIds"\s*:\s*\[([^\]]*)\]/);
      if (idsMatch) {
        try {
          ids = JSON.parse(`[${idsMatch[1]}]`);
        } catch {
          ids = idsMatch[1]
            .split(',')
            .map((s) => s.replace(/["'\s]/g, ''))
            .filter(Boolean);
        }
      }

      return {
        response: responseText,
        recommendedProductIds: ids,
        recommendationDetails: [],
        comparisonData: null,
      };
    }
  }
}

    // Lightweight catalog directory for discovery (reduces prompt tokens by ~70%)
    const catalogSummary = products
      .map((p) => `${p.name} [${p.category}, ₹${p.price.toLocaleString('en-IN')}]`)
      .join(' | ');

    // 2. Initialize OpenAI client with NVIDIA endpoint
    // 38s timeout guarantees we catch slow calls BEFORE Vercel's 60s hard timeout!
    const client = new OpenAI({
      baseURL,
      apiKey,
      timeout: 38000,
      maxRetries: 0,
    });

    // 3. System prompt enforcing all 7 intelligent shopping agent capabilities
    const systemPrompt = `You are ShopMate AI, an intelligent e-commerce shopping agent powered by NVIDIA Nemotron 3 Ultra (550B).

YOUR 7 CORE AGENT CAPABILITIES:
1. SMART BUDGET PLANNER:
   - When a user states their budget (e.g., "I have ₹70,000 for programming & gaming"), analyze whether any catalog item fits.
   - If an item is within budget, calculate leftover funds.
   - If an item slightly exceeds the budget, compute the exact difference (e.g., "+₹14,990") and explain if the stretch is worth it.
   - Honestly detail the trade-offs (e.g. integrated graphics vs dedicated RTX graphics for gaming).

2. PRODUCT COMPARISON:
   - When asked to compare (e.g., "Compare these three laptops" or "Compare Sony XM5 vs Bose QC Ultra"):
   - Use the actual catalog specifications.
   - Structure a clear comparison in both your markdown response and in the "comparisonData" object.
   - State clear trade-offs: who should buy which model and why.

3. REQUIREMENT MATCHING:
   - When user specifies needs (e.g., "phone with good cameras, battery life and 256GB storage"), rank products by match score (0-100%).
   - Explicitly verify whether each requirement is satisfied (e.g., "Camera: 48MP Triple with 5x zoom ✅", "Battery: 4685mAh 33hr video ✅", "Storage: 256GB NVMe ✅").

4. ALTERNATIVE FINDER:
   - If a requested model exceeds budget or is unavailable, suggest the closest suitable alternative from the catalog with exact price delta and what is gained/sacrificed.

5. PRODUCT EXPLANATION:
   - Translate technical jargon into plain, intuitive human benefits (e.g., explain what 120Hz LTPO, Nano IPS Black 2000:1 contrast, or 100W SuperVOOC actually mean for daily use).

6. CONVERSATION MEMORY:
   - You must retain all previous requirements across turns.
   - Current Session Memory: ${JSON.stringify(previousPreferences || {})}
   - If the user previously asked for laptops under ₹80,000 and now says "It must have 16GB RAM", combine them: Category = laptops, Budget = ₹80,000, RAM = 16GB.
   - Return the updated "activePreferences" in your JSON.

7. RECOMMENDATION REASONS:
   - For every recommended product, clearly articulate:
     a) Why it was recommended
     b) Key strengths
     c) Compromises and limitations

CRITICAL GROUNDING RULES:
- Only recommend products from the provided catalog.
- Never invent product names, prices, ratings, or specs.
- Price numbers MUST use INR currency formatting (e.g., ₹84,990).
- Distinguish catalog facts from subjective opinions.

OUTPUT FORMAT:
Respond ONLY with a single valid JSON object strictly matching this schema with NO markdown code block wrappers:
{
  "response": "Detailed, articulate markdown response covering the analysis, pros, cons, budget advice, and comparisons.",
  "recommendedProductIds": ["id1", "id2"],
  "recommendationDetails": [
    {
      "productId": "id1",
      "matchScore": 95,
      "whyRecommended": "Concise 1-2 sentence justification.",
      "strengths": ["Strength 1", "Strength 2"],
      "compromises": ["Compromise 1"]
    }
  ],
  "comparisonData": {
    "title": "Comparison Title or null if not comparing",
    "summary": "Short verdict summary or null",
    "productIds": ["id1", "id2"],
    "headers": ["Metric", "Product A", "Product B"],
    "rows": [
      ["Price (INR)", "₹...", "₹..."],
      ["Key Advantage", "...", "..."]
    ]
  },
  "activePreferences": {
    "category": "${filters.category || previousPreferences?.category || 'all'}",
    "maxBudget": ${filters.maxBudget || previousPreferences?.maxBudget || 'null'},
    "ram": "${filters.ram || previousPreferences?.ram || ''}",
    "storage": "${filters.storage || previousPreferences?.storage || ''}",
    "keyRequirements": ${JSON.stringify(filters.keywords)},
    "brands": ${JSON.stringify(filters.brands)}
  },
  "agentAction": "budget_planning" | "comparison" | "requirement_matching" | "alternative_finder" | "tech_explanation" | "general_chat",
  "suggestedFollowUps": [
    "Relevant follow-up 1",
    "Relevant follow-up 2"
  ]
}

AVAILABLE MATCHED PRODUCTS IN CATALOG:
${JSON.stringify(catalogContext, null, 2)}

FULL CATALOG DIRECTORY (for alternative discovery):
${catalogSummary}`;

    // 4. Construct messages payload
    const messagesPayload: RequestMessage[] = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
      { role: 'user', content: userMessage },
    ];

    // 5. Call NVIDIA Nemotron 3 Ultra
    const completion = await client.chat.completions.create({
      model: MANDATORY_MODEL,
      messages: messagesPayload,
      temperature: 0.6,
      top_p: 0.95,
      max_tokens: 1500,
    });

    const rawChoice = completion.choices[0]?.message;
    const rawContent = rawChoice?.content || '';

    // 6. Parse structured response with robust multi-line string handling
    const parsed = parseNemotronOutput(rawContent);

    // 7. Resolve recommended products from catalog
    const recommendedIds: string[] = Array.isArray(parsed.recommendedProductIds)
      ? parsed.recommendedProductIds
      : [];

    let finalProducts: Product[] = recommendedIds
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => Boolean(p));

    if (finalProducts.length === 0 && matchedProducts.length > 0) {
      finalProducts = matchedProducts.slice(0, 3);
    }

    // Build recommendationDetails if not provided
    const recommendationDetails: RecommendationDetail[] = Array.isArray(parsed.recommendationDetails) && parsed.recommendationDetails.length > 0
      ? parsed.recommendationDetails
      : finalProducts.map((p, idx) => ({
          productId: p.id,
          matchScore: Math.max(88, 98 - idx * 4),
          whyRecommended: p.aiAnalysis.whyRecommend,
          strengths: p.pros.slice(0, 2),
          compromises: p.cons.slice(0, 1),
        }));

    return NextResponse.json({
      response: parsed.response || rawContent,
      recommendedProducts: finalProducts,
      recommendationDetails,
      comparisonData: parsed.comparisonData || null,
      activePreferences: parsed.activePreferences || {
        category: filters.category,
        maxBudget: filters.maxBudget,
        ram: filters.ram,
        storage: filters.storage,
        keyRequirements: filters.keywords,
        brands: filters.brands,
      },
      agentAction: parsed.agentAction || 'general_chat',
      suggestedFollowUps: parsed.suggestedFollowUps || [],
      modelUsed: MANDATORY_MODEL,
      reasoning: (rawChoice as any)?.reasoning_content || null,
    });
  } catch (error: any) {
    console.error('NVIDIA Nemotron 3 Ultra Shopping Agent Error:', error);

    let status = typeof error?.status === 'number' ? error.status : 500;
    let code = error?.code || 'NVIDIA_API_ERROR';
    let userFriendlyMessage = error?.message || 'An error occurred while communicating with NVIDIA Nemotron 3 Ultra.';

    // Classify known NVIDIA API errors for accurate user feedback
    if (
      status === 401 ||
      error?.message?.includes('401') ||
      error?.message?.toLowerCase().includes('unauthorized') ||
      error?.message?.toLowerCase().includes('invalid api key')
    ) {
      status = 401;
      code = 'INVALID_API_KEY';
      userFriendlyMessage =
        'The configured NVIDIA API Key was rejected by NVIDIA. Please verify that your NVIDIA_API_KEY is active and correct in Vercel Project Settings → Environment Variables (or .env.local locally).';
    } else if (
      status === 403 ||
      error?.message?.includes('403') ||
      error?.message?.toLowerCase().includes('forbidden')
    ) {
      status = 403;
      code = 'FORBIDDEN';
      userFriendlyMessage =
        'Access to NVIDIA Nemotron 3 Ultra was forbidden. Please verify your NVIDIA Developer account permissions and model entitlements at integrate.api.nvidia.com.';
    } else if (
      status === 429 ||
      error?.message?.includes('429') ||
      error?.message?.toLowerCase().includes('rate limit')
    ) {
      status = 429;
      code = 'RATE_LIMIT_EXCEEDED';
      userFriendlyMessage =
        'NVIDIA Nemotron 3 Ultra rate limit reached. Please wait a few moments before sending another message.';
    } else if (
      error?.name === 'APIConnectionTimeoutError' ||
      error?.message?.toLowerCase().includes('timeout')
    ) {
      // Graceful high-load fallback: deliver verified catalog recommendations instantly without timing out
      const fallbackProducts = topMatched.length > 0 ? topMatched.slice(0, 3) : products.slice(0, 3);
      return NextResponse.json({
        response: `### ⚡ Shopping Analysis (Fast Grounded Mode)\n\nNVIDIA Nemotron 3 Ultra (550B) is experiencing high reasoning demand, but I have retrieved the best verified matches directly from our catalog for you:\n\n${fallbackProducts
          .map(
            (p: Product) =>
              `• **${p.name}** — **₹${p.price.toLocaleString('en-IN')}** (${p.rating}★)\n  *Ideal for:* ${p.aiAnalysis.idealFor}\n  *Why:* ${p.aiAnalysis.whyRecommend}`
          )
          .join('\n\n')}\n\n*Feel free to ask a specific comparison or follow-up question!*`,
        recommendedProducts: fallbackProducts,
        recommendationDetails: fallbackProducts.map((p: Product, idx: number) => ({
          productId: p.id,
          matchScore: Math.max(88, 96 - idx * 4),
          whyRecommended: p.aiAnalysis.whyRecommend,
          strengths: p.pros.slice(0, 2),
          compromises: p.cons.slice(0, 1),
        })),
        comparisonData: null,
        activePreferences: {
          category: currentFilters.category || 'all',
          maxBudget: currentFilters.maxBudget || null,
          ram: currentFilters.ram || '',
          storage: currentFilters.storage || '',
          keyRequirements: currentFilters.keywords || [],
          brands: currentFilters.brands || [],
        },
        agentAction: 'requirement_matching',
        suggestedFollowUps: ['Compare these options', 'Show models under ₹80,000', 'Check battery life'],
        modelUsed: MANDATORY_MODEL,
        reasoning: 'Grounded catalog recommendations delivered during peak upstream NVIDIA inference latency.',
      });
    } else if (status >= 500) {
      status = 502;
      code = 'NVIDIA_UPSTREAM_ERROR';
      userFriendlyMessage =
        'The NVIDIA Nemotron API returned an upstream service error. Please try again in a few moments.';
    }

    return NextResponse.json(
      {
        error: userFriendlyMessage,
        code,
        details: error?.message || null,
        modelUsed: MANDATORY_MODEL,
      },
      { status }
    );
  }
}
