import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ConfigProvider, Layout, Menu, Button } from 'antd';
import zhTW from 'antd/locale/zh_TW';
import {
  PlayCircleOutlined,
  VideoCameraOutlined,
  HomeOutlined,
  UserOutlined,
  SoundOutlined
} from '@ant-design/icons';
import { LiaMicrophoneAltSolid } from "react-icons/lia";
import { ref, runTransaction } from 'firebase/database';
import { database } from './config/firebase';
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
import About from './pages/About';
import UpdateTime from './components/Layout/UpdateTime';
import { useScrollRestoration } from './hooks/useScrollRestoration';
import dbService from './services/database';

const { Header, Content, Footer } = Layout;

// 跑馬燈公告組件 - 使用純 CSS 實現無縫循環，完全隔離避免觸發重新渲染
const MarqueeAnnouncement = React.memo(({ announcement }) => {
  const containerRef = React.useRef(null);
  const contentRef = React.useRef(null);
  const needsScrollRef = React.useRef(false);
  const hasCheckedRef = React.useRef(false);
  const animationTimerRef = React.useRef(null);
  const announcementRef = React.useRef(announcement || '');
  const spanRefs = React.useRef([]);

  // 當公告內容更新時，更新 ref 並直接更新 DOM
  React.useEffect(() => {
    if (announcement !== undefined) {
      announcementRef.current = announcement || '';
      // 直接更新 span 元素的文字內容
      if (spanRefs.current.length >= 2) {
        spanRefs.current.forEach(span => {
          if (span) {
            span.textContent = announcementRef.current;
          }
        });
      }
      // 重置檢查狀態，以便重新檢查是否需要滾動
      hasCheckedRef.current = false;
      // 重新檢查是否需要滾動
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (containerRef.current && contentRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            const contentWidth = contentRef.current.scrollWidth;
            const shouldScroll = contentWidth > containerWidth;

            if (animationTimerRef.current) {
              clearTimeout(animationTimerRef.current);
              animationTimerRef.current = null;
            }

            needsScrollRef.current = shouldScroll;

            if (contentRef.current) {
              if (shouldScroll) {
                contentRef.current.classList.add('needs-scroll');
                animationTimerRef.current = setTimeout(() => {
                  if (contentRef.current) {
                    contentRef.current.classList.add('animating');
                  }
                }, 5000);
              } else {
                contentRef.current.classList.remove('needs-scroll', 'animating');
              }
            }
          }
        });
      });
    }
  }, [announcement]);

  React.useEffect(() => {
    // 只在首次渲染和窗口大小改變時檢查
    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // 只用第一段文字的寬度來判斷是否需要滾動
        const firstSpan = spanRefs.current[0];
        const singleContentWidth = firstSpan ? firstSpan.offsetWidth : contentRef.current.scrollWidth;
        const shouldScroll = singleContentWidth > containerWidth;

        // 清除之前的計時器
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current);
          animationTimerRef.current = null;
        }

        needsScrollRef.current = shouldScroll;

        // 直接操作 DOM，不觸發 React 重新渲染
        if (contentRef.current) {
          if (shouldScroll) {
            contentRef.current.classList.add('needs-scroll');
            // 停留 5 秒後開始滾動
            animationTimerRef.current = setTimeout(() => {
              if (contentRef.current) {
                contentRef.current.classList.add('animating');
              }
            }, 5000);
          } else {
            contentRef.current.classList.remove('needs-scroll', 'animating');
          }
        }
      }
    };

    // 使用 requestAnimationFrame 確保 DOM 已完全渲染
    if (!hasCheckedRef.current) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          checkOverflow();
          hasCheckedRef.current = true;
        });
      });
    }

    const handleResize = () => {
      if (contentRef.current) {
        contentRef.current.classList.remove('animating');
      }
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
        animationTimerRef.current = null;
      }
      hasCheckedRef.current = false; // 重置檢查狀態
      checkOverflow();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  return (
    <div
      style={{
        background: '#FFFCEB',
        padding: '8px 0',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 50px));
          }
        }
        .marquee-wrapper {
          display: inline-flex;
          white-space: nowrap;
        }
        /* 預設只顯示第一段文字（不滾動時不需要重複內容） */
        .marquee-wrapper span + span {
          display: none;
        }
        /* 只有在需要滾動時才顯示第二段文字，並啟用無縫循環 */
        .marquee-wrapper.needs-scroll span + span {
          display: inline-block;
        }
        .marquee-wrapper.needs-scroll.animating {
          animation: marquee 13s linear infinite;
        }
        .marquee-wrapper.needs-scroll.animating:hover {
          animation-play-state: paused;
        }
        .marquee-content-static {
          display: inline-block;
          white-space: nowrap;
        }
      `}</style>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        color: '#000',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        <SoundOutlined
          style={{
            fontSize: '16px',
            marginLeft: '16px',
            flexShrink: 0,
            color: '#FF9A57'
          }}
        />
        <div
          ref={containerRef}
          style={{ overflow: 'hidden', flex: 1, position: 'relative' }}
        >
          <div
            ref={contentRef}
            className="marquee-wrapper"
            style={{ willChange: 'transform' }}
          >
            <span ref={el => { if (el) spanRefs.current[0] = el; }}>
              {announcement || ''}
            </span>
            <span
              ref={el => { if (el) spanRefs.current[1] = el; }}
              style={{ marginLeft: '100px' }}
            >
              {announcement || ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // 只有當 announcement 改變時才重新渲染
  // 但由於我們使用 useRef 和直接 DOM 操作，實際上不會觸發其他組件的重新載入
  return prevProps.announcement === nextProps.announcement;
});

// 新的 AppLayout 組件，整合 App-simple.jsx 的布局
const AppLayout = React.memo(({ children, user, onLogout, announcement }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 使用滾動位置恢復功能
  useScrollRestoration();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

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
          background: '#FFE852',
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
        <div style={{
          width: '200px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}>
          <Button
            type="text"
            onClick={() => window.location.href = '/about'}
            className="desktop-about-button"
            style={{
              color: '#000',
              fontSize: '13px',
              fontWeight: '500',
              padding: '4px 12px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            關於版主
          </Button>
        </div>
      </Header>

      {/* 移動端 Header（顯示 Logo 和關於版主） */}
      <Header
        className="mobile-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#FFE852',
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
        <Button
          type="text"
          icon={<UserOutlined />}
          onClick={() => window.location.href = '/about'}
          className="mobile-about-button"
          style={{
            color: '#000',
            fontSize: '20px',
            padding: '4px 8px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '40px',
            height: '40px'
          }}
        />
      </Header>

      {/* 跑馬燈公告 */}
      <MarqueeAnnouncement announcement={announcement} />

      <Content style={{
        background: '#FFFBE0',
        minHeight: 'calc(100vh - 64px - 40px - 70px)',
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
            © 2025 粉絲自製網站-TNT時代少年團
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

      {/* 回到頂部按鈕（所有頁面共用） */}
      {showScrollTop && (
        <Button
          type="primary"
          shape="circle"
          size="large"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            right: 24,
            bottom: 96,
            zIndex: 1100,
            backgroundColor: '#FFE96B',
            borderColor: '#FFE96B',
            color: '#000',
            padding: 0,
            width: 56,
            height: 56,
            borderRadius: '50%',
            fontWeight: 'normal',
            fontSize: 14,
            lineHeight: '56px'
          }}
        >
          TOP
        </Button>
      )}

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
                color: getMobileCurrentPath().includes(item.key) ? '#FFE96B' : '#919191',
                backgroundColor: getMobileCurrentPath().includes(item.key) ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
              }}
              onMouseEnter={(e) => {
                if (!getMobileCurrentPath().includes(item.key)) {
                  e.target.style.color = '#FFE96B';
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
}, (prevProps, nextProps) => {
  // 只有當 user、children 或 announcement 真正改變時才重新渲染
  return prevProps.user === nextProps.user &&
         prevProps.children === nextProps.children &&
         prevProps.announcement === nextProps.announcement;
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [announcement, setAnnouncement] = useState('');

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

  // 從資料庫獲取公告內容
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const groupInfo = await dbService.getGroupInfo();
        const announcementValue = groupInfo?.announcement;

        if (announcementValue && announcementValue.trim() !== '') {
          setAnnouncement(announcementValue.trim());
        } else {
          // 如果資料庫沒有公告，使用預設值
          setAnnouncement('公告：歡迎！本站會時時更新資料，如有任何問題可先至「關於版主」頁面瀏覽相關資訊。');
        }
      } catch (error) {
        console.error('獲取公告內容失敗:', error);
        // 發生錯誤時使用預設值
        setAnnouncement('公告：歡迎！本站會時時更新資料，如有任何問題可先至「關於版主」頁面瀏覽相關資訊。');
      }
    };
    fetchAnnouncement();
  }, []);

  // 全站進站次數統一在這裡紀錄，不再只限於首頁元件載入時
  // 只要透過網址、連結點進來的，無論進來是 "/members"、"/music"...等，都應該被記錄一次
  useEffect(() => {
    const updateVisitCount = async () => {
      try {
        // 避免同一個瀏覽器會話中重複計數
        const sessionCounted = sessionStorage.getItem('siteVisitCounted');

        if (sessionCounted) {
          console.log('本次會話已計數過，跳過計數');
          return;
        }

        console.log('開始更新訪問次數...', {
          referrer: document.referrer,
          currentPath: window.location.pathname
        });

        if (database) {
          const countRef = ref(database, 'visitCount');

          // 使用 transaction 增加計數（確保原子性操作）
          await runTransaction(countRef, (currentCount) => {
            const newCount = (currentCount || 0) + 1;
            console.log('Firebase 計數更新:', currentCount, '->', newCount);
            return newCount;
          });
        } else {
          // Firebase 未配置時，使用 localStorage 作為備用方案
          const storedCount = parseInt(localStorage.getItem('homeVisitCount') || '0', 10);
          const newCount = storedCount + 1;
          localStorage.setItem('homeVisitCount', newCount.toString());
          console.log('localStorage 計數更新:', storedCount, '->', newCount);
        }

        sessionStorage.setItem('siteVisitCounted', 'true');
        console.log('訪問次數更新完成');
      } catch (error) {
        console.error('更新網站訪問次數失敗，回退到 localStorage:', error);
        const storedCount = parseInt(localStorage.getItem('homeVisitCount') || '0', 10);
        const newCount = storedCount + 1;
        localStorage.setItem('homeVisitCount', newCount.toString());
        sessionStorage.setItem('siteVisitCounted', 'true');
        console.log('已回退到 localStorage，計數:', storedCount, '->', newCount);
      }
    };

    updateVisitCount();
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
        color: '#FFE96B'
      }}/>
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
                  announcement={announcement}
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
                    <Route path="/about" element={<About />} />
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
