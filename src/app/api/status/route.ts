import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const MANDATORY_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b';
const DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1';

export async function GET() {
  const rawApiKey = process.env.NVIDIA_API_KEY;
  const apiKey = rawApiKey ? rawApiKey.trim().replace(/^["']|["']$/g, '').trim() : '';

  const model = process.env.NVIDIA_MODEL?.trim() || MANDATORY_MODEL;

  const rawBaseURL = process.env.NVIDIA_BASE_URL?.trim() || DEFAULT_BASE_URL;
  const baseURL = rawBaseURL.replace(/\/chat\/completions\/?$/, '').replace(/\/+$/, '');

  // 1. UNCONFIGURED STATE
  if (!apiKey) {
    return NextResponse.json({
      status: 'unconfigured',
      model,
      message: 'NVIDIA_API_KEY is not configured. Add it in Vercel Project Settings → Environment Variables (or .env.local locally).',
      timestamp: new Date().toISOString(),
    });
  }

  // During static build phase, do not block the compiler with live network requests
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.json({
      status: 'connected',
      model: MANDATORY_MODEL,
      message: 'NVIDIA Nemotron 3 Ultra configured',
      timestamp: new Date().toISOString(),
    });
  }

  // 2. TEST REAL UPSTREAM CONNECTION
  const startTime = Date.now();
  try {
    const client = new OpenAI({
      baseURL,
      apiKey,
      timeout: 8000, // 8s timeout for live probe
      maxRetries: 0,
    });

    // Make a minimal test call to verify model availability at https://integrate.api.nvidia.com/v1/chat/completions
    await client.chat.completions.create({
      model: MANDATORY_MODEL,
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 2,
    });

    const latencyMs = Date.now() - startTime;

    // CONNECTED STATE
    return NextResponse.json({
      status: 'connected',
      model: MANDATORY_MODEL,
      latencyMs,
      baseURL,
      message: 'NVIDIA Nemotron 3 Ultra operational and responsive',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('NVIDIA Nemotron Status Probe Failed:', error?.message);

    const status = typeof error?.status === 'number' ? error.status : 500;
    let code = error?.code || 'API_UNREACHABLE';
    let message = error?.message || 'Upstream service is unreachable';

    if (
      status === 401 ||
      error?.message?.includes('401') ||
      error?.message?.toLowerCase().includes('unauthorized') ||
      error?.message?.toLowerCase().includes('invalid api key')
    ) {
      code = 'INVALID_API_KEY';
      message = 'Invalid NVIDIA API Key. Please verify in Vercel Project Settings → Environment Variables.';
    } else if (status === 403 || error?.message?.includes('403')) {
      code = 'FORBIDDEN';
      message = 'Access forbidden for this key or model on NVIDIA Integrate.';
    } else if (status === 429 || error?.message?.includes('429')) {
      code = 'RATE_LIMIT_EXCEEDED';
      message = 'NVIDIA API rate limit reached. Please wait a moment.';
    } else if (error?.name === 'APIConnectionTimeoutError' || error?.message?.toLowerCase().includes('timeout')) {
      code = 'TIMEOUT';
      message = 'Probe timed out. The NVIDIA 550B model is experiencing high load.';
    }

    return NextResponse.json(
      {
        status: 'unavailable',
        model: MANDATORY_MODEL,
        message,
        code,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
