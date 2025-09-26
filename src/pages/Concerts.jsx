import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Badge, Tag, Space, Avatar, Button } from 'antd';
import { FireOutlined, StarOutlined, CalendarOutlined, EnvironmentOutlined, BankOutlined, PlayCircleOutlined, VideoCameraOutlined, FileTextOutlined } from '@ant-design/icons';
import { concertsData } from '../data/concertsData';

const { Title, Paragraph, Text } = Typography;

const Concerts = () => {
  const navigate = useNavigate();

  const getStatusTag = (status) => {
    switch (status) {
      case 'offline':
        return <Tag color="green">線下</Tag>;
      case 'online':
        return <Tag color="blue">線上</Tag>;
      case 'cancelled':
        return <Tag color="red">取消</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
  };

  const renderVideoButtons = (videoLinks) => {
    if (!videoLinks) return null;

    const buttons = [];

    // 演唱會影片
    if (videoLinks.concert) {
      if (typeof videoLinks.concert === 'object') {
        // 多日演唱會
        Object.keys(videoLinks.concert).forEach(day => {
          if (videoLinks.concert[day] && videoLinks.concert[day].trim() !== '') {
            buttons.push(
              <Button
                key={`concert-${day}`}
                type="primary"
                icon={<PlayCircleOutlined />}
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(videoLinks.concert[day], '_blank');
                }}
                style={{
                  backgroundColor: '#2299C9',
                  borderColor: '#2299C9',
                  borderRadius: '15px',
                  margin: '2px'
                }}
              >
                演唱會 {day}
              </Button>
            );
          }
        });
      } else if (videoLinks.concert && videoLinks.concert.trim() !== '') {
        // 單日演唱會
        buttons.push(
          <Button
            key="concert"
            type="primary"
            icon={<PlayCircleOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              window.open(videoLinks.concert, '_blank');
            }}
            style={{
              backgroundColor: '#2299C9',
              borderColor: '#2299C9',
              borderRadius: '15px',
              margin: '2px'
            }}
          >
            演唱會
          </Button>
        );
      }
    }

    // 聯排影片
    if (videoLinks.rehearsal && videoLinks.rehearsal.trim() !== '') {
      buttons.push(
        <Button
          key="rehearsal"
          type="default"
          icon={<VideoCameraOutlined />}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            window.open(videoLinks.rehearsal, '_blank');
          }}
          style={{
            borderRadius: '15px',
            margin: '2px'
          }}
        >
          聯排
        </Button>
      );
    }

    // 短片
    if (videoLinks.short && videoLinks.short.trim() !== '') {
      buttons.push(
        <Button
          key="short"
          type="default"
          icon={<FileTextOutlined />}
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            window.open(videoLinks.short, '_blank');
          }}
          style={{
            borderRadius: '15px',
            margin: '2px'
          }}
        >
          短片
        </Button>
      );
    }

    return buttons.length > 0 ? (
      <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {buttons}
      </div>
    ) : null;
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1} style={{
          color: '#EBC700',
          marginBottom: '8px',
          fontSize: '36px'
        }}>
          演唱會專區
        </Title>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        {concertsData.map((concert) => {
          return (
            <Card
              key={concert.id}
              hoverable
              onClick={() => {
                navigate('/concert-detail', { state: { concert } });
              }}
              style={{
                borderRadius: '20px',
                border: '3px solid #87CEEB',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg, #E0F6FF 0%, #87CEEB 100%)',
                cursor: 'pointer'
              }}
              styles={{ body: { padding: '20px' } }}
            >
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <Avatar
                  size={60}
                  src={concert.image}
                  style={{
                    backgroundColor: '#87CEEB',
                    marginBottom: '12px',
                    fontSize: '24px',
                    border: '2px solid #87CEEB',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                  onError={() => {
                    return concert.emoji;
                  }}
                >
                  {concert.emoji}
                </Avatar>
                <Title level={3} style={{
                  color: '#333',
                  marginBottom: '8px',
                  fontSize: '20px'
                }}>
                  {concert.concertName}
                </Title>
              </div>

              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Space>
                    <CalendarOutlined style={{ color: '#87CEEB' }} />
                    <Text strong>{concert.date}</Text>
                  </Space>
                  {getStatusTag(concert.status)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <EnvironmentOutlined style={{ color: '#87CEEB', marginRight: '8px' }} />
                  <Text>{concert.location}</Text>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <BankOutlined style={{ color: '#87CEEB', marginRight: '8px' }} />
                  <Text>{concert.venue}</Text>
                </div>
              </Space>

              {/* 影片連結按鈕 */}
              {renderVideoButtons(concert.videoLinks)}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Concerts;
