import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Groq } from 'groq-sdk';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const groq = new Groq({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

async function translateText(text: string, targetLang: 'ru' | 'en') {
  try {
    const prompt = targetLang === 'ru' 
      ? `Translate the following English text to Russian. Provide only the translation, no explanations:\n\n${text}`
      : `Translate the following Russian text to English. Provide only the translation, no explanations:\n\n${text}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    const translation = completion.choices[0].message.content?.trim() || text;
    console.log(`\n[Translation] ${targetLang === 'ru' ? 'English → Russian' : 'Russian → English'}`);
    console.log(`Input: ${text}`);
    console.log(`Output: ${translation}\n`);
    
    return translation;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    console.log('\n=== Starting New Conversation ===');
    console.log('Original user message:', message);

    // Step 1: Translate to Russian
    const russianTranslation = await translateText(message, 'ru');

    // Step 2: Get DeepSeek response in Russian
    console.log('\n[DeepSeek] Processing Russian input...');
    const deepseekResponse = await groq.chat.completions.create({
      model: "deepseek-r1-distill-llama-70b",
      messages: [{ role: 'user', content: russianTranslation }],
      temperature: 0.6,
      max_tokens: 4096,
      top_p: 0.95,
      stream: false,
    });

    const russianResponse = deepseekResponse.choices[0].message.content || russianTranslation;
    console.log('DeepSeek response (Russian):', russianResponse);

    // Step 3: Translate back to English
    const englishTranslation = await translateText(russianResponse, 'en');
    console.log('\n=== Conversation Complete ===\n');
    
    return NextResponse.json({ response: englishTranslation });
  } catch (error: any) {
    console.error('\n[ERROR]', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
} 