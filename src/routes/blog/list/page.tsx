import React, { useState, useMemo } from 'react';
import {
  Table,
  Card,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
  Avatar,
  Tooltip,
  Typography,
  Row,
  Col,
  Statistic,
  Progress,
  Empty,
  Radio,
  DatePicker,
  Segmented,
  Dropdown,
  Badge,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  PlusOutlined,
  HeartOutlined,
  StarOutlined,
  FilterOutlined,
  DownloadOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { useNavigate } from '@modern-js/runtime/router';
import { useLocalStorageState } from 'ahooks';
import type { BlogPost } from '../../../types/blog';
import { blogStorage } from '../../../utils/storage';
import dayjs from 'dayjs';

const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { RangePicker } = DatePicker;

const BlogListPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useLocalStorageState<BlogPost[]>('blog_posts', {
    defaultValue: blogStorage.getPosts(),
  });

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  // 过滤数据
  const filteredPosts = useMemo(() => {
    let result = posts || [];

    if (searchText) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchText.toLowerCase()) ||
          post.content.toLowerCase().includes(searchText.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchText.toLowerCase()),
          ),
      );
    }

    if (selectedCategory !== 'all') {
      result = result.filter((post) => post.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      result = result.filter((post) => post.status === selectedStatus);
    }

    if (dateRange) {
      result = result.filter((post) => {
        const postDate = dayjs(post.createdAt);
        return postDate.isAfter(dateRange[0]) && postDate.isBefore(dateRange[1]);
      });
    }

    return result;
  }, [posts, searchText, selectedCategory, selectedStatus, dateRange]);

  const handleDelete = (id: string) => {
    blogStorage.deletePost(id);
    setPosts(blogStorage.getPosts());
    message.success('删除成功');
  };

  const categories = Array.from(new Set(posts?.map((p) => p.category) || []));
  const totalViews = posts?.reduce((sum, post) => sum + post.views, 0) || 0;
  const totalLikes = posts?.reduce((sum, post) => sum + post.likes, 0) || 0;

  const statusColors: Record<string, string> = {
    published: 'green',
    draft: 'orange',
    archived: 'default',
  };

  const statusText: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
    archived: '已归档',
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      render: (text: string, record: BlogPost) => (
        <Space>
          <Avatar style={{ backgroundColor: '#1890ff' }}>
            {text.charAt(0)}
          </Avatar>
          <div>
            <div>
              <Text strong>{text}</Text>
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.author} · {dayjs(record.createdAt).format('YYYY-MM-DD')}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: '摘要',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
      render: (category: string) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag} color="cyan">
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={statusColors[status]}>{statusText[status]}</Tag>
      ),
    },
    {
      title: '数据',
      key: 'stats',
      width: 150,
      render: (_: any, record: BlogPost) => (
        <Space direction="vertical" size="small">
          <div>
            <EyeOutlined /> {record.views} 浏览
          </div>
          <div>
            <HeartOutlined /> {record.likes} 点赞
          </div>
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: BlogPost) => (
        <Space>
          <Tooltip title="查看">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/blog/detail/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/blog/edit/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm
            title="确定删除这篇博客吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const renderCardView = () => (
    <Row gutter={[16, 16]}>
      {filteredPosts.map((post) => (
        <Col xs={24} sm={12} lg={8} key={post.id}>
          <Card
            hoverable
            actions={[
              <Tooltip title="查看">
                <EyeOutlined
                  key="view"
                  onClick={() => navigate(`/blog/detail/${post.id}`)}
                />
              </Tooltip>,
              <Tooltip title="编辑">
                <EditOutlined
                  key="edit"
                  onClick={() => navigate(`/blog/edit/${post.id}`)}
                />
              </Tooltip>,
              <Popconfirm
                title="确定删除？"
                onConfirm={() => handleDelete(post.id)}
                key="delete"
              >
                <DeleteOutlined />
              </Popconfirm>,
            ]}
          >
            <Card.Meta
              avatar={
                <Avatar style={{ backgroundColor: '#1890ff' }}>
                  {post.title.charAt(0)}
                </Avatar>
              }
              title={
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <Text strong>{post.title}</Text>
                  <Tag color={statusColors[post.status]}>
                    {statusText[post.status]}
                  </Tag>
                </Space>
              }
              description={
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Paragraph ellipsis={{ rows: 2 }}>{post.summary}</Paragraph>
                  <div>
                    {post.tags.map((tag) => (
                      <Tag key={tag} color="cyan" style={{ marginBottom: 4 }}>
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <Space>
                    <Text type="secondary">
                      <EyeOutlined /> {post.views}
                    </Text>
                    <Text type="secondary">
                      <HeartOutlined /> {post.likes}
                    </Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}
                  </Text>
                </Space>
              }
            />
          </Card>
        </Col>
      ))}
      {filteredPosts.length === 0 && (
        <Col span={24}>
          <Empty description="暂无数据" />
        </Col>
      )}
    </Row>
  );

  return (
    <div style={{ padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 统计卡片 */}
        <Row gutter={16}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总文章数"
                value={posts?.length || 0}
                prefix={<FileTextOutlined />}
              />
              <Progress
                percent={100}
                showInfo={false}
                strokeColor="#1890ff"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="已发布"
                value={
                  posts?.filter((p) => p.status === 'published').length || 0
                }
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckCircleOutlined />}
              />
              <Progress
                percent={
                  posts?.length
                    ? (posts.filter((p) => p.status === 'published').length /
                        posts.length) *
                      100
                    : 0
                }
                showInfo={false}
                strokeColor="#52c41a"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总浏览量"
                value={totalViews}
                prefix={<EyeOutlined />}
              />
              <Progress
                percent={100}
                showInfo={false}
                strokeColor="#faad14"
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="总点赞数"
                value={totalLikes}
                prefix={<HeartOutlined />}
                valueStyle={{ color: '#eb2f96' }}
              />
              <Progress
                percent={100}
                showInfo={false}
                strokeColor="#eb2f96"
              />
            </Card>
          </Col>
        </Row>

        {/* 筛选区域 */}
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Row gutter={[16, 16]} align="middle">
              <Col flex="auto">
                <Title level={4} style={{ margin: 0 }}>
                  博客列表
                </Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate('/blog/edit')}
                >
                  创建博客
                </Button>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <Search
                  placeholder="搜索标题、内容或标签"
                  allowClear
                  enterButton={<SearchOutlined />}
                  onSearch={setSearchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="选择分类"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                >
                  <Select.Option value="all">全部分类</Select.Option>
                  {categories.map((cat) => (
                    <Select.Option key={cat} value={cat}>
                      {cat}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={12} sm={6} lg={4}>
                <Select
                  style={{ width: '100%' }}
                  placeholder="选择状态"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                >
                  <Select.Option value="all">全部状态</Select.Option>
                  <Select.Option value="published">已发布</Select.Option>
                  <Select.Option value="draft">草稿</Select.Option>
                  <Select.Option value="archived">已归档</Select.Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <RangePicker
                  style={{ width: '100%' }}
                  onChange={(dates) =>
                    setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])
                  }
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} align="middle">
              <Col flex="auto">
                <Space>
                  <Text type="secondary">视图模式:</Text>
                  <Segmented
                    value={viewMode}
                    onChange={(value) => setViewMode(value as 'table' | 'card')}
                    options={[
                      { label: '表格', value: 'table' },
                      { label: '卡片', value: 'card' },
                    ]}
                  />
                </Space>
              </Col>
              <Col>
                <Space>
                  <Badge count={filteredPosts.length} showZero>
                    <Button icon={<FilterOutlined />}>筛选结果</Button>
                  </Badge>
                  <Dropdown
                    menu={{
                      items: [
                        { key: 'export', label: '导出数据', icon: <DownloadOutlined /> },
                        { key: 'share', label: '分享', icon: <ShareAltOutlined /> },
                      ],
                    }}
                  >
                    <Button>更多操作</Button>
                  </Dropdown>
                </Space>
              </Col>
            </Row>
          </Space>
        </Card>

        {/* 列表内容 */}
        <Card>
          {viewMode === 'table' ? (
            <Table
              columns={columns}
              dataSource={filteredPosts}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
              }}
            />
          ) : (
            renderCardView()
          )}
        </Card>
      </Space>
    </div>
  );
};

// 补充缺失的图标导入
import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';

export default BlogListPage;
