import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Badge, Tag, Space, Button } from 'antd';
import { FireOutlined, StarOutlined, CalendarOutlined, EnvironmentOutlined, BankOutlined, PlayCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';
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

  const renderVideoButtons = (videoLinks, options = {}) => {
    const { compact = false } = options;
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
          icon={<VideoCameraOutlined />}
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
      <div style={{ marginTop: compact ? '0' : '12px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {buttons}
      </div>
    ) : null;
  };

  return (
    <div style={{ padding: '24px', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1} style={{
          color: '#EBC700',
          marginBottom: '8px',
          fontSize: '36px'
        }}>
          演唱會
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
                border: '3px solid rgb(252, 227, 0)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg,hsl(59, 100.00%, 89.00%) 0%,rgb(240, 237, 88) 100%)',
                cursor: 'pointer'
              }}
              styles={{ body: { padding: '20px' } }}
            >
              {/* 上層：左（圖+標題），右（日期/地點/場地） */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                {/* 上左：標題（縮短寬度） */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 1 42%' }}>
                  <Title level={3} style={{
                    color: '#333',
                    margin: 0,
                    fontSize: '20px',
                    lineHeight: 1.2,
                    wordBreak: 'break-word'
                  }}>
                    {concert.concertName}
                  </Title>
                </div>

                {/* 上右：日期、地點、場地 */}
                <Space direction="vertical" size="small" style={{ minWidth: 0, flex: '1 1 58%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarOutlined style={{ color: '#ffd700', marginRight: '8px' }} />
                    <Text strong>{concert.date}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <EnvironmentOutlined style={{ color: '#ffd700', marginRight: '8px' }} />
                    <Text>{concert.location}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <BankOutlined style={{ color: '#ffd700', marginRight: '8px' }} />
                    <Text>{concert.venue}</Text>
                  </div>
                </Space>
              </div>

              {/* 下層：狀態 + 影片按鈕 */}
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                {getStatusTag(concert.status)}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {renderVideoButtons(concert.videoLinks, { compact: true })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>


    </div>
  );
};

export default Concerts;
