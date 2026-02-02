import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10) + '...',
    hasUSDAKey: !!process.env.NEXT_PUBLIC_USDA_API_KEY,
    nodeEnv: process.env.NODE_ENV,
    // List all env vars that start with NEXT_ or OPENAI_ (redacted)
    envKeys: Object.keys(process.env).filter(k =>
      k.startsWith('NEXT_') || k.startsWith('OPENAI_') || k.startsWith('CF_')
    ),
  })
}
