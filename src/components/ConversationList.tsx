import { useChatStore } from '@/stores/chatStore';
import type { Conversation } from '@/types/chat';
import {
  DeleteOutlined,
  MessageOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, List, Popconfirm, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import type React from 'react';

const { Text } = Typography;

export const ConversationList: React.FC = () => {
  const {
    conversations,
    currentConversationId,
    createConversation,
    deleteConversation,
    setCurrentConversation,
  } = useChatStore();

  const handleCreateConversation = async () => {
    await createConversation('新对话');
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteConversation(id);
  };

  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id);
  };

  const formatTime = (timestamp: number) => {
    const now = dayjs();
    const date = dayjs(timestamp);
    const diffDays = now.diff(date, 'day');

    if (diffDays === 0) {
      return date.format('HH:mm');
    }
    if (diffDays === 1) {
      return '昨天';
    }
    if (diffDays < 7) {
      return `${diffDays}天前`;
    }
    return date.format('MM-DD');
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #f0f0f0',
      }}
    >
      <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreateConversation}
          block
        >
          新建对话
        </Button>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <List
          dataSource={conversations}
          renderItem={(conversation: Conversation) => {
            const isActive = conversation.id === currentConversationId;
            const lastMessage =
              conversation.messages[conversation.messages.length - 1];
            const preview = lastMessage?.content.slice(0, 30) || '暂无消息';

            return (
              <List.Item
                key={conversation.id}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#e6f7ff' : 'transparent',
                  borderLeft: isActive
                    ? '3px solid #1890ff'
                    : '3px solid transparent',
                }}
                onClick={() => handleSelectConversation(conversation.id)}
              >
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <Space
                    direction="vertical"
                    size={4}
                    style={{ width: '100%' }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Text strong ellipsis style={{ flex: 1 }}>
                        <MessageOutlined style={{ marginRight: 8 }} />
                        {conversation.title}
                      </Text>
                      <Popconfirm
                        title="确定删除这个对话吗？"
                        onConfirm={e => {
                          e?.stopPropagation();
                          handleDeleteConversation(conversation.id);
                        }}
                        onCancel={e => e?.stopPropagation()}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={e => e.stopPropagation()}
                        />
                      </Popconfirm>
                    </div>
                    <Text type="secondary" ellipsis style={{ fontSize: 12 }}>
                      {preview}
                    </Text>
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {formatTime(conversation.updatedAt)}
                    </Text>
                  </Space>
                </div>
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
};
