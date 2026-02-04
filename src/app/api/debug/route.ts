import { NextResponse } from 'next/server'

export async function GET() {
  const results: Record<string, any> = {
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 10) + '...',
    hasUSDAKey: !!process.env.NEXT_PUBLIC_USDA_API_KEY,
    nodeEnv: process.env.NODE_ENV,
  }

  // Test OpenAI API call
  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
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
