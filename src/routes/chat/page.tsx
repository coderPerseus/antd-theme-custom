import { APISettings } from '@/components/APISettings';
import { ChatInterface } from '@/components/ChatInterface';
import { ConversationList } from '@/components/ConversationList';
import { useChatStore } from '@/stores/chatStore';
import { Layout, Space, Tag, Typography } from 'antd';
import type React from 'react';
import { useEffect } from 'react';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const ChatPage: React.FC = () => {
  const { loadFromStorage, currentProvider } = useChatStore();

  useEffect(() => {
    // 从本地存储加载数据
    loadFromStorage();
  }, [loadFromStorage]);

  const providerColors: Record<string, string> = {
    deepseek: 'blue',
    openai: 'green',
    anthropic: 'purple',
    google: 'orange',
  };

  const providerNames: Record<string, string> = {
    deepseek: 'Deepseek',
    openai: 'OpenAI',
    anthropic: 'Anthropic',
    google: 'Google',
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header
        style={{
          background: '#fff',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Space>
          <Title level={3} style={{ margin: 0 }}>
            AI 聊天助手
          </Title>
          <Tag color={providerColors[currentProvider]}>
            {providerNames[currentProvider]}
          </Tag>
        </Space>
        <APISettings />
      </Header>

      <Layout>
        <Sider
          width={300}
          style={{
            background: '#fff',
            height: 'calc(100vh - 64px)',
          }}
        >
          <ConversationList />
        </Sider>

        <Content
          style={{
            background: '#fff',
            height: 'calc(100vh - 64px)',
          }}
        >
          <ChatInterface />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ChatPage;
