import React from 'react';
import { Button, Card, Typography, Tag, Space } from 'antd';
import { HeartOutlined, StarOutlined, CrownOutlined, GiftOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Welcome = () => {
  const handleEnterHome = () => {
    // 創建一個訪客用戶並保存到 localStorage
    const guestUser = {
      name: '訪客',
      isGuest: true,
      joinDate: new Date().toISOString()
    };
    localStorage.setItem('user', JSON.stringify(guestUser));

    // 使用 window.location 強制刷新頁面，讓 App 重新讀取 localStorage
    window.location.href = '/';
  };
  return (
    <div style={{
      padding: '20px',
      textAlign: 'center',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FFFACD'
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
        bodyStyle={{ padding: '24px' }}
      >
        <div style={{ marginBottom: '24px' }}>
          <Title level={1} style={{
            color: '#FFD700',
            marginBottom: '16px',
            fontSize: '36px',
          }}>
            炸開了鍋
          </Title>
          <Title level={2} style={{
            color: '#333',
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            時代少年團物料專區
          </Title>
          <Paragraph style={{
            fontSize: '14px',
            marginBottom: '32px',
            color: '#666'
          }}>
            歡迎剛上樓和想補物料的大米爆~<br/>
            這裡有小炸基本資訊、各式物料彙整，希望能給到大家幫助<br/>
            有幫助的話，就動動手指多多分享<br/>
            資訊有誤、需要更新、修改的，可以聯絡版主的IG：
            <a href="https://www.instagram.com/18lou_xuefen" target="_blank" rel="noopener noreferrer" style={{ color: '#1677ff' }}>
              @18lou_xuefen
            </a>
            <br/>
            廢話時間結束，祝大家天天開心~
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
              height: '48px',
              padding: '0 30px',
              borderRadius: '28px',
              boxShadow: '0 4px 12px rgba(255,215,0,0.4)',
              color: '#000',
              fontWeight: 'bold'
            }}
          >
            進入首頁
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default Welcome;
