import React, { useState } from 'react';
import {
  Tabs,
  Card,
  Descriptions,
  Timeline,
  Collapse,
  Modal,
  Drawer,
  Button,
  Space,
  notification,
  message,
  Alert,
  Result,
  Spin,
  Skeleton,
  Breadcrumb,
  Avatar,
  List,
  Popover,
  Affix,
  Anchor,
  BackTop,
  Calendar,
  Tree,
  Typography,
  Image,
  Carousel,
  Tooltip,
  FloatButton,
  QRCode,
  Watermark,
  Tour,
  Segmented,
} from 'antd';
import type { TourProps } from 'antd';
import {
  SettingOutlined,
  UserOutlined,
  BellOutlined,
  SecurityScanOutlined,
  HistoryOutlined,
  NotificationOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  TeamOutlined,
  FileTextOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { settingsStorage } from '../../../utils/storage';
import dayjs from 'dayjs';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const BlogSettingsPage: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [tourOpen, setTourOpen] = useState(false);

  const settings = settingsStorage.getSettings();

  // 通知示例
  const openNotification = (type: 'success' | 'info' | 'warning' | 'error') => {
    notification[type]({
      message: '系统通知',
      description:
        '这是一个 Ant Design 通知组件的示例，可以显示各种类型的通知消息。',
      placement: 'topRight',
    });
  };

  // Modal 内容
  const showModal = () => {
    setModalVisible(true);
  };

  const handleModalOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalVisible(false);
      message.success('操作成功');
    }, 2000);
  };

  // Drawer 内容
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  // Tour 步骤
  const tourSteps: TourProps['steps'] = [
    {
      title: '欢迎使用',
      description: '这是博客设置页面，在这里您可以管理所有配置',
      target: null,
    },
    {
      title: '基本设置',
      description: '查看和编辑网站的基本信息',
      target: () => document.querySelector('.basic-settings') as HTMLElement,
    },
  ];

  const timelineItems = [
    {
      color: 'green',
      children: (
        <>
          <p>创建博客平台 2025-01-01</p>
          <p>初始化项目配置和基础功能</p>
        </>
      ),
    },
    {
      color: 'blue',
      children: (
        <>
          <p>添加主题切换功能 2025-01-05</p>
          <p>支持明亮和暗黑两种模式</p>
        </>
      ),
    },
    {
      color: 'orange',
      children: (
        <>
          <p>集成所有 Antd 组件 2025-01-10</p>
          <p>完成三个主要页面的开发</p>
        </>
      ),
    },
    {
      children: (
        <>
          <p>持续优化中...</p>
          <p>欢迎提出建议和反馈</p>
        </>
      ),
    },
  ];

  const treeData = [
    {
      title: '博客管理',
      key: '0-0',
      icon: <FileTextOutlined />,
      children: [
        {
          title: '文章列表',
          key: '0-0-0',
          icon: <AppstoreOutlined />,
        },
        {
          title: '分类管理',
          key: '0-0-1',
          icon: <AppstoreOutlined />,
        },
        {
          title: '标签管理',
          key: '0-0-2',
          icon: <AppstoreOutlined />,
        },
      ],
    },
    {
      title: '用户管理',
      key: '0-1',
      icon: <TeamOutlined />,
      children: [
        {
          title: '用户列表',
          key: '0-1-0',
        },
        {
          title: '权限设置',
          key: '0-1-1',
        },
      ],
    },
    {
      title: '系统设置',
      key: '0-2',
      icon: <SettingOutlined />,
    },
  ];

  const listData = [
    {
      title: '如何使用主题切换功能？',
      description: '点击右上角的切换按钮即可在明亮和暗黑模式之间切换',
      avatar: <QuestionCircleOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: '如何创建新博客？',
      description: '进入博客列表页面，点击"创建博客"按钮即可开始撰写',
      avatar: <QuestionCircleOutlined style={{ fontSize: 24 }} />,
    },
    {
      title: '数据存储在哪里？',
      description: '所有数据都存储在浏览器的 localStorage 中，刷新不会丢失',
      avatar: <QuestionCircleOutlined style={{ fontSize: 24 }} />,
    },
  ];

  const carouselImages = [
    'https://via.placeholder.com/800x300/1890ff/ffffff?text=Slide+1',
    'https://via.placeholder.com/800x300/52c41a/ffffff?text=Slide+2',
    'https://via.placeholder.com/800x300/faad14/ffffff?text=Slide+3',
  ];

  const tabItems = [
    {
      key: '1',
      label: (
        <span>
          <SettingOutlined />
          基本设置
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Alert
            message="网站配置"
            description="查看和管理您的博客网站基本信息"
            type="info"
            showIcon
          />
          <Descriptions
            className="basic-settings"
            title="网站信息"
            bordered
            column={2}
          >
            <Descriptions.Item label="网站名称">
              {settings.siteName}
            </Descriptions.Item>
            <Descriptions.Item label="管理员">
              {settings.author}
            </Descriptions.Item>
            <Descriptions.Item label="邮箱">{settings.email}</Descriptions.Item>
            <Descriptions.Item label="主题">
              {settings.theme === 'light' ? '明亮模式' : '暗黑模式'}
            </Descriptions.Item>
            <Descriptions.Item label="网站描述" span={2}>
              {settings.siteDescription}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              2025-01-01 10:00:00
            </Descriptions.Item>
            <Descriptions.Item label="最后更新">
              {dayjs().format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
          </Descriptions>

          <Card title="快速操作" size="small">
            <Space wrap>
              <Button type="primary" icon={<SettingOutlined />}>
                编辑设置
              </Button>
              <Button icon={<CloudOutlined />}>备份数据</Button>
              <Button icon={<BarChartOutlined />}>查看统计</Button>
              <Button onClick={showModal}>打开 Modal</Button>
              <Button onClick={showDrawer}>打开 Drawer</Button>
            </Space>
          </Card>
        </Space>
      ),
    },
    {
      key: '2',
      label: (
        <span>
          <HistoryOutlined />
          操作历史
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="项目时间线">
            <Timeline items={timelineItems} mode="left" />
          </Card>

          <Collapse
            defaultActiveKey={['1']}
            items={[
              {
                key: '1',
                label: '2025年1月',
                children: (
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      { action: '创建博客', time: '2025-01-15 14:30' },
                      { action: '更新设置', time: '2025-01-14 10:20' },
                      { action: '删除文章', time: '2025-01-13 16:45' },
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={
                            <Avatar icon={<HistoryOutlined />} />
                          }
                          title={item.action}
                          description={item.time}
                        />
                      </List.Item>
                    )}
                  />
                ),
              },
              {
                key: '2',
                label: '2024年12月',
                children: <p>暂无历史记录</p>,
              },
            ]}
          />
        </Space>
      ),
    },
    {
      key: '3',
      label: (
        <span>
          <BellOutlined />
          通知中心
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="通知组件演示">
            <Space wrap>
              <Button onClick={() => openNotification('success')} type="primary">
                成功通知
              </Button>
              <Button onClick={() => openNotification('info')}>
                信息通知
              </Button>
              <Button onClick={() => openNotification('warning')}>
                警告通知
              </Button>
              <Button onClick={() => openNotification('error')} danger>
                错误通知
              </Button>
            </Space>
          </Card>

          <Card title="消息组件演示">
            <Space wrap>
              <Button onClick={() => message.success('操作成功！')}>
                成功消息
              </Button>
              <Button onClick={() => message.info('这是一条信息')}>
                信息消息
              </Button>
              <Button onClick={() => message.warning('请注意！')}>
                警告消息
              </Button>
              <Button onClick={() => message.error('操作失败！')}>
                错误消息
              </Button>
              <Button onClick={() => message.loading('加载中...', 2)}>
                加载消息
              </Button>
            </Space>
          </Card>

          <Alert
            message="系统公告"
            description="欢迎使用 Antd Theme Blog，这是一个完整的主题预览平台。"
            type="success"
            showIcon
            closable
          />
        </Space>
      ),
    },
    {
      key: '4',
      label: (
        <span>
          <AppstoreOutlined />
          组件展示
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Card title="加载状态">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Spin tip="加载中...">
                <div style={{ padding: 50, background: '#f5f5f5' }}>
                  <p>内容区域</p>
                </div>
              </Spin>
              <Skeleton active />
            </Space>
          </Card>

          <Card title="轮播图">
            <Carousel autoplay>
              {carouselImages.map((img, index) => (
                <div key={index}>
                  <div
                    style={{
                      height: 300,
                      background: `url(${img})`,
                      backgroundSize: 'cover',
                    }}
                  />
                </div>
              ))}
            </Carousel>
          </Card>

          <Card title="日历组件">
            <Calendar
              fullscreen={false}
              onSelect={(date) => message.info(`选择了: ${date.format('YYYY-MM-DD')}`)}
            />
          </Card>

          <Card title="树形控件">
            <Tree
              showIcon
              defaultExpandAll
              treeData={treeData}
              onSelect={(keys) => message.info(`选中: ${keys.join(', ')}`)}
            />
          </Card>

          <Card title="二维码">
            <Space>
              <QRCode value="https://ant.design/" />
              <QRCode
                value="https://ant.design/"
                status="expired"
                onRefresh={() => message.success('刷新成功')}
              />
            </Space>
          </Card>
        </Space>
      ),
    },
    {
      key: '5',
      label: (
        <span>
          <QuestionCircleOutlined />
          帮助中心
        </span>
      ),
      children: (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Breadcrumb
            items={[
              { href: '/', title: <HomeOutlined /> },
              { title: '设置' },
              { title: '帮助中心' },
            ]}
          />

          <Result
            icon={<QuestionCircleOutlined />}
            title="常见问题"
            subTitle="查看下方列表了解更多信息"
            extra={
              <Space>
                <Button type="primary">联系客服</Button>
                <Button onClick={() => setTourOpen(true)}>功能引导</Button>
              </Space>
            }
          />

          <List
            itemLayout="horizontal"
            dataSource={listData}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Popover content="点击查看详情" key="detail">
                    <Button type="link">详情</Button>
                  </Popover>,
                ]}
              >
                <List.Item.Meta
                  avatar={item.avatar}
                  title={<Text strong>{item.title}</Text>}
                  description={item.description}
                />
              </List.Item>
            )}
          />

          <Watermark content="Antd Theme Blog">
            <Card title="水印示例" style={{ height: 300 }}>
              <Paragraph>
                这是一个带有水印的卡片组件示例。水印可以用于保护内容版权。
              </Paragraph>
            </Card>
          </Watermark>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Title level={2}>设置中心</Title>
          <Paragraph type="secondary">
            管理您的博客配置、查看历史记录、接收通知以及探索所有组件
          </Paragraph>
        </Card>

        <Tabs activeKey={activeTab} items={tabItems} onChange={setActiveTab} />

        {/* Modal */}
        <Modal
          title="Modal 示例"
          open={modalVisible}
          onOk={handleModalOk}
          onCancel={() => setModalVisible(false)}
          confirmLoading={loading}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message="这是一个 Modal 对话框"
              description="Modal 用于需要用户处理事务，又不希望跳转页面以致打断工作流程时使用。"
              type="info"
            />
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="用途">弹出式对话框</Descriptions.Item>
              <Descriptions.Item label="特点">
                支持确认、取消操作
              </Descriptions.Item>
              <Descriptions.Item label="场景">
                表单提交、信息确认
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Modal>

        {/* Drawer */}
        <Drawer
          title="Drawer 示例"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={500}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="抽屉组件"
              description="屏幕边缘滑出的浮层面板，适合需要展示详细信息或进行复杂操作的场景。"
              type="success"
              showIcon
            />
            <Image
              width="100%"
              src="https://via.placeholder.com/400x300/1890ff/ffffff?text=Drawer+Content"
            />
            <Paragraph>
              Drawer 抽屉从父窗体边缘滑入，覆盖住部分父窗体内容。用户在抽屉内操作时不必离开当前任务，操作完成后，可以平滑地回到原任务。
            </Paragraph>
            <List
              size="small"
              dataSource={[
                '当需要一个附加的面板来控制父窗体内容',
                '当需要在当前任务流中插入临时任务',
                '当需要展示或编辑详细信息',
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Space>
        </Drawer>

        {/* Tour */}
        <Tour open={tourOpen} onClose={() => setTourOpen(false)} steps={tourSteps} />

        {/* FloatButton */}
        <FloatButton.Group
          trigger="hover"
          type="primary"
          style={{ right: 24 }}
          icon={<QuestionCircleOutlined />}
        >
          <FloatButton icon={<BellOutlined />} tooltip="通知" />
          <FloatButton icon={<SettingOutlined />} tooltip="设置" />
        </FloatButton.Group>

        {/* BackTop */}
        <BackTop />
      </Space>
    </div>
  );
};

export default BlogSettingsPage;
