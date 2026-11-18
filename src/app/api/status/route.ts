import { NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const MANDATORY_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b';
const DEFAULT_BASE_URL = 'https://integrate.api.nvidia.com/v1';

export async function GET() {
  const apiKey = process.env.NVIDIA_API_KEY;
  const model = process.env.NVIDIA_MODEL || MANDATORY_MODEL;
  const baseURL = process.env.NVIDIA_BASE_URL || DEFAULT_BASE_URL;

  // 1. UNCONFIGURED STATE
  if (!apiKey || apiKey.trim() === '') {
    return NextResponse.json({
      status: 'unconfigured',
      model,
      message: 'NVIDIA_API_KEY is not configured in .env.local',
      timestamp: new Date().toISOString(),
    });
  }

  // 2. TEST REAL UPSTREAM CONNECTION
  const startTime = Date.now();
  try {
    const client = new OpenAI({
      baseURL,
      apiKey,
      timeout: 6000, // 6s timeout for status check
    });

    // Make a minimal test call to verify model availability
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
    // UNAVAILABLE STATE (API Key invalid, network failure, or rate limit)
    console.error('NVIDIA Nemotron Status Probe Failed:', error.message);
    return NextResponse.json(
      {
        status: 'unavailable',
        model: MANDATORY_MODEL,
        message: error.message || 'Upstream service is unreachable',
        code: error.code || 'API_UNREACHABLE',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
