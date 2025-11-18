import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { messages, provider, apiKey, model } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // biome-ignore lint/suspicious/noImplicitAnyLet: aiModel type is determined dynamically based on provider
    let aiModel;

    switch (provider) {
      case 'deepseek': {
        const deepseek = createOpenAI({
          apiKey,
          baseURL: 'https://api.deepseek.com',
        });
        aiModel = deepseek(model || 'deepseek-chat');
        break;
      }
      case 'openai': {
        const openai = createOpenAI({
          apiKey,
        });
        aiModel = openai(model || 'gpt-4o-mini');
        break;
      }
      case 'anthropic': {
        const anthropic = createAnthropic({
          apiKey,
        });
        aiModel = anthropic(model || 'claude-3-5-sonnet-20241022');
        break;
      }
      case 'google': {
        const google = createGoogleGenerativeAI({
          apiKey,
        });
        aiModel = google(model || 'gemini-1.5-flash');
        break;
      }
      default:
        return new Response(JSON.stringify({ error: 'Invalid provider' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    const result = await streamText({
      model: aiModel,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
