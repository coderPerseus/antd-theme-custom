import React from 'react';
import { Layout, Menu, Switch, Space, Typography } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  EditOutlined,
  SettingOutlined,
  BulbOutlined,
  BulbFilled,
} from '@ant-design/icons';
import { useNavigate, useLocation } from '@modern-js/runtime/router';
import { useTheme } from '../contexts/ThemeContext';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/blog/list',
      icon: <FileTextOutlined />,
      label: '博客列表',
    },
    {
      key: '/blog/edit',
      icon: <EditOutlined />,
      label: '撰写博客',
    },
    {
      key: '/blog/settings',
      icon: <SettingOutlined />,
      label: '设置中心',
    },
  ];

  return (
    <AntHeader
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 50px',
        background: isDark ? '#141414' : '#fff',
        borderBottom: `1px solid ${isDark ? '#303030' : '#f0f0f0'}`,
      }}
    >
      <Space size="large" align="center">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/')}
        >
          <BulbFilled
            style={{ fontSize: 32, color: '#1890ff', marginRight: 8 }}
          />
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            Antd Theme
          </Title>
        </div>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            flex: 1,
            minWidth: 0,
            border: 'none',
            background: 'transparent',
          }}
        />
      </Space>

      <Space>
        <BulbOutlined style={{ fontSize: 16 }} />
        <Switch
          checked={isDark}
          onChange={toggleTheme}
          checkedChildren="暗"
          unCheckedChildren="亮"
        />
      </Space>
    </AntHeader>
  );
};

export default AppHeader;
