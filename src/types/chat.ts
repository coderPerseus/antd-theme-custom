export type AIProvider = 'deepseek' | 'openai' | 'anthropic' | 'google';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatSettings {
  provider: AIProvider;
  apiKey: string;
  model?: string;
}

export interface APIConfig {
  deepseek?: {
    apiKey: string;
    baseURL?: string;
    model: string;
  };
  openai?: {
    apiKey: string;
    model: string;
  };
  anthropic?: {
    apiKey: string;
    model: string;
  };
  google?: {
    apiKey: string;
    model: string;
  };
}
