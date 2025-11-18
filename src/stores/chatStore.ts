import type {
  AIProvider,
  APIConfig,
  Conversation,
  Message,
} from '@/types/chat';
import localforage from 'localforage';
import { create } from 'zustand';

interface ChatState {
  conversations: Conversation[];
  currentConversationId: string | null;
  apiConfig: APIConfig;
  currentProvider: AIProvider;
  isLoading: boolean;

  // Actions
  setCurrentProvider: (provider: AIProvider) => void;
  setAPIConfig: (config: Partial<APIConfig>) => void;
  createConversation: (title?: string) => Promise<string>;
  deleteConversation: (id: string) => Promise<void>;
  setCurrentConversation: (id: string) => void;
  addMessage: (
    conversationId: string,
    message: Omit<Message, 'id' | 'timestamp'>,
  ) => Promise<void>;
  updateMessage: (
    conversationId: string,
    messageId: string,
    content: string,
  ) => Promise<void>;
  clearConversations: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

// LocalForage 配置
const conversationsDB = localforage.createInstance({
  name: 'chatApp',
  storeName: 'conversations',
});

const configDB = localforage.createInstance({
  name: 'chatApp',
  storeName: 'config',
});

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  apiConfig: {},
  currentProvider: 'deepseek',
  isLoading: false,

  setCurrentProvider: provider => {
    set({ currentProvider: provider });
    configDB.setItem('currentProvider', provider);
  },

  setAPIConfig: async config => {
    const newConfig = { ...get().apiConfig, ...config };
    set({ apiConfig: newConfig });
    await configDB.setItem('apiConfig', newConfig);
  },

  createConversation: async (title = '新对话') => {
    const newConversation: Conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const conversations = [...get().conversations, newConversation];
    set({
      conversations,
      currentConversationId: newConversation.id,
    });

    await conversationsDB.setItem('conversations', conversations);
    return newConversation.id;
  },

  deleteConversation: async id => {
    const conversations = get().conversations.filter(c => c.id !== id);
    const currentConversationId =
      get().currentConversationId === id
        ? conversations[0]?.id || null
        : get().currentConversationId;

    set({ conversations, currentConversationId });
    await conversationsDB.setItem('conversations', conversations);
  },

  setCurrentConversation: id => {
    set({ currentConversationId: id });
  },

  addMessage: async (conversationId, message) => {
    const conversations = get().conversations;
    const conversationIndex = conversations.findIndex(
      c => c.id === conversationId,
    );

    if (conversationIndex === -1) return;

    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    const updatedConversation = {
      ...conversations[conversationIndex],
      messages: [...conversations[conversationIndex].messages, newMessage],
      updatedAt: Date.now(),
    };

    const updatedConversations = [...conversations];
    updatedConversations[conversationIndex] = updatedConversation;

    set({ conversations: updatedConversations });
    await conversationsDB.setItem('conversations', updatedConversations);
  },

  updateMessage: async (conversationId, messageId, content) => {
    const conversations = get().conversations;
    const conversationIndex = conversations.findIndex(
      c => c.id === conversationId,
    );

    if (conversationIndex === -1) return;

    const messages = conversations[conversationIndex].messages;
    const messageIndex = messages.findIndex(m => m.id === messageId);

    if (messageIndex === -1) return;

    const updatedMessages = [...messages];
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content,
    };

    const updatedConversation = {
      ...conversations[conversationIndex],
      messages: updatedMessages,
      updatedAt: Date.now(),
    };

    const updatedConversations = [...conversations];
    updatedConversations[conversationIndex] = updatedConversation;

    set({ conversations: updatedConversations });
    await conversationsDB.setItem('conversations', updatedConversations);
  },

  clearConversations: async () => {
    set({ conversations: [], currentConversationId: null });
    await conversationsDB.clear();
  },

  loadFromStorage: async () => {
    try {
      const conversations =
        (await conversationsDB.getItem<Conversation[]>('conversations')) || [];
      const apiConfig = (await configDB.getItem<APIConfig>('apiConfig')) || {};
      const currentProvider =
        (await configDB.getItem<AIProvider>('currentProvider')) || 'deepseek';

      set({
        conversations,
        apiConfig,
        currentProvider,
        currentConversationId: conversations[0]?.id || null,
      });
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  },

  setLoading: loading => {
    set({ isLoading: loading });
  },
}));
