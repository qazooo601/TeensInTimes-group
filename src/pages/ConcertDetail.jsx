import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Avatar, Tag, Space, Button, Divider, List, Badge, Collapse } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, EnvironmentOutlined, BankOutlined, StarOutlined, FireOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ConcertDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expandedDays, setExpandedDays] = useState({});
  const [isSingleDayExpanded, setIsSingleDayExpanded] = useState(true);

  // 從 URL 參數或 location.state 獲取演唱會資料
  let concert = location.state?.concert;
  if (!concert) {
    const concertParam = searchParams.get('concert');
    if (concertParam) {
      try {
        concert = JSON.parse(decodeURIComponent(concertParam));
      } catch (e) {
        console.error('解析演唱會資料失敗:', e);
      }
    }
  }

  // 如果沒有傳入特定演唱會，顯示所有演唱會列表
  if (!concert) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={1} style={{
            color: '#FFD700',
            marginBottom: '8px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontSize: '36px'
          }}>
            演唱會詳細資訊
          </Title>
          <Paragraph style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '16px'
          }}>
            ✨ 請從演唱會列表選擇查看詳細資訊 ✨
          </Paragraph>
        </div>
      </div>
    );
  }

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

  const toggleDayExpansion = (dayKey) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey]
    }));
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/concerts')}
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
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Avatar
            size={120}
            src={concert.image}
            style={{
              backgroundColor: '#87CEEB',
              marginBottom: '15px',
              fontSize: '48px',
              border: '3px solid #87CEEB',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
            }}
            onError={() => {
              return concert.emoji;
            }}
          >
            {concert.emoji}
          </Avatar>
          <Title level={1} style={{
            color: '#333',
            marginBottom: '8px',
            fontSize: '36px'
          }}>
            {concert.concertName}
          </Title>
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
        </div>

        <Divider style={{ borderColor: '#87CEEB' }} />

        {/* 演唱會描述 */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={3} style={{
            color: '#333',
            marginBottom: '10px'
          }}>
            介紹
          </Title>
          <Paragraph style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#666',
            textAlign: 'left',
            whiteSpace: 'pre-line'
          }}>
            {concert.description}
          </Paragraph>
        </div>

        {/* 曲目列表 */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={3} style={{
            color: '#333',
            marginBottom: '16px'
          }}>
            曲目列表
          </Title>

          {/* 判斷是否為多天演唱會 */}
          {typeof concert.setlist === 'object' && !Array.isArray(concert.setlist) ? (
            // 多天演唱會顯示
            <div>
              {Object.entries(concert.setlist).map(([dayKey, dayData]) => (
                <div key={dayKey} style={{ marginBottom: '16px' }}>
                  <div
                    onClick={() => toggleDayExpansion(dayKey)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: 'rgba(135, 206, 235, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid #87CEEB',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(135, 206, 235, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(135, 206, 235, 0.1)';
                    }}
                  >
                    <Title level={4} style={{
                      color: '#23A0D1',
                      margin: 0,
                      fontSize: '18px'
                    }}>
                      {dayData.date} - {dayData.theme}
                    </Title>
                    <Space>
                      <Text style={{ color: '#23A0D1', fontSize: '14px' }}>
                        {dayData.songs.length} 首歌曲
                      </Text>
                      {expandedDays[dayKey] ?
                        <DownOutlined style={{ color: '#23A0D1' }} /> :
                        <RightOutlined style={{ color: '#23A0D1' }} />
                      }
                    </Space>
                  </div>

                  {expandedDays[dayKey] && (
                    <div style={{ marginTop: '12px' }}>
                      <List
                        dataSource={dayData.songs}
                        renderItem={(item, index) => (
                          <List.Item style={{
                            background: 'rgba(255,255,255,0.7)',
                            margin: '8px 0',
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: '1px solid #87CEEB20'
                          }}>
                            <Space>
                              <Badge count={index + 1} style={{ backgroundColor: '#87CEEB' }} />
                              <div>
                                <Text strong style={{ fontSize: '16px' }}>{item.song}</Text>
                                <br />
                                <Text style={{ fontSize: '14px', color: '#666' }}>演唱者: {item.performer}</Text>
                              </div>
                            </Space>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // 單天演唱會顯示
            <div>
              <div
                onClick={() => setIsSingleDayExpanded(!isSingleDayExpanded)}
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
                  color: '#23A0D1',
                  margin: 0,
                  fontSize: '18px'
                }}>
                  演唱會曲目
                </Title>
                <Space>
                  <Text style={{ color: '#23A0D1', fontSize: '14px' }}>
                    {concert.setlist.length} 首歌曲
                  </Text>
                  {isSingleDayExpanded ?
                    <DownOutlined style={{ color: '#23A0D1' }} /> :
                    <RightOutlined style={{ color: '#23A0D1' }} />
                  }
                </Space>
              </div>

              {isSingleDayExpanded && (
                <List
                  dataSource={concert.setlist}
                  renderItem={(item, index) => (
                    <List.Item style={{
                      background: 'rgba(255,255,255,0.7)',
                      margin: '8px 0',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: '1px solid #87CEEB20'
                    }}>
                      <Space>
                        <Badge count={index + 1} style={{ backgroundColor: '#87CEEB' }} />
                        <div>
                          <Text strong style={{ fontSize: '16px' }}>{item.song}</Text>
                          <br />
                          <Text style={{ fontSize: '14px', color: '#666' }}>演唱者: {item.performer}</Text>
                        </div>
                      </Space>
                    </List.Item>
                  )}
                />
              )}
            </div>
          )}
        </div>

      </Card>
    </div>
  );
};

export default ConcertDetail;
