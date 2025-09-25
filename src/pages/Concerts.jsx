import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Badge, Tag, Space, Avatar } from 'antd';
import { FireOutlined, StarOutlined, CalendarOutlined, EnvironmentOutlined, BankOutlined } from '@ant-design/icons';
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
        return <Tag color="red">已取消</Tag>;
      default:
        return <Tag color="default">未知</Tag>;
    }
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
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Concerts;
