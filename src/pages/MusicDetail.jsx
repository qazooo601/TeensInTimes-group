import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Tag, Space, Button, Divider, List, Badge, Row, Col, Spin, message } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, PlayCircleOutlined, UserOutlined, DownOutlined, RightOutlined, SoundOutlined } from '@ant-design/icons';
import { usePageTitle } from '../hooks/usePageTitle';
import { musicData as localMusicData } from '../data/musicData';
import dbService from '../services/database';

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

const MusicDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSongsExpanded, setIsSongsExpanded] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  // 從資料庫載入專輯資料
  useEffect(() => {
    const loadAlbumData = async () => {
      try {
        setLoading(true);

        // 優先使用從 state 傳遞過來的專輯資料
        let albumFromState = location.state?.album;

        if (albumFromState) {
          // 如果已經有專輯資料，直接使用（因為 Music.jsx 已經從資料庫載入了）
          setAlbum(albumFromState);
          setLoading(false);
          return;
        }

        // 如果沒有從 state 獲取到，嘗試從 URL 參數獲取
        const albumParam = searchParams.get('album');
        if (albumParam) {
          try {
            albumFromState = JSON.parse(decodeURIComponent(albumParam));
            setAlbum(albumFromState);
            setLoading(false);
            return;
          } catch (e) {
            console.error('解析專輯資料失敗:', e);
          }
        }

        // 如果都沒有，嘗試從資料庫載入所有音樂資料，然後根據 ID 或名稱查找
        const albumId = searchParams.get('id');
        const albumName = searchParams.get('name');

        if (albumId || albumName) {
          try {
            const musicData = await dbService.getMusic();
            const foundAlbum = musicData.find(item =>
              (albumId && item.id === albumId) ||
              (albumName && item.name === albumName)
            );

            if (foundAlbum) {
              setAlbum(foundAlbum);
            } else {
              // 如果資料庫中找不到，嘗試從本地資料查找
              const localAlbum = localMusicData.find(item =>
                (albumId && item.id === albumId) ||
                (albumName && item.name === albumName)
              );
              if (localAlbum) {
                setAlbum(localAlbum);
                message.warning('使用本地資料');
              } else {
                message.error('找不到指定的專輯');
              }
            }
          } catch (error) {
            console.error('從資料庫載入專輯資料失敗，使用本地資料:', error);
            // 如果資料庫連接失敗，嘗試從本地資料查找
            const localAlbum = localMusicData.find(item =>
              (albumId && item.id === albumId) ||
              (albumName && item.name === albumName)
            );
            if (localAlbum) {
              setAlbum(localAlbum);
              message.warning('無法連接到資料庫，使用本地資料');
            }
          }
        }
      } catch (error) {
        console.error('載入專輯資料失敗:', error);
        message.error('載入專輯資料失敗');
      } finally {
        setLoading(false);
      }
    };

    loadAlbumData();
  }, [location.state, searchParams]);

  usePageTitle(
    album
      ? `${album.name} 專輯｜TNT時代少年團`
      : '專輯詳情｜TNT時代少年團'
  );

  // 載入中狀態
  if (loading) {
    return (
      <div style={{
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '20px',
        color: '#FFD700'
      }}>
        載入中...
      </div>
    );
  }

  // 如果沒有傳入特定專輯，顯示所有專輯列表
  if (!album) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={1} style={{
            color: '#FFD700',
            marginBottom: '8px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontSize: '36px'
          }}>
            專輯詳細資訊
          </Title>
          <Paragraph style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '16px'
          }}>
            ✨ 請從專輯列表選擇查看詳細資訊 ✨
          </Paragraph>
        </div>
      </div>
    );
  }


  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            // 保存當前滾動位置
            const currentPosition = window.scrollY;
            sessionStorage.setItem('scroll_/music-detail', currentPosition.toString());
            // 標記為返回導航
            sessionStorage.setItem('nav_type_/music', 'back');
            navigate('/music');
          }}
          style={{
            background: '#FFD700',
            border: 'none',
            color: '#000',
            fontWeight: 'bold'
          }}
        >
          返回
        </Button>
      </div>

      <Card
        style={{
          borderRadius: '20px',
          border: '3px solid #87CEEB',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          background: 'linear-gradient(135deg, #E0F6FF 0%, #87CEEB 100%)'
        }}
        styles={{ body: { padding: '40px' } }}
      >
        {/* 響應式布局：大螢幕圖片在左，小螢幕圖片在上 */}
        <Row gutter={[32, 24]} align="top">
          {/* 圖片區域 */}
          <Col xs={24} sm={24} md={8} lg={6}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}>
              {!imageError ? (
                <img
                  src={album.image}
                  alt={album.name}
                  onError={() => setImageError(true)}
                  style={{
                    width: '100%',
                    maxWidth: '200px',
                    height: 'auto',
                    borderRadius: '8px',
                    border: '3px solid #87CEEB',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    objectFit: 'cover',
                    aspectRatio: '1 / 1'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    maxWidth: '200px',
                    aspectRatio: '1 / 1',
                    backgroundColor: '#87CEEB',
                    borderRadius: '8px',
                    border: '3px solid #87CEEB',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    fontSize: '80px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  {album.emoji}
                </div>
              )}
            </div>
          </Col>

          {/* 內容區域 */}
          <Col xs={24} sm={24} md={16} lg={18}>
            <div
              className="album-info-content"
              style={{
                marginBottom: '20px'
              }}
            >
              <Title level={1} style={{
                color: '#333',
                marginBottom: '8px',
                fontSize: '36px'
              }}>
                {album.name}
              </Title>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div className="album-info-item">
                  <CalendarOutlined style={{ color: '#87CEEB', marginRight: '8px' }} />
                  <Text strong>{formatDate(album.releaseDate)}</Text>
                </div>

                <div className="album-info-item">
                  <PlayCircleOutlined style={{ color: '#87CEEB', marginRight: '8px' }} />
                  <Text>{album.songs.length} 首歌曲</Text>
                </div>
              </Space>
            </div>
          </Col>
        </Row>

        <Divider style={{ borderColor: '#87CEEB' }} />

        {/* 主題分類 */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={3} style={{
            color: '#333',
            marginBottom: '16px'
          }}>
            主題分類
          </Title>

          {(() => {
            // 按主題分組歌曲
            const songsByTheme = album.songs.reduce((acc, song) => {
              const theme = song.theme || '其他';
              if (!acc[theme]) {
                acc[theme] = [];
              }
              acc[theme].push(song);
              return acc;
            }, {});

            return Object.entries(songsByTheme).map(([theme, songs]) => (
              <div key={theme} style={{ marginBottom: '20px' }}>
                <div
                  onClick={() => setIsSongsExpanded(!isSongsExpanded)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    background: 'rgba(135, 206, 235, 0.1)',
                    borderRadius: '8px',
                    border: '1px solid #87CEEB',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(135, 206, 235, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(135, 206, 235, 0.1)';
                  }}
                >
                  <Title level={4} style={{
                    color: '#208FBC',
                    margin: 0,
                    fontSize: '18px'
                  }}>
                    {theme}
                  </Title>
                  <Space>
                    <Text style={{ color: '#1B7BA1', fontSize: '14px' }}>
                      {songs.length} 首
                    </Text>
                    {isSongsExpanded ?
                      <DownOutlined style={{ color: '#1B7BA1' }} /> :
                      <RightOutlined style={{ color: '#208FBC' }} />
                    }
                  </Space>
                </div>

                {isSongsExpanded && (
                  <List
                    dataSource={songs}
                    renderItem={(item, index) => (
                      <List.Item style={{
                        background: 'rgba(255,255,255,0.7)',
                        margin: '8px 0',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(135, 206, 235, 0.2)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                          <Space>
                            <Badge count={index + 1} style={{ backgroundColor: '#25A7DA' }} />
                            <div>
                              <Text strong style={{ fontSize: '16px' }}>{item.song}</Text>
                              <br />
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <UserOutlined style={{ color: '#87CEEB', marginRight: '8px' }} />
                                <Text style={{ fontSize: '14px', color: '#666' }}>{item.performer}</Text>
                              </div>
                            </div>
                          </Space>
                          <Space>
                            <Button
                              type="primary"
                              icon={<SoundOutlined />}
                              size="small"
                              style={{
                                backgroundColor: '#87CEEB',
                                borderColor: '#87CEEB',
                                color: '#000'
                              }}
                              onClick={() => {
                                if (item.audioUrl) {
                                  window.open(item.audioUrl, '_blank');
                                }
                              }}
                            >
                              播放
                            </Button>
                          </Space>
                        </div>
                      </List.Item>
                    )}
                  />
                )}
              </div>
            ));
          })()}
        </div>
      </Card>
    </div>
  );
};

export default MusicDetail;
