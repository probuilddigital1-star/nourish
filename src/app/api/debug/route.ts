import { NextResponse } from 'next/server'

export async function GET() {
  const rawKey = process.env.OPENAI_API_KEY || ''
  // Strip ALL non-printable and non-ASCII characters
  const cleanKey = rawKey.replace(/[^\x20-\x7E]/g, '')

  const results: Record<string, any> = {
    hasOpenAIKey: !!rawKey,
    keyLength: rawKey.length,
    cleanKeyLength: cleanKey.length,
    keyHasInvalidChars: rawKey.length !== cleanKey.length,
    openAIKeyPrefix: cleanKey.substring(0, 10) + '...',
    openAIKeySuffix: '...' + cleanKey.substring(cleanKey.length - 4),
    hasUSDAKey: !!process.env.NEXT_PUBLIC_USDA_API_KEY,
    nodeEnv: process.env.NODE_ENV,
  }

  // Test OpenAI API call with cleaned key
  try {
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    headers.set('Authorization', 'Bearer ' + cleanKey)

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say hello in 3 words' }],
        max_tokens: 20,
      }),
    })
    const openaiData = await openaiRes.json()
    results.openaiStatus = openaiRes.status
    results.openaiOk = openaiRes.ok
    results.openaiResponse = openaiRes.ok
      ? openaiData.choices?.[0]?.message?.content
      : openaiData.error
  } catch (err: any) {
    results.openaiError = err.message
  }

  // Test USDA API call
  try {
    const usdaRes = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${process.env.NEXT_PUBLIC_USDA_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'banana', pageSize: 1 }),
      }
    )
    results.usdaStatus = usdaRes.status
    results.usdaOk = usdaRes.ok
    if (!usdaRes.ok) {
      results.usdaError = await usdaRes.text()
    } else {
      const usdaData = await usdaRes.json()
      results.usdaFoodCount = usdaData.foods?.length ?? 0
    }
  } catch (err: any) {
    results.usdaError = err.message
  }

  return NextResponse.json(results)
}
