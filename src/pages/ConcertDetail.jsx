import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Avatar, Tag, Space, Button, Divider, List, Badge, Collapse, Row, Col, Grid, Spin, message } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, EnvironmentOutlined, BankOutlined, StarOutlined, FireOutlined, DownOutlined, RightOutlined } from '@ant-design/icons';
import { usePageTitle } from '../hooks/usePageTitle';
import { concertsData as localConcertsData } from '../data/concertsData';
import dbService from '../services/database';

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

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

const ConcertDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expandedDays, setExpandedDays] = useState({});
  const [isSingleDayExpanded, setIsSingleDayExpanded] = useState(true);
  const [concert, setConcert] = useState(null);
  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint();

  // 從資料庫載入演唱會資料
  useEffect(() => {
    const loadConcertData = async () => {
      try {
        setLoading(true);

        // 優先使用從 state 傳遞過來的演唱會資料
        let concertFromState = location.state?.concert;

        if (concertFromState) {
          // 如果已經有演唱會資料，直接使用（因為 Concerts.jsx 已經從資料庫載入了）
          setConcert(concertFromState);
          setLoading(false);
          return;
        }

        // 如果沒有從 state 獲取到，嘗試從 URL 參數獲取
        const concertParam = searchParams.get('concert');
        if (concertParam) {
          try {
            concertFromState = JSON.parse(decodeURIComponent(concertParam));
            setConcert(concertFromState);
            setLoading(false);
            return;
          } catch (e) {
            console.error('解析演唱會資料失敗:', e);
          }
        }

        // 如果都沒有，嘗試從資料庫載入所有演唱會資料，然後根據 ID 或名稱查找
        const concertId = searchParams.get('id');
        const concertName = searchParams.get('name');

        if (concertId || concertName) {
          try {
            const concertsData = await dbService.getConcerts();
            const foundConcert = concertsData.find(item =>
              (concertId && item.id === concertId) ||
              (concertName && item.concertName === concertName)
            );

            if (foundConcert) {
              setConcert(foundConcert);
            } else {
              // 如果資料庫中找不到，嘗試從本地資料查找
              const localConcert = localConcertsData.find(item =>
                (concertId && item.id === concertId) ||
                (concertName && item.concertName === concertName)
              );
              if (localConcert) {
                setConcert(localConcert);
                message.warning('使用本地資料');
              } else {
                message.error('找不到指定的演唱會');
              }
            }
          } catch (error) {
            console.error('從資料庫載入演唱會資料失敗，使用本地資料:', error);
            // 如果資料庫連接失敗，嘗試從本地資料查找
            const localConcert = localConcertsData.find(item =>
              (concertId && item.id === concertId) ||
              (concertName && item.concertName === concertName)
            );
            if (localConcert) {
              setConcert(localConcert);
              message.warning('無法連接到資料庫，使用本地資料');
            }
          }
        }
      } catch (error) {
        console.error('載入演唱會資料失敗:', error);
        message.error('載入演唱會資料失敗');
      } finally {
        setLoading(false);
      }
    };

    loadConcertData();
  }, [location.state, searchParams]);

  usePageTitle(
    concert
      ? `${concert.concertName || concert.title || '演唱會'} 詳細資訊｜TNT時代少年團`
      : '演唱會詳細資訊｜TNT時代少年團'
  );

  // 載入中狀態
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
          onClick={() => {
            // 保存當前滾動位置
            const currentPosition = window.scrollY;
            sessionStorage.setItem('scroll_/concert-detail', currentPosition.toString());
            // 標記為返回導航
            sessionStorage.setItem('nav_type_/concerts', 'back');
            navigate('/concerts');
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
        <Row gutter={[32, 32]} style={{ marginBottom: '20px' }}>
          {/* 左邊：圖片區域 */}
          <Col xs={24} md={10} lg={9}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* 主圖 */}
              <div style={{ width: '100%' }}>
                {concert.image ? (
                  <img
                    src={concert.image}
                    alt={concert.concertName}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                      border: '3px solid #87CEEB',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    aspectRatio: '4/3',
                    backgroundColor: '#87CEEB',
                    borderRadius: '12px',
                    border: '3px solid #87CEEB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '64px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                  }}>
                    {concert.emoji || '🎵'}
                  </div>
                )}
              </div>

            {/* 大合照 - 只顯示單天演唱會的大合照 */}
              {(() => {
                // 如果是多天演唱會（setlist 是對象），不在左側顯示大合照
                if (typeof concert.setlist === 'object' && !Array.isArray(concert.setlist)) {
                  return null;
                }

                // 沒有資料就不顯示
                if (!concert.groupPhoto) {
                  return null;
                }

                // 後端已經處理了 JSON 解析，這裡直接使用處理後的資料
                let groupPhotos = [];

                // 字串：單張路徑
                if (typeof concert.groupPhoto === 'string') {
                  groupPhotos = [concert.groupPhoto];
                }
                // 陣列：多張路徑
                else if (Array.isArray(concert.groupPhoto)) {
                  groupPhotos = concert.groupPhoto;
                }
                // 物件：{ day1: '...', day2: '...' } → 取所有 value（後端已解析）
                else if (typeof concert.groupPhoto === 'object' && concert.groupPhoto !== null) {
                  groupPhotos = Object.values(concert.groupPhoto);
                }

                // 過濾掉空值
                groupPhotos = groupPhotos.filter(Boolean);

                if (groupPhotos.length === 0) {
                  return null;
                }

                return groupPhotos.map((photo, index) => (
                  <div key={index} style={{ width: '100%' }}>
                    <img
                      src={photo}
                      alt={`${concert.concertName} 大合照${groupPhotos.length > 1 ? ` (${index + 1})` : ''}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '12px',
                        border: '3px solid #87CEEB',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                ));
              })()}
            </div>
          </Col>

          {/* 右邊：文字資訊區域 */}
          <Col xs={24} md={14} lg={15}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Title level={1} style={{
                color: '#333',
                marginBottom: '16px',
                fontSize: '36px',
                textAlign: screens.xs ? 'center' : 'left'
              }}>
                {concert.concertName}
              </Title>

              <Space direction="vertical" size="small" style={{ width: '100%', marginBottom: '24px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%', gap: '8px' }}>
                  <Space>
                    <CalendarOutlined style={{ color: '#87CEEB' }} />
                    <Text strong>{formatDate(concert.date)}</Text>
                  </Space>
                  {getStatusTag(concert.status)}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <EnvironmentOutlined style={{ color: '#87CEEB', marginRight: '8px' }} />
                  <Text>{concert.location}</Text>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <BankOutlined style={{ color: '#87CEEB', marginRight: '8px' }} />
                  <Text>{concert.venue}</Text>
                </div>
              </Space>

              <Divider style={{ borderColor: '#87CEEB', margin: '16px 0' }} />

              {/* 演唱會描述 */}
              <div>
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
            </div>
          </Col>
        </Row>

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
                      {formatDate(dayData.date)} - {dayData.theme}
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
                      {/* 顯示該天的大合照 */}
                      {concert.groupPhoto && typeof concert.groupPhoto === 'object' && concert.groupPhoto[dayKey] && (
                        <div style={{ marginBottom: '16px', width: '100%' }}>
                          <img
                            src={concert.groupPhoto[dayKey]}
                            alt={`${concert.concertName} ${dayData.theme} 大合照`}
                            style={{
                              width: '100%',
                              maxWidth: '600px',
                              height: 'auto',
                              borderRadius: '12px',
                              border: '3px solid #87CEEB',
                              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                              objectFit: 'cover'
                            }}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
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
                              <div style={{ width: '100%' }}>
                                {item.type === 'collection' ? (
                                  // 歌曲合集格式
                                  <>
                                    <Text strong style={{ fontSize: '16px' }}>{item.name}</Text>
                                    <br />
                                    <Text style={{ fontSize: '14px', color: '#666', marginTop: '4px', display: 'block' }}>
                                      {item.songs.join('、')}
                                    </Text>
                                    <Text style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>演唱者: {item.performer}</Text>
                                  </>
                                ) : (
                                  // 單曲格式（向後兼容）
                                  <>
                                    <Text strong style={{ fontSize: '16px' }}>{item.song}</Text>
                                    <br />
                                    <Text style={{ fontSize: '14px', color: '#666' }}>演唱者: {item.performer}</Text>
                                  </>
                                )}
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
                        <div style={{ width: '100%' }}>
                          {item.type === 'collection' ? (
                            // 歌曲合集格式
                            <>
                              <Text strong style={{ fontSize: '16px' }}>{item.name}</Text>
                              <br />
                              <Text style={{ fontSize: '14px', color: '#666', marginTop: '4px', display: 'block' }}>
                                {item.songs.join('、')}
                              </Text>
                              <Text style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>演唱者: {item.performer}</Text>
                            </>
                          ) : (
                            // 單曲格式（向後兼容）
                            <>
                              <Text strong style={{ fontSize: '16px' }}>{item.song}</Text>
                              <br />
                              <Text style={{ fontSize: '14px', color: '#666' }}>演唱者: {item.performer}</Text>
                            </>
                          )}
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
