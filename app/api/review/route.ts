import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { prompt, userAnswer } = await req.json();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Ты — дружелюбный тренер по коммуникациям. Дай краткую обратную связь (2–3 предложения), выдели сильную сторону и одно улучшение.',
      },
      { role: 'user', content: `Задание: ${prompt}\nОтвет пользователя: ${userAnswer}` },
    ],
    temperature: 0.7,
  });

  const feedback = completion.choices[0].message.content;
  return NextResponse.json({ feedback });
}
