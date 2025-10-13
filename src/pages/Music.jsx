import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Space, Avatar, Divider, Button } from 'antd';
import { CalendarOutlined, PlayCircleOutlined, UserOutlined, FolderOutlined, SoundOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { musicData } from '../data/musicData';

const { Title, Paragraph, Text } = Typography;

const Music = () => {
  const navigate = useNavigate();


  // 分離專輯和單曲
  const albums = musicData.filter(item => item.category === 'album');
  const singles = musicData.filter(item => item.category === 'single');

  const renderMusicCard = (item) => {
    const isAlbum = item.category === 'album';
    const borderColor = isAlbum ? '#87CEEB' : '#FFD700';
    const backgroundColor = isAlbum ? 'linear-gradient(135deg, #E0F6FF 0%, #87CEEB 100%)' : 'linear-gradient(135deg, #FFFACD 0%, #FFD700 100%)';
    const iconColor = isAlbum ? '#87CEEB' : '#FFD700';

    return (
      <Card
        key={item.id}
        hoverable={isAlbum}
        onClick={() => {
          if (isAlbum) {
            navigate('/music-detail', { state: { album: item } });
          }
        }}
        style={{
          borderRadius: '20px',
          border: `3px solid ${borderColor}`,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          background: backgroundColor,
          cursor: isAlbum ? 'pointer' : 'default'
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
                  <Text strong style={{ color: '#666' }}>{item.releaseDate}</Text>
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
              {!isAlbum && item.songs.length > 0 && (
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
                    if (item.songs[0].audioUrl) {
                      window.open(item.songs[0].audioUrl, '_blank');
                    }
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

  return (
    <div style={{ padding: '24px', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1} style={{
          color: '#EBC700',
          marginBottom: '8px',
          fontSize: '36px'
        }}>
          歌曲
        </Title>
      </div>

      {/* 專輯區塊 */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <FolderOutlined style={{ fontSize: '24px', color: '#208FBC', marginRight: '12px' }} />
          <Title level={2} style={{ color: '#208FBC', margin: 0 }}>
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

      <Divider style={{ borderColor: '#FFD700', margin: '40px 0' }} />

      {/* 單曲區塊 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <SoundOutlined style={{ fontSize: '24px', color: '#FFD700', marginRight: '12px' }} />
          <Title level={2} style={{ color: '#FFD700', margin: 0 }}>
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
  );
};

export default Music;
