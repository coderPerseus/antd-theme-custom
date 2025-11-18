import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Upload,
  Button,
  Card,
  Steps,
  Space,
  Row,
  Col,
  Divider,
  message,
  Radio,
  Checkbox,
  Switch,
  Slider,
  Rate,
  ColorPicker,
  TimePicker,
  InputNumber,
  Mentions,
  AutoComplete,
  Cascader,
  TreeSelect,
  Transfer,
  Typography,
  Alert,
  Progress,
} from 'antd';
import {
  UploadOutlined,
  InboxOutlined,
  SaveOutlined,
  EyeOutlined,
  CloseOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from '@modern-js/runtime/router';
import { useLocalStorageState } from 'ahooks';
import type { BlogPost } from '../../../types/blog';
import { blogStorage } from '../../../utils/storage';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const BlogEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<BlogPost>>({});
  const [loading, setLoading] = useState(false);

  // 预览开关
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (id) {
      const post = blogStorage.getPostById(id);
      if (post) {
        form.setFieldsValue({
          ...post,
          createdAt: dayjs(post.createdAt),
        });
        setFormData(post);
      }
    }
  }, [id]);

  const handleFormChange = (_: any, allValues: any) => {
    setFormData(allValues);
  };

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      const postData: BlogPost = {
        id: id || Date.now().toString(),
        title: values.title,
        content: values.content,
        summary: values.summary,
        author: values.author,
        tags: values.tags || [],
        category: values.category,
        status: values.status,
        coverImage: values.coverImage,
        createdAt: id
          ? blogStorage.getPostById(id)?.createdAt || new Date().toISOString()
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: id ? blogStorage.getPostById(id)?.views || 0 : 0,
        likes: id ? blogStorage.getPostById(id)?.likes || 0 : 0,
      };

      if (id) {
        blogStorage.updatePost(id, postData);
        message.success('更新成功');
      } else {
        blogStorage.addPost(postData);
        message.success('创建成功');
      }

      setTimeout(() => {
        navigate('/blog/list');
      }, 1000);
    } catch (error) {
      message.error('保存失败');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: '技术', label: '技术', emoji: '💻' },
    { value: '生活', label: '生活', emoji: '🌈' },
    { value: '旅行', label: '旅行', emoji: '✈️' },
    { value: '美食', label: '美食', emoji: '🍔' },
    { value: '学习', label: '学习', emoji: '📚' },
    { value: '随笔', label: '随笔', emoji: '✍️' },
  ];

  const tagOptions = [
    'React',
    'Vue',
    'JavaScript',
    'TypeScript',
    'Antd',
    'Node.js',
    'Python',
    'Go',
    '前端',
    '后端',
    '全栈',
    '算法',
    '设计模式',
  ];

  const steps = [
    {
      title: '基本信息',
      description: '填写标题和摘要',
    },
    {
      title: '内容编辑',
      description: '撰写博客内容',
    },
    {
      title: '详细设置',
      description: '分类、标签等',
    },
    {
      title: '发布设置',
      description: '状态和预览',
    },
  ];

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info: any) {
      const { status } = info.file;
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="第一步：基本信息"
              description="请填写博客的标题和简短摘要，这将帮助读者快速了解您的内容"
              type="info"
              showIcon
            />
            <Form.Item
              label="博客标题"
              name="title"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input
                size="large"
                placeholder="请输入一个吸引人的标题"
                showCount
                maxLength={100}
              />
            </Form.Item>
            <Form.Item
              label="博客摘要"
              name="summary"
              rules={[{ required: true, message: '请输入摘要' }]}
            >
              <TextArea
                rows={4}
                placeholder="请用 100-200 字简要描述您的博客内容"
                showCount
                maxLength={200}
              />
            </Form.Item>
            <Form.Item label="作者" name="author" initialValue="Admin">
              <Input placeholder="作者名称" />
            </Form.Item>
            <Form.Item label="字数统计">
              <Progress
                percent={Math.min(
                  ((formData.title?.length || 0) / 100) * 100,
                  100,
                )}
                format={(percent) => `标题: ${formData.title?.length || 0}/100`}
              />
              <Progress
                percent={Math.min(
                  ((formData.summary?.length || 0) / 200) * 100,
                  100,
                )}
                format={(percent) =>
                  `摘要: ${formData.summary?.length || 0}/200`
                }
                strokeColor="#52c41a"
              />
            </Form.Item>
          </Space>
        );

      case 1:
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="第二步：内容编辑"
              description="撰写您的博客正文内容，支持 Markdown 格式"
              type="info"
              showIcon
            />
            <Form.Item
              label="博客内容"
              name="content"
              rules={[{ required: true, message: '请输入内容' }]}
            >
              <TextArea
                rows={15}
                placeholder="请输入博客正文内容，支持 Markdown 格式"
                showCount
              />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="封面图片" name="coverImage">
                  <Input placeholder="图片 URL" prefix={<PlusOutlined />} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="或上传封面">
                  <Upload {...uploadProps} maxCount={1}>
                    <Button icon={<UploadOutlined />}>点击上传</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="附件上传">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持单个或批量上传，严禁上传公司数据或其他敏感文件
                </p>
              </Dragger>
            </Form.Item>
          </Space>
        );

      case 2:
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="第三步：详细设置"
              description="为您的博客选择合适的分类和标签"
              type="info"
              showIcon
            />
            <Form.Item
              label="分类"
              name="category"
              rules={[{ required: true, message: '请选择分类' }]}
            >
              <Select
                size="large"
                placeholder="选择博客分类"
                options={categories.map((cat) => ({
                  ...cat,
                  label: `${cat.emoji} ${cat.label}`,
                }))}
              />
            </Form.Item>
            <Form.Item label="标签" name="tags">
              <Select
                mode="tags"
                placeholder="选择或输入标签"
                options={tagOptions.map((tag) => ({ value: tag, label: tag }))}
              />
            </Form.Item>
            <Divider />
            <Form.Item label="阅读时长（分钟）" name="readTime">
              <Slider
                min={1}
                max={60}
                marks={{
                  1: '1分钟',
                  15: '15分钟',
                  30: '30分钟',
                  60: '1小时',
                }}
              />
            </Form.Item>
            <Form.Item label="难度等级" name="difficulty">
              <Rate
                count={5}
                character={({ index = 0 }) => {
                  const levels = ['入门', '初级', '中级', '高级', '专家'];
                  return levels[index];
                }}
              />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="发布时间" name="publishTime">
                  <DatePicker
                    showTime
                    style={{ width: '100%' }}
                    placeholder="选择发布时间"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="定时发布" name="scheduled">
                  <TimePicker style={{ width: '100%' }} format="HH:mm" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="主题颜色" name="themeColor">
              <ColorPicker showText />
            </Form.Item>
          </Space>
        );

      case 3:
        return (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Alert
              message="第四步：发布设置"
              description="设置博客状态和其他发布选项"
              type="info"
              showIcon
            />
            <Form.Item
              label="发布状态"
              name="status"
              initialValue="draft"
              rules={[{ required: true }]}
            >
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="draft">草稿</Radio.Button>
                <Radio.Button value="published">发布</Radio.Button>
                <Radio.Button value="archived">归档</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="附加选项" name="options">
              <Checkbox.Group>
                <Space direction="vertical">
                  <Checkbox value="comments">允许评论</Checkbox>
                  <Checkbox value="share">允许分享</Checkbox>
                  <Checkbox value="recommend">推荐到首页</Checkbox>
                  <Checkbox value="top">置顶显示</Checkbox>
                </Space>
              </Checkbox.Group>
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="预计阅读人数"
                  name="expectedReaders"
                  initialValue={100}
                >
                  <InputNumber
                    min={0}
                    max={100000}
                    style={{ width: '100%' }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="重要程度"
                  name="priority"
                  initialValue={3}
                >
                  <Rate />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="SEO 关键词" name="keywords">
              <Mentions
                style={{ width: '100%' }}
                placeholder="输入 SEO 关键词，使用 @ 提及"
                rows={3}
                options={tagOptions.map((tag) => ({ value: tag, label: tag }))}
              />
            </Form.Item>
            <Form.Item label="自动保存" name="autoSave" valuePropName="checked">
              <Switch checkedChildren="开启" unCheckedChildren="关闭" />
            </Form.Item>
            <Divider>预览</Divider>
            <Card
              title={formData.title || '未命名博客'}
              extra={
                <Space>
                  {formData.status === 'published' && (
                    <Button type="primary" size="small">
                      已发布
                    </Button>
                  )}
                  {formData.category && (
                    <Button size="small">{formData.category}</Button>
                  )}
                </Space>
              }
            >
              <Paragraph>{formData.summary || '暂无摘要'}</Paragraph>
              <Space wrap>
                {formData.tags?.map((tag: string) => (
                  <Button key={tag} size="small" type="dashed">
                    #{tag}
                  </Button>
                ))}
              </Space>
            </Card>
          </Space>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={2}>{id ? '编辑博客' : '创建博客'}</Title>
        <Paragraph type="secondary">
          使用分步表单创建或编辑您的博客文章，填写所有必要信息
        </Paragraph>

        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: 32 }}
        />

        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleFormChange}
          onFinish={handleSave}
        >
          {renderStepContent()}

          <Divider />

          <Row justify="space-between">
            <Col>
              {currentStep > 0 && (
                <Button onClick={() => setCurrentStep(currentStep - 1)}>
                  上一步
                </Button>
              )}
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => navigate('/blog/list')}
                >
                  取消
                </Button>
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="primary"
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    下一步
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SaveOutlined />}
                  >
                    {id ? '更新博客' : '创建博客'}
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default BlogEditPage;
