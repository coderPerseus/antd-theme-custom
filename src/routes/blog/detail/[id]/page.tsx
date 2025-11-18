import {
  ArrowLeftOutlined,
  CalendarOutlined,
  EditOutlined,
  EyeOutlined,
  FolderOutlined,
  HeartOutlined,
  TagsOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from '@modern-js/runtime/router';
import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Row,
  Space,
  Statistic,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import type { BlogPost } from '../../../../types/blog';
import { blogStorage } from '../../../../utils/storage';

const { Title, Paragraph, Text } = Typography;

const BlogDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // 获取博客文章
      const blogPost = blogStorage.getPostById(id);

      if (blogPost) {
        // 增加浏览次数
        const updatedPost = {
          ...blogPost,
          views: blogPost.views + 1,
        };
        blogStorage.updatePost(id, updatedPost);
        setPost(updatedPost);
      }

      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Card loading={loading} />
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message="博客未找到"
          description="抱歉，您访问的博客不存在或已被删除"
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/blog/list')}>
              返回列表
            </Button>
          }
        />
      </div>
    );
  }

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

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            {
              title: (
                <Button
                  type="link"
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => navigate('/')}
                >
                  首页
                </Button>
              ),
            },
            {
              title: (
                <Button
                  type="link"
                  style={{ padding: 0, height: 'auto' }}
                  onClick={() => navigate('/blog/list')}
                >
                  博客列表
                </Button>
              ),
            },
            {
              title: post.title,
            },
          ]}
        />

        {/* 返回按钮 */}
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/blog/list')}
        >
          返回列表
        </Button>

        {/* 主内容卡片 */}
        <Card>
          {/* 文章头部 */}
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* 标题和状态 */}
            <div>
              <Space align="start">
                <Title level={1} style={{ margin: 0 }}>
                  {post.title}
                </Title>
                <Tag color={statusColors[post.status]}>
                  {statusText[post.status]}
                </Tag>
              </Space>
            </div>

            {/* 元信息 */}
            <Space wrap size="large">
              <Space>
                <UserOutlined />
                <Text>{post.author}</Text>
              </Space>
              <Space>
                <CalendarOutlined />
                <Text type="secondary">
                  发布于 {dayjs(post.createdAt).format('YYYY-MM-DD HH:mm')}
                </Text>
              </Space>
              {post.updatedAt !== post.createdAt && (
                <Space>
                  <CalendarOutlined />
                  <Text type="secondary">
                    更新于 {dayjs(post.updatedAt).format('YYYY-MM-DD HH:mm')}
                  </Text>
                </Space>
              )}
            </Space>

            {/* 统计信息 */}
            <Row gutter={16}>
              <Col>
                <Statistic
                  title="浏览量"
                  value={post.views}
                  prefix={<EyeOutlined />}
                  valueStyle={{ fontSize: 18 }}
                />
              </Col>
              <Col>
                <Statistic
                  title="点赞数"
                  value={post.likes}
                  prefix={<HeartOutlined />}
                  valueStyle={{ fontSize: 18, color: '#eb2f96' }}
                />
              </Col>
            </Row>

            {/* 分类和标签 */}
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space>
                <FolderOutlined />
                <Text strong>分类：</Text>
                <Tag color="blue">{post.category}</Tag>
              </Space>
              {post.tags && post.tags.length > 0 && (
                <Space>
                  <TagsOutlined />
                  <Text strong>标签：</Text>
                  <Space wrap>
                    {post.tags.map(tag => (
                      <Tag key={tag} color="cyan">
                        {tag}
                      </Tag>
                    ))}
                  </Space>
                </Space>
              )}
            </Space>

            {/* 摘要 */}
            {post.summary && (
              <Alert
                message="文章摘要"
                description={post.summary}
                type="info"
                showIcon
              />
            )}

            <Divider />

            {/* 封面图片 */}
            {post.coverImage && (
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <img
                  src={post.coverImage}
                  alt={post.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: 400,
                    objectFit: 'cover',
                    borderRadius: 8,
                  }}
                />
              </div>
            )}

            {/* 文章内容 */}
            <div style={{ fontSize: 16, lineHeight: 1.8 }}>
              <Paragraph style={{ whiteSpace: 'pre-wrap' }}>
                {post.content}
              </Paragraph>
            </div>

            <Divider />

            {/* 操作按钮 */}
            <Row justify="space-between">
              <Col>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate('/blog/list')}
                >
                  返回列表
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/blog/edit/${post.id}`)}
                >
                  编辑文章
                </Button>
              </Col>
            </Row>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default BlogDetailPage;
