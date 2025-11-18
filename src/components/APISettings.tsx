import { useChatStore } from '@/stores/chatStore';
import type { AIProvider } from '@/types/chat';
import { SettingOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, message } from 'antd';
import type React from 'react';
import { useState } from 'react';

const { Option } = Select;

export const APISettings: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { apiConfig, currentProvider, setAPIConfig, setCurrentProvider } =
    useChatStore();
  const [form] = Form.useForm();

  const showModal = () => {
    // 设置表单初始值
    form.setFieldsValue({
      provider: currentProvider,
      deepseekApiKey: apiConfig.deepseek?.apiKey || '',
      deepseekModel: apiConfig.deepseek?.model || 'deepseek-chat',
      openaiApiKey: apiConfig.openai?.apiKey || '',
      openaiModel: apiConfig.openai?.model || 'gpt-4o-mini',
      anthropicApiKey: apiConfig.anthropic?.apiKey || '',
      anthropicModel:
        apiConfig.anthropic?.model || 'claude-3-5-sonnet-20241022',
      googleApiKey: apiConfig.google?.apiKey || '',
      googleModel: apiConfig.google?.model || 'gemini-1.5-flash',
    });
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // 更新配置
      await setAPIConfig({
        deepseek: {
          apiKey: values.deepseekApiKey,
          model: values.deepseekModel,
        },
        openai: {
          apiKey: values.openaiApiKey,
          model: values.openaiModel,
        },
        anthropic: {
          apiKey: values.anthropicApiKey,
          model: values.anthropicModel,
        },
        google: {
          apiKey: values.googleApiKey,
          model: values.googleModel,
        },
      });

      setCurrentProvider(values.provider);
      message.success('配置已保存');
      setIsModalVisible(false);
    } catch (error) {
      console.error('保存配置失败:', error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button icon={<SettingOutlined />} onClick={showModal} type="text">
        API 配置
      </Button>

      <Modal
        title="AI API 配置"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            provider: currentProvider,
          }}
        >
          <Form.Item
            label="当前使用的 AI 提供商"
            name="provider"
            rules={[{ required: true, message: '请选择 AI 提供商' }]}
          >
            <Select>
              <Option value="deepseek">Deepseek (默认)</Option>
              <Option value="openai">OpenAI</Option>
              <Option value="anthropic">Anthropic</Option>
              <Option value="google">Google</Option>
            </Select>
          </Form.Item>

          {/* Deepseek 配置 */}
          <div style={{ marginTop: 24 }}>
            <h4>Deepseek 配置</h4>
            <Form.Item label="API Key" name="deepseekApiKey">
              <Input.Password placeholder="sk-..." />
            </Form.Item>
            <Form.Item label="模型" name="deepseekModel">
              <Input placeholder="deepseek-chat" />
            </Form.Item>
          </div>

          {/* OpenAI 配置 */}
          <div style={{ marginTop: 24 }}>
            <h4>OpenAI 配置</h4>
            <Form.Item label="API Key" name="openaiApiKey">
              <Input.Password placeholder="sk-..." />
            </Form.Item>
            <Form.Item label="模型" name="openaiModel">
              <Input placeholder="gpt-4o-mini" />
            </Form.Item>
          </div>

          {/* Anthropic 配置 */}
          <div style={{ marginTop: 24 }}>
            <h4>Anthropic 配置</h4>
            <Form.Item label="API Key" name="anthropicApiKey">
              <Input.Password placeholder="sk-ant-..." />
            </Form.Item>
            <Form.Item label="模型" name="anthropicModel">
              <Input placeholder="claude-3-5-sonnet-20241022" />
            </Form.Item>
          </div>

          {/* Google 配置 */}
          <div style={{ marginTop: 24 }}>
            <h4>Google 配置</h4>
            <Form.Item label="API Key" name="googleApiKey">
              <Input.Password placeholder="AIza..." />
            </Form.Item>
            <Form.Item label="模型" name="googleModel">
              <Input placeholder="gemini-1.5-flash" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  );
};
