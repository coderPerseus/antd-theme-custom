import { useChatStore } from '@/stores/chatStore';
import { RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Empty,
  Input,
  Space,
  Spin,
  Typography,
  message,
} from 'antd';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

const { TextArea } = Input;
const { Text } = Typography;

export const ChatInterface: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    addMessage,
    apiConfig,
    currentProvider,
  } = useChatStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const currentConversation = conversations.find(
    c => c.id === currentConversationId,
  );

  const providerConfig = apiConfig[currentProvider];
  const apiKey = providerConfig?.apiKey || '';
  const model = providerConfig?.model || '';

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: We want to scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, scrollToBottom]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) {
      return;
    }

    if (!currentConversationId) {
      message.error('请先创建一个对话');
      return;
    }

    if (!apiKey) {
      message.error(`请先配置 ${currentProvider} 的 API Key`);
      return;
    }

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsStreaming(true);

    // 添加用户消息
    await addMessage(currentConversationId, {
      role: 'user',
      content: userMessage,
    });

    try {
      // 构建消息历史
      const messages = [
        ...(currentConversation?.messages || []).map(m => ({
          role: m.role,
          content: m.content,
        })),
        {
          role: 'user' as const,
          content: userMessage,
        },
      ];

      // 调用 API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          provider: currentProvider,
          apiKey,
          model,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API 调用失败');
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('0:')) {
              const content = line.slice(2).replace(/^"/, '').replace(/"$/, '');
              if (content) {
                assistantMessage += content;
              }
            }
          }
        }
      }

      // 添加 AI 回复
      if (assistantMessage) {
        await addMessage(currentConversationId, {
          role: 'assistant',
          content: assistantMessage,
        });
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      message.error(error instanceof Error ? error.message : '发送消息失败');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentConversationId) {
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Empty description="请选择或创建一个对话" />
      </div>
    );
  }

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 消息列表 */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '24px',
          backgroundColor: '#fafafa',
        }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {currentConversation?.messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Card
                size="small"
                style={{
                  maxWidth: '70%',
                  backgroundColor: msg.role === 'user' ? '#1890ff' : '#fff',
                  color: msg.role === 'user' ? '#fff' : '#000',
                }}
              >
                <Space direction="vertical" size={8} style={{ width: '100%' }}>
                  <Space>
                    {msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    <Text
                      strong
                      style={{ color: msg.role === 'user' ? '#fff' : '#000' }}
                    >
                      {msg.role === 'user' ? '你' : 'AI'}
                    </Text>
                  </Space>
                  <Text
                    style={{
                      color: msg.role === 'user' ? '#fff' : '#000',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </Text>
                </Space>
              </Card>
            </div>
          ))}
          {isStreaming && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Card size="small" style={{ maxWidth: '70%' }}>
                <Spin size="small" />
                <Text style={{ marginLeft: 8 }}>AI 正在思考...</Text>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </Space>
      </div>

      {/* 输入框 */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fff',
        }}
      >
        <Space.Compact style={{ width: '100%' }}>
          <TextArea
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息... (Enter 发送，Shift+Enter 换行)"
            autoSize={{ minRows: 1, maxRows: 4 }}
            disabled={isStreaming}
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isStreaming}
            loading={isStreaming}
          >
            发送
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
};
