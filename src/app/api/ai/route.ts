import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }

    // Build messages array with conversation history
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
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

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content

    if (!responseContent) {
      return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
    }

    // Parse the JSON response
    const parsed = JSON.parse(responseContent)

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('AI API error:', error)

    if (error?.code === 'invalid_api_key') {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    return NextResponse.json(
      { error: 'Failed to process request', details: error?.message },
      { status: 500 }
    )
  }
}
