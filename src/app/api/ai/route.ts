import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a helpful nutrition assistant for a calorie tracking app called Nourish. Your job is to help users log their food by estimating nutritional information.

When a user describes food they ate, respond with a JSON object containing your best estimate of the nutritional information. Be conversational but always include the food data.

Response format:
{
  "message": "Your friendly response message",
  "food": {
    "name": "Food name (concise, 2-4 words)",
    "calories": number,
    "protein": number (in grams),
    "carbs": number (in grams),
    "fat": number (in grams),
    "servingSize": number,
    "servingUnit": "string (e.g., 'serving', 'cup', 'oz', 'piece')"
  }
}

If the user asks a general nutrition question (not logging food), respond with just a message:
{
  "message": "Your helpful response"
}

Guidelines:
- Be accurate with calorie and macro estimates based on typical portions
- If portion size is unclear, assume a standard serving
- Round numbers to whole integers
- Keep food names short and descriptive
- Be encouraging and supportive`

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error('OPENAI_API_KEY not found in environment')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Build messages array with conversation history
    const messages: ChatMessage[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ]

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      for (const msg of conversationHistory) {
        if (msg.role === 'user') {
          messages.push({ role: 'user', content: msg.content })
        } else if (msg.role === 'assistant' && msg.content) {
          messages.push({ role: 'assistant', content: msg.content })
        }
      }
    }

    // Add the current message
    messages.push({ role: 'user', content: message })

    // Use fetch directly for Cloudflare Workers compatibility
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API error:', response.status, errorData)

      if (response.status === 401) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
      }

      return NextResponse.json(
        { error: 'OpenAI API error', details: errorData },
        { status: response.status }
      )
    }

    const data = await response.json()
    const responseContent = data.choices?.[0]?.message?.content

    if (!responseContent) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse the JSON response
    const parsed = JSON.parse(responseContent)

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('AI API error:', error)

    return NextResponse.json(
      { error: 'Failed to process request', details: error?.message },
      { status: 500 }
    )
  }
}
