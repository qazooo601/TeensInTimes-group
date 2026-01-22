import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Tag, Space, Button, Divider, List, Badge, Row, Col } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, PlayCircleOutlined, UserOutlined, DownOutlined, RightOutlined, SoundOutlined } from '@ant-design/icons';
import { usePageTitle } from '../hooks/usePageTitle';

const { Title, Paragraph, Text } = Typography;

const MusicDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSongsExpanded, setIsSongsExpanded] = useState(true);
  const [imageError, setImageError] = useState(false);

  // 從 URL 參數或 location.state 獲取專輯資料
  let album = location.state?.album;
  if (!album) {
    const albumParam = searchParams.get('album');
    if (albumParam) {
      try {
        album = JSON.parse(decodeURIComponent(albumParam));
      } catch (e) {
        console.error('解析專輯資料失敗:', e);
      }
    }
  }

  usePageTitle(
    album
      ? `${album.name} 專輯｜TNT時代少年團`
      : '專輯詳情｜TNT時代少年團'
  );

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
                  <Text strong>{album.releaseDate}</Text>
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
