import { Outlet } from '@modern-js/runtime/router';
import { Layout } from 'antd';
import { ThemeProvider } from '../contexts/ThemeContext';
import AppHeader from '../components/Header';
import { useEffect } from 'react';
import { initializeSampleData } from '../utils/storage';

const { Content } = Layout;

export default function RootLayout() {
  useEffect(() => {
    // 初始化示例数据
    initializeSampleData();
  }, []);

  return (
    <ThemeProvider>
      <Layout style={{ minHeight: '100vh' }}>
        <AppHeader />
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </ThemeProvider>
  );
}
