import React from 'react';
import { Button, Card, Typography, Tag, Space } from 'antd';
import { HeartOutlined, StarOutlined, CrownOutlined, GiftOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Welcome = () => {
  const handleEnterHome = () => {
    window.location.href = '/';
  };
  return (
    <div style={{
      padding: '50px',
      textAlign: 'center',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Card
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          borderRadius: '20px',
          border: '3px solid #FFD700',
          boxShadow: '0 8px 24px rgba(255,215,0,0.3)',
          background: 'linear-gradient(135deg, #FFFACD 0%, #F0E68C 100%)'
        }}
        bodyStyle={{ padding: '40px' }}
      >
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>🎉</div>
          <Title level={1} style={{
            color: '#FFD700',
            marginBottom: '16px',
            fontSize: '36px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            小炸世界
          </Title>
          <Title level={2} style={{
            color: '#333',
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            🌟 時代少年團粉絲社群平台 🌟
          </Title>
          <Paragraph style={{
            fontSize: '18px',
            marginBottom: '32px',
            color: '#666'
          }}>
            ✨ 歡迎來到最可愛的粉絲聚集地！✨<br />
            🎭 點擊上方選單開始探索吧！🎭
          </Paragraph>
        </div>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button
            type="primary"
            size="large"
            onClick={handleEnterHome}
            style={{
              background: '#FFD700',
              border: 'none',
              fontSize: '18px',
              height: '56px',
              padding: '0 40px',
              borderRadius: '28px',
              boxShadow: '0 4px 12px rgba(255,215,0,0.4)',
              color: '#000',
              fontWeight: 'bold'
            }}
            icon={<HeartOutlined />}
          >
            🏠 進入首頁
          </Button>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <Tag color="pink" icon={<StarOutlined />} style={{ fontSize: '14px', padding: '8px 12px' }}>
              爆米花專屬
            </Tag>
            <Tag color="gold" icon={<CrownOutlined />} style={{ fontSize: '14px', padding: '8px 12px' }}>
              大米爆聚集地
            </Tag>
            <Tag color="cyan" icon={<GiftOutlined />} style={{ fontSize: '14px', padding: '8px 12px' }}>
              永遠在一起
            </Tag>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Welcome;
