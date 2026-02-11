import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Badge, Tag, Space, Button, Spin, message } from 'antd';
import { FireOutlined, StarOutlined, CalendarOutlined, EnvironmentOutlined, BankOutlined, PlayCircleOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { concertsData as localConcertsData } from '../data/concertsData';
import { usePageTitle } from '../hooks/usePageTitle';
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

const Concerts = () => {
  const navigate = useNavigate();
  const [concertsData, setConcertsData] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageTitle('演唱會｜時代少年團');

  // 從資料庫載入演唱會資料
  useEffect(() => {
    const loadConcertsData = async () => {
      try {
        setLoading(true);
        const data = await dbService.getConcerts();
        setConcertsData(data);
        console.log('成功從資料庫載入演唱會資料:', data.length, '筆');
      } catch (error) {
        console.error('從資料庫載入演唱會資料失敗，使用本地資料:', error);
        message.warning('無法連接到資料庫，使用本地資料');
        setConcertsData(localConcertsData);
      } finally {
        setLoading(false);
      }
    };

    loadConcertsData();
  }, []);

  // 返回演唱會列表時還原滾動位置（等待資料載入完成再還原，避免被「載入中」畫面截斷）
  useEffect(() => {
    if (loading) return;

    const navType = sessionStorage.getItem('nav_type_/concerts');
    const savedPosition = sessionStorage.getItem('scroll_/concerts');

    if (navType === 'back' && savedPosition && savedPosition !== '0') {
      const top = parseInt(savedPosition, 10) || 0;
      // 使用 setTimeout 確保 DOM 已完全渲染
      setTimeout(() => {
        window.scrollTo({ top, behavior: 'auto' });
      }, 200);
    } else if (navType !== 'back') {
      // 新進入頁面時滾動到頂部
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    // 使用一次後就清掉導航標記，避免影響之後的進入行為
    if (navType === 'back') {
      sessionStorage.removeItem('nav_type_/concerts');
    }
  }, [loading]);

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
                  backgroundColor: '#C9BB22',
                  borderColor: '#C9BB22',
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
              backgroundColor: '#C9BB22',
              borderColor: '#C9BB22',
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
                // 保存當前滾動位置
                const currentPosition = window.scrollY;
                sessionStorage.setItem('scroll_/concerts', currentPosition.toString());
                // 標記為前進導航
                sessionStorage.setItem('nav_type_/concert-detail', 'forward');
                navigate('/concert-detail', { state: { concert } });
              }}
              style={{
                borderRadius: '20px',
                border: '3px solid rgb(252, 227, 0)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                background: 'linear-gradient(135deg,hsl(59, 100.00%, 89.00%) 0%,rgb(240, 237, 88) 100%)',
                cursor: 'pointer',
                maxWidth: '92%',     // 防止在極小螢幕的手機上超出範圍
              }}
              styles={{ body: { padding: '20px' } }}
            >
              {/* 上層：左（圖+標題），右（日期/地點/場地） */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                {/* 上左：標題（縮短寬度） */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '0 1 42%' }}>
                  <Title level={3} style={{
                    color: '#333',
                    margin: 0,
                    fontSize: '20px',
                    lineHeight: 1.2,
                    wordBreak: 'break-word'
                  }}>
                    {concert.concertName}
                  </Title>
                  {concert.showNumber && (
                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                      <Text style={{
                        fontSize: '14px',
                        color: '#999',
                        fontWeight: 500
                      }}>
                        {concert.showNumber}
                      </Text>
                    </div>
                  )}
                </div>

                {/* 上右：日期、地點、場地 */}
                <Space direction="vertical" size="small" style={{ minWidth: 0, flex: '1 1 58%' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarOutlined style={{ color: '#ffd700', marginRight: '8px' }} />
                    <Text strong>{formatDate(concert.date)}</Text>
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
