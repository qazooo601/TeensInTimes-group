import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Avatar, Tag, Space, Button } from 'antd';
import { HeartOutlined, FireOutlined, EditOutlined } from '@ant-design/icons';
import { BsSinaWeibo } from "react-icons/bs";
import { membersData } from '../data/membersData';

const { Title, Paragraph, Text } = Typography;

const Members = () => {
  const navigate = useNavigate();

  // 計算年齡的函數
  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleMemberClick = (member) => {
    // 使用 React Router 導航到成員詳細頁面
    navigate('/member-detail', { state: { member } });
  };

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768;

  return (
    <div style={{ padding: '24px', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1} style={{
          color: '#EBC700',
          marginBottom: '8px',
          fontSize: '36px'
        }}>
          團體成員
        </Title>
        <Paragraph style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '16px'
        }}>
          ✨ 時代少年團七位成員 ✨
        </Paragraph>
        <Space>
          <Tag color="gold" icon={<HeartOutlined />}>大米爆</Tag>
          <Tag color="default" icon={<FireOutlined />}>永遠在一起</Tag>
          <Tag
            color="red"
            icon={<BsSinaWeibo style={{ transform: 'translateY(2px)', marginRight: '4px' }} />}
            style={{ cursor: 'pointer' }}
            onClick={() => window.open('https://weibo.com/u/6620842908', '_blank')}
          >
            @时代少年团
          </Tag>
        </Space>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          width: '100%',
          maxWidth: '1200px'
        }}>
        {membersData.map((member, index) => {
          // 處理顏色：如果是陣列則創建漸層，如果是單一顏色則使用原色
          const isGradient = Array.isArray(member.supportColor);
          const primaryColor = isGradient ? member.supportColor[0] : member.supportColor;
          const backgroundStyle = isGradient
            ? `linear-gradient(135deg, ${member.supportColor[0]}60 0%, ${member.supportColor[1]}60 100%)`
            : `linear-gradient(135deg, ${member.supportColor}20 0%, ${member.supportColor}60 100%)`;

          return (
            <Card
              key={index}
              hoverable
              onClick={() => handleMemberClick(member)}
              style={{
                textAlign: 'center',
                borderRadius: '20px',
                border: `3px solid ${primaryColor}`,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                background: backgroundStyle,
                cursor: 'pointer'
              }}
              styles={{ body: { padding: '20px' } }}
            >
            <Avatar
              size={60}
              src={member.image}
              style={{
                backgroundColor: primaryColor,
                marginBottom: '12px',
                fontSize: '24px',
                border: `2px solid ${primaryColor}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
              onError={() => {
                // 如果圖片載入失敗，顯示 emoji 作為備用
                return member.emoji;
              }}
            >
              {member.emoji}
            </Avatar>
            <Title level={3} style={{
              color: '#333',
              marginBottom: '8px',
              fontSize: '20px'
            }}>
              {member.memberName}
            </Title>
            <Text style={{
              color: (() => {
                const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                // 為不同顏色創建對應的深色版本
                const colorMap = {
                  '#9A91F2': '#8076B7',
                  '#FFD700': '#B8860B',
                  '#63C3DE': '#4B9B4B',
                  '#FFFFFF': '#919191',
                  '#C0EBD7': '#37A471',
                  '#FF5546': '#CC0000',
                  '#ADD5A2': '#89C379'
                };
                return colorMap[baseColor] || '#333';
              })(),
              fontSize: '14px'
            }}>
              {member.fanName}<br/>
              {member.birthday} | {calculateAge(member.birthday)}歲
            </Text>
          </Card>
          );
        })}
        </div>
      </div>

      {/* 右下意見回饋按鈕（從 MemberDetail 移置至此） */}
      <div style={{ position: 'fixed', right: isSmallScreen ? undefined : '16px', left: isSmallScreen ? '12px' : undefined, bottom: isSmallScreen ? 'calc(env(safe-area-inset-bottom, 0px) + 96px)' : '16px', zIndex: 2001 }}>
        <Button
          type="primary"
          size={isSmallScreen ? 'small' : 'middle'}
          icon={<EditOutlined />}
          onClick={() => window.location.href = '/feedback'}
          style={{
            background: '#FFD700',
            borderColor: '#FFD700',
            color: '#000',
            fontWeight: 'bold',
            borderRadius: '20px'
          }}
        >
          留言投稿
        </Button>
      </div>
    </div>
  );
};

export default Members;
