import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Space, Avatar, Divider, Button, Spin, message } from 'antd';
import { CalendarOutlined, PlayCircleOutlined, UserOutlined, FolderOutlined, SoundOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { musicData as localMusicData } from '../data/musicData';
import { usePageTitle } from '../hooks/usePageTitle';
import dbService from '../services/database';
import SEOHead from '../components/SEO/SEOHead';
import { generateBreadcrumbStructuredData } from '../utils/structuredData';

const { Title, Paragraph, Text } = Typography;

// 格式化日期：只顯示日期部分（如果是 datetime 格式，只取日期部分）
const formatDate = (dateString) => {
  if (!dateString) return '';

  // 如果已經是 YYYY-MM-DD 格式（只有日期），直接返回
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }

  // 如果是 datetime 格式（包含時間），只取日期部分
  if (dateString.includes('T') || dateString.includes(' ')) {
    return dateString.split('T')[0].split(' ')[0];
  }

  // 其他格式直接返回
  return dateString;
};

const Music = () => {
  const navigate = useNavigate();
  const [musicData, setMusicData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seoDescription, setSeoDescription] = useState('時代少年團音樂作品：專輯、單曲完整列表。包含發行日期、歌曲資訊、播放連結等詳細資料。');

  usePageTitle('歌曲｜時代少年團');

  // 生成麵包屑結構化資料
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: '首頁', url: '/' },
    { name: '歌曲', url: '/music' }
  ]);

  // 從資料庫載入音樂資料
  useEffect(() => {
    const loadMusicData = async () => {
      try {
        setLoading(true);
        const data = await dbService.getMusic();
        setMusicData(data);
        console.log('成功從資料庫載入音樂資料:', data.length, '筆');

        // 根據最新資料生成 SEO description
        if (data && data.length > 0) {
          // 取得最新的 5 筆資料（資料庫已按 ReleaseDate DESC 排序）
          const latestItems = data.slice(0, 7);
          const latestNames = latestItems.map(item => item.name).filter(Boolean);

          if (latestNames.length > 0) {
            const latestText = latestNames.join('、');
            const description = `時代少年團最新音樂作品：${latestText}。完整專輯、單曲列表，包含發行日期、歌曲資訊、播放連結等詳細資料。`;
            setSeoDescription(description);
          }
        }
      } catch (error) {
        console.error('從資料庫載入音樂資料失敗，使用本地資料:', error);
        message.warning('無法連接到資料庫，使用本地資料');
        setMusicData(localMusicData);

        // 如果使用本地資料，也嘗試生成 description
        if (localMusicData && localMusicData.length > 0) {
          const latestItems = localMusicData.slice(0, 7);
          const latestNames = latestItems.map(item => item.name).filter(Boolean);
          if (latestNames.length > 0) {
            const latestText = latestNames.join('、');
            const description = `時代少年團最新音樂作品：${latestText}。完整專輯、單曲列表，包含發行日期、歌曲資訊、播放連結等詳細資料。`;
            setSeoDescription(description);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    loadMusicData();
  }, []);

  // 返回歌曲列表時還原滾動位置（等待資料載入完成再還原，避免被「載入中」畫面截斷）
  useEffect(() => {
    if (loading) return;

    const navType = sessionStorage.getItem('nav_type_/music');
    const savedPosition = sessionStorage.getItem('scroll_/music');

    if (navType === 'back' && savedPosition && savedPosition !== '0') {
      const top = parseInt(savedPosition, 10) || 0;
      // 使用 setTimeout 確保 DOM 已完全渲染
      setTimeout(() => {
        window.scrollTo({ top, behavior: 'auto' });
      }, 200);
    } else if (navType !== 'back') {
      // 新進入頁面時滾動到頂部
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    // 使用一次後就清掉導航標記，避免影響之後的進入行為
    sessionStorage.removeItem('nav_type_/music');
  }, [loading]);

  // 分離專輯和單曲
  const albums = musicData.filter(item => item.category === 'album');
  const singles = musicData.filter(item => item.category === 'single');

  const renderMusicCard = (item) => {
    const isAlbum = item.category === 'album';
    const borderColor = isAlbum ? '#87CEEB' : '#FFD700';
    const backgroundColor = isAlbum ? 'linear-gradient(135deg, #E0F6FF 0%, #CCECF8 100%)' : 'linear-gradient(135deg, #FFFACD 0%, #F0E293 100%)';
    const iconColor = isAlbum ? '#87CEEB' : '#FFD700';

    return (
      <Card
        key={item.id}
        hoverable={isAlbum}
        onClick={() => {
          if (isAlbum) {
            // 保存當前滾動位置
            const currentPosition = window.scrollY;
            sessionStorage.setItem('scroll_/music', currentPosition.toString());
            // 標記為前進導航
            sessionStorage.setItem('nav_type_/music-detail', 'forward');
            navigate('/music-detail', { state: { album: item } });
          }
        }}
        style={{
          borderRadius: '20px',
          border: `3px solid ${borderColor}`,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          background: backgroundColor,
          cursor: isAlbum ? 'pointer' : 'default',
          maxWidth: '92%',     // 防止在極小螢幕的手機上超出範圍
        }}
        styles={{ body: { padding: '20px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* 左側圖片 */}
          <Avatar
            size={80}
            src={item.image}
            style={{
              backgroundColor: borderColor,
              fontSize: '32px',
              border: `3px solid ${borderColor}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              flexShrink: 0
            }}
            onError={() => {
              return item.emoji;
            }}
          >
            {item.emoji}
          </Avatar>

          {/* 右側資訊 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Space direction="vertical" size="small" style={{ flex: 1 }}>
                {/* 歌名/專輯名 */}
                <Title level={3} style={{
                  color: '#333',
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  {item.name}
                </Title>

                {/* 發行日期 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarOutlined style={{ color: iconColor, marginRight: '8px' }} />
                  <Text strong style={{ color: '#666' }}>{formatDate(item.releaseDate)}</Text>
                </div>

                {/* 專輯顯示歌曲數量，單曲顯示演唱者 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isAlbum ? (
                    <PlayCircleOutlined style={{ color: iconColor, marginRight: '8px' }} />
                  ) : (
                    <UserOutlined style={{ color: iconColor, marginRight: '8px' }} />
                  )}
                  <Text style={{ color: '#666' }}>
                    {isAlbum ? `${item.songs.length} 首歌曲` : ` ${item.songs[0]?.performer || '未知'}`}
                  </Text>
                </div>
              </Space>

              {/* 單曲播放按鈕 - 顯示在最右側 */}
              {!isAlbum && item.songs.length > 0 && item.songs[0].audioUrl && (
                <Button
                  type="primary"
                  icon={<SoundOutlined />}
                  size="small"
                  style={{
                    backgroundColor: iconColor,
                    borderColor: iconColor,
                    color: '#000',
                    fontWeight: 'bold',
                    marginLeft: '16px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(item.songs[0].audioUrl, '_blank');
                  }}
                >
                  播放
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div style={{
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '20px',
        color: ' #FFD700'
      }}>
        載入中...
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title="歌曲｜時代少年團"
        description={seoDescription}
        structuredData={breadcrumbData}
      />
      <div style={{ padding: '24px', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1} style={{
          color: ' #EBC700',
          marginBottom: '8px',
          fontSize: '36px'
        }}>
          歌曲
        </Title>
      </div>

      {/* 專輯區塊 */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <FolderOutlined style={{ fontSize: '24px', color: ' #208FBC', marginRight: '12px' }} />
          <Title level={2} style={{ color: ' #208FBC', margin: 0 }}>
            專輯
          </Title>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {albums.map(renderMusicCard)}
        </div>
      </div>

      <Divider style={{ borderColor: ' #D4AD00', margin: '40px 0' }} />

      {/* 單曲區塊 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <SoundOutlined style={{ fontSize: '24px', color: ' #DFBD00', marginRight: '12px' }} />
          <Title level={2} style={{ color: ' #DFBD00', margin: 0 }}>
            單曲
          </Title>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {singles.map(renderMusicCard)}
        </div>
      </div>
    </div>
    </>
  );
};

export default Music;
