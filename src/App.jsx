import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Layout, Menu } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import {
  TeamOutlined,
  PlayCircleOutlined,
  CalendarOutlined,
  VideoCameraOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { LiaMicrophoneAltSolid } from "react-icons/lia";
import Home from './pages/Home';
import Members from './pages/Members';
import MemberDetail from './pages/MemberDetail';
import Music from './pages/Music';
import MusicDetail from './pages/MusicDetail';
import Concerts from './pages/Concerts';
import ConcertDetail from './pages/ConcertDetail';
import Variety from './pages/Variety';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import Welcome from './pages/Welcome';
import UpdateTime from './components/Layout/UpdateTime';

const { Header, Content, Footer } = Layout;

// 新的 AppLayout 組件，整合 App-simple.jsx 的布局
const AppLayout = ({ children, user, onLogout }) => {
  const menuItems = [
    {
      key: 'music',
      icon: <PlayCircleOutlined />,
      label: '歌曲',
    },
    {
      key: 'concerts',
      icon: <LiaMicrophoneAltSolid style={{ fontSize: '18px', transform: 'translateY(2px)' }} />,
      label: '演唱會',
    },
    {
      key: 'variety',
      icon: <VideoCameraOutlined />,
      label: '綜藝節目',
    },
  ];

  // 移動端選單項目（只顯示圖標）
  const mobileMenuItems = [
    {
      key: '',
      icon: <HomeOutlined />,
    },
    {
      key: 'music',
      icon: <PlayCircleOutlined />,
    },
    {
      key: 'concerts',
      icon: <LiaMicrophoneAltSolid style={{ fontSize: '24px', transform: 'translateY(3px)' }} />,
    },
    {
      key: 'variety',
      icon: <VideoCameraOutlined />,
    },
  ];

  // 獲取當前路徑來確定選中的選單項目
  const getCurrentPath = () => {
    const path = window.location.pathname;
    if (path.includes('/members')) return ['members'];
    if (path.includes('/music')) return ['music'];
    if (path.includes('/concerts')) return ['concerts'];
    if (path.includes('/variety')) return ['variety'];
    return [];
  };

  // 獲取移動端當前路徑（包含首頁）
  const getMobileCurrentPath = () => {
    const path = window.location.pathname;
    if (path === '/' || path === '') return [''];
    if (path.includes('/members')) return ['members'];
    if (path.includes('/music')) return ['music'];
    if (path.includes('/concerts')) return ['concerts'];
    if (path.includes('/variety')) return ['variety'];
    return [];
  };

  const handleMenuClick = ({ key }) => {
    // 使用 window.location 進行導航
    window.location.href = `/${key}`;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 桌面端 Header */}
      <Header
        className="desktop-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFD700',
          padding: '0 24px',
          boxShadow: '0 4px 12px rgba(255,215,0,0.3)'
        }}
      >
        <div
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#000',
            textShadow: '1px 1px 2px rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => window.location.href = '/'}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.color = '#FFD700';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.color = '#000';
          }}
        >
          <img
            src="/images/members/logo.jpg"
            alt="時代少年團"
            style={{
              height: '40px',
              width: 'auto',
              marginRight: '8px'
            }}
          />
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          items={menuItems}
          selectedKeys={getCurrentPath()}
          onClick={handleMenuClick}
          style={{
            background: 'transparent',
            border: 'none',
            minWidth: '500px',
            fontSize: '16px',
            flex: 1,
            justifyContent: 'center'
          }}
          className="custom-menu"
        />
        <div style={{ width: '200px' }}></div>
      </Header>

      {/* 移動端 Header（只顯示 Logo） */}
      <Header
        className="mobile-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FFD700',
          padding: '0 16px',
          boxShadow: '0 4px 12px rgba(255,215,0,0.3)'
        }}
      >
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#000',
            textShadow: '1px 1px 2px rgba(255,255,255,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => window.location.href = '/'}
        >
          <img
            src="/images/members/logo.jpg"
            alt="時代少年團"
            style={{
              height: '32px',
              width: 'auto',
              marginRight: '8px'
            }}
          />
        </div>
      </Header>

      <Content style={{
        background: '#FFFACD',
        minHeight: 'calc(100vh - 64px - 70px)',
        paddingBottom: '100px' // 為移動端底部選單與回饋按鈕留出空間
      }}>
        {children}
      </Content>

      {/* 桌面端 Footer */}
      <Footer
        className="desktop-footer"
        style={{
          background: '#000',
          color: '#FFD700',
          padding: '20px',
          boxShadow: '0 -4px 12px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            © 2025 TNT小網站
          </div>
          <div style={{
            fontSize: '14px',
            marginTop: '8px',
            opacity: 0.9,
            position: 'relative',
            textAlign: 'center'
          }}>
            <span>部分圖片與文字片段來自微博，影片與音樂連結來源於 Bilibili 與 YouTube Music</span>
            <div style={{
              position: 'absolute',
              right: '0',
              top: '0',
              fontSize: '12px'
            }}>
              <UpdateTime showIcon={false} align="right" style={{ color: '#FFD700', opacity: 0.7 }} />
            </div>
          </div>
        </div>
      </Footer>

      {/* 移動端底部選單 */}
      <div
        className="mobile-bottom-menu"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#000',
          borderTop: '2px solid #FFD700',
          padding: '8px 0',
          zIndex: 1000,
          display: 'none'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          {mobileMenuItems.map((item) => (
            <div
              key={item.key}
              onClick={() => window.location.href = `/${item.key}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'all 0.3s ease',
                color: getMobileCurrentPath().includes(item.key) ? '#FFD700' : '#919191',
                backgroundColor: getMobileCurrentPath().includes(item.key) ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!getMobileCurrentPath().includes(item.key)) {
                  e.target.style.color = '#FFD700';
                }
              }}
              onMouseLeave={(e) => {
                if (!getMobileCurrentPath().includes(item.key)) {
                  e.target.style.color = '#919191';
                }
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 從 localStorage 讀取用戶資訊
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // 如果沒有用戶資訊，自動創建訪客用戶
      // 這樣可以讓 Google 爬蟲和首次訪問的用戶都能直接訪問內容
      const guestUser = {
        name: '訪客',
        isGuest: true,
        joinDate: new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(guestUser));
      setUser(guestUser);
    }
    setLoading(false);
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleUpdateProfile = (updatedUser) => {
    setUser(updatedUser);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#FFD700'
      }}>
        載入中...
      </div>
    );
  }

  return (
    <ConfigProvider locale={zhTW}>
      <Router>
        <Routes>
          <Route
            path="/welcome"
            element={
              <Welcome />
            }
          />
          <Route
            path="/*"
            element={
              user ? (
                <AppLayout
                  user={user}
                  onLogout={handleLogout}
                  onUpdateProfile={handleUpdateProfile}
                >
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/members" element={<Members />} />
                    <Route path="/member-detail" element={<MemberDetail />} />
                    <Route path="/music" element={<Music />} />
                    <Route path="/music-detail" element={<MusicDetail />} />
                    <Route path="/concerts" element={<Concerts />} />
                    <Route path="/concert-detail" element={<ConcertDetail />} />
                    <Route path="/variety" element={<Variety />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/profile" element={<Profile />} />
                  </Routes>
                </AppLayout>
              ) : (
                <Navigate to="/welcome" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;
