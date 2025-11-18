import {
  ApiOutlined,
  BulbOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  RocketOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useNavigate } from '@modern-js/runtime/router';
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Statistic,
  Tag,
  Timeline,
  Typography,
} from 'antd';
import type React from 'react';

const { Title, Paragraph, Text } = Typography;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      {/* Hero Section */}
      <div style={{ padding: '80px 50px', textAlign: 'center', color: '#fff' }}>
        <Title
          level={1}
          style={{ color: '#fff', fontSize: 56, marginBottom: 24 }}
        >
          Antd Theme Generator
        </Title>
        <Paragraph
          style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 800,
            margin: '0 auto 40px',
          }}
        >
          通过大语言模型对话生成 Ant Design 的主题
          Token，实时预览并应用到您的项目中
        </Paragraph>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={() => navigate('/blog/list')}
            style={{ height: 50, fontSize: 16, padding: '0 40px' }}
          >
            开始体验
          </Button>
          <Button
            size="large"
            icon={<EditOutlined />}
            onClick={() => navigate('/blog/edit')}
            style={{
              height: 50,
              fontSize: 16,
              padding: '0 40px',
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            创建博客
          </Button>
        </Space>
      </div>

      {/* Features Section */}
      <div style={{ padding: '60px 50px', background: '#fff' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 50 }}>
          核心功能
        </Title>
        <Row gutter={[32, 32]}>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
              <BulbOutlined
                style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }}
              />
              <Title level={4}>AI 驱动主题生成</Title>
              <Paragraph>
                通过与大语言模型对话，智能生成符合您需求的主题配置
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
              <ThunderboltOutlined
                style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }}
              />
              <Title level={4}>实时预览</Title>
              <Paragraph>
                所见即所得，主题修改即时生效，快速调整到最佳状态
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
              <ApiOutlined
                style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }}
              />
              <Title level={4}>完整组件展示</Title>
              <Paragraph>
                集成 Ant Design 所有组件，全面测试主题在各场景下的表现
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card hoverable style={{ textAlign: 'center', height: '100%' }}>
              <EyeOutlined
                style={{ fontSize: 48, color: '#722ed1', marginBottom: 16 }}
              />
              <Title level={4}>暗黑模式</Title>
              <Paragraph>
                完美支持明亮/暗黑模式切换，自动适配所有组件样式
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Stats Section */}
      <div style={{ padding: '60px 50px', background: '#f5f5f5' }}>
        <Row gutter={[32, 32]}>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="Ant Design 组件"
                value={50}
                suffix="+"
                valueStyle={{ color: '#3f8600' }}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="主题配置项"
                value={100}
                suffix="+"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="示例页面"
                value={3}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="开发效率提升"
                value={80}
                suffix="%"
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* How it works */}
      <div style={{ padding: '60px 50px', background: '#fff' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 50 }}>
          工作流程
        </Title>
        <Row justify="center">
          <Col xs={24} lg={16}>
            <Timeline
              mode="alternate"
              items={[
                {
                  children: (
                    <Card>
                      <Space direction="vertical">
                        <Badge count={1} style={{ backgroundColor: '#1890ff' }}>
                          <div style={{ width: 40 }} />
                        </Badge>
                        <Title level={4}>描述您的主题需求</Title>
                        <Text type="secondary">
                          告诉 AI 您想要什么样的主题风格、颜色搭配等
                        </Text>
                      </Space>
                    </Card>
                  ),
                },
                {
                  children: (
                    <Card>
                      <Space direction="vertical">
                        <Badge count={2} style={{ backgroundColor: '#52c41a' }}>
                          <div style={{ width: 40 }} />
                        </Badge>
                        <Title level={4}>AI 生成主题配置</Title>
                        <Text type="secondary">
                          大语言模型分析您的需求，生成对应的 Token 配置
                        </Text>
                      </Space>
                    </Card>
                  ),
                },
                {
                  children: (
                    <Card>
                      <Space direction="vertical">
                        <Badge count={3} style={{ backgroundColor: '#faad14' }}>
                          <div style={{ width: 40 }} />
                        </Badge>
                        <Title level={4}>实时预览效果</Title>
                        <Text type="secondary">
                          在博客平台中查看所有组件的主题表现
                        </Text>
                      </Space>
                    </Card>
                  ),
                },
                {
                  children: (
                    <Card>
                      <Space direction="vertical">
                        <Badge count={4} style={{ backgroundColor: '#722ed1' }}>
                          <div style={{ width: 40 }} />
                        </Badge>
                        <Title level={4}>导出并应用</Title>
                        <Text type="secondary">
                          满意后导出配置，应用到您的实际项目中
                        </Text>
                      </Space>
                    </Card>
                  ),
                },
              ]}
            />
          </Col>
        </Row>
      </div>

      {/* Call to Action */}
      <div
        style={{
          padding: '80px 50px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          textAlign: 'center',
        }}
      >
        <Title level={2} style={{ color: '#fff', marginBottom: 24 }}>
          立即开始体验
        </Title>
        <Paragraph
          style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.85)',
            marginBottom: 40,
          }}
        >
          探索博客平台，查看所有 Ant Design 组件在不同主题下的表现
        </Paragraph>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            onClick={() => navigate('/blog/list')}
            style={{ height: 50, fontSize: 16, padding: '0 40px' }}
          >
            查看博客列表
          </Button>
          <Button
            size="large"
            onClick={() => navigate('/blog/settings')}
            style={{
              height: 50,
              fontSize: 16,
              padding: '0 40px',
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            主题设置
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default HomePage;
