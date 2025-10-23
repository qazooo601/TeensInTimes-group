import React, { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Avatar, Tag, Space, Button, Divider, List, Collapse } from 'antd';
import { ArrowLeftOutlined, HeartOutlined, StarOutlined, CalendarOutlined, PlayCircleOutlined, DownOutlined, RightOutlined, VideoCameraOutlined, SoundOutlined, MonitorOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
import { BsSinaWeibo } from "react-icons/bs";
import { membersData } from '../data/membersData';
import { getMemberDetails } from '../data/members/index';

const { Title, Paragraph, Text } = Typography;

const MemberDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [expandedSections, setExpandedSections] = useState({
    movies: false,
    songs: false,
    variety: false,
    awards: false
  });

  // 從 URL 參數或 location.state 獲取成員資料
  let member = location.state?.member;
  if (!member) {
    const memberParam = searchParams.get('member');
    if (memberParam) {
      try {
        member = JSON.parse(decodeURIComponent(memberParam));
      } catch (e) {
        console.error('解析成員資料失敗:', e);
      }
    }
  }

  // 獲取成員詳細資料
  const memberDetails = member ? getMemberDetails(member.memberCode) : null;

  // 切換區塊展開/收合
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 如果沒有傳入特定成員，顯示所有成員列表
  if (!member) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={1} style={{
            color: '#FFD700',
            marginBottom: '8px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            fontSize: '36px'
          }}>
            時代少年團成員介紹
          </Title>
          <Paragraph style={{
            fontSize: '18px',
            color: '#666',
            marginBottom: '16px'
          }}>
            ✨ 點擊成員卡片查看詳細介紹 ✨
          </Paragraph>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          {membersData.map((memberData, index) => {
            // 處理顏色：如果是陣列則創建漸層，如果是單一顏色則使用原色
            const isGradient = Array.isArray(memberData.supportColor);
            const primaryColor = isGradient ? memberData.supportColor[0] : memberData.supportColor;
            const backgroundStyle = isGradient
              ? `linear-gradient(135deg, ${memberData.supportColor[0]}70 0%, ${memberData.supportColor[1]}70 100%)`
              : `linear-gradient(135deg, ${memberData.supportColor}20 0%, ${memberData.supportColor}40 100%)`;

            return (
              <Card
                key={index}
                hoverable
                onClick={() => {
                  navigate('/member-detail', { state: { member: memberData } });
                }}
                style={{
                  textAlign: 'center',
                  borderRadius: '20px',
                  border: `3px solid ${primaryColor}`,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  background: backgroundStyle,
                  cursor: 'pointer'
                }}
                bodyStyle={{ padding: '20px' }}
              >
                <Avatar
                  size={60}
                  src={memberData.image}
                  style={{
                    backgroundColor: primaryColor,
                    marginBottom: '12px',
                    fontSize: '24px',
                    border: `2px solid ${primaryColor}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                  onError={() => {
                    return memberData.emoji;
                  }}
                >
                  {memberData.emoji}
                </Avatar>
                <Title level={3} style={{
                  color: '#333',
                  marginBottom: '8px',
                  fontSize: '20px'
                }}>
                  {memberData.memberName}
                </Title>
                <Text style={{
                  color: primaryColor,
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {memberData.fanName}
                </Text>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // 顯示特定成員的詳細資訊
  return (
    <div style={{ padding: '24px', position: 'relative' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/members')}
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
          border: `3px solid ${Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          background: Array.isArray(member.supportColor)
            ? `linear-gradient(135deg, ${member.supportColor[0]}70 0%, ${member.supportColor[1]}70 100%)`
            : `linear-gradient(135deg, ${member.supportColor}20 0%, ${member.supportColor}40 100%)`
        }}
        styles={{ body: { padding: '40px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Avatar
            size={120}
            src={member.image}
            style={{
              backgroundColor: Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor,
              marginBottom: '15px',
              fontSize: '48px',
              border: `3px solid ${Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
            }}
            onError={() => {
              return member.emoji;
            }}
          >
            {member.emoji}
          </Avatar>
          <Title level={1} style={{
            color: (() => {
              const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
              // 為不同顏色創建對應的深色版本
              const colorMap = {
                '#9A91F2': '#8076B7',
                '#FFD700': '#B8860B',
                '#63C3DE': '#4B9DB4',
                '#FFFFFF': '#919191',
                '#C0EBD7': '#37A471',
                '#FF5546': '#CC0000',
                '#ADD5A2': '#89C379'
              };
              return colorMap[baseColor] || '#333';
            })(),
            marginBottom: '8px',
            fontSize: '36px'
          }}>
            {member.memberName}
          </Title>
          <Title level={2} style={{
            color: '#333',
            marginBottom: '10px',
            fontSize: '24px'
          }}>
            {member.memberNameEn}
          </Title>
          <Space>
            <Tag color="gold" icon={<HeartOutlined />}>{member.fanName}</Tag>
            <Tag color="default" icon={<CalendarOutlined />}>{member.birthday}</Tag>
            <Tag
              color="red"
              icon={<BsSinaWeibo style={{ transform: 'translateY(2px)', marginRight: '4px' }}/>}
              style={{ cursor: 'pointer' }}
              onClick={() => window.open(member.weibo, '_blank')}
            >
              @{member.memberNameCn}
            </Tag>
          </Space>
        </div>

        <Divider style={{ borderColor: Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor }} />

        <div style={{ textAlign: 'center' }}>
          <Title level={3} style={{
            color: '#333',
            marginBottom: '10px'
          }}>
            成員介紹
          </Title>
          <Paragraph style={{
            fontSize: '14px',
            lineHeight: '1.8',
            color: '#666',
            textAlign: 'left',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            {member.content}
          </Paragraph>
        </div>
      </Card>

      {/* 詳細資料區塊 */}
      {memberDetails && (
        <div style={{ marginTop: '24px' }}>
          {/* 個人歌曲 */}
          {memberDetails.songs && memberDetails.songs.length > 0 && (
            <Card
              style={{
                marginBottom: '16px',
                borderRadius: '12px',
                border: `2px solid ${Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor}20`
              }}
              styles={{ body: { padding: '20px' } }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: expandedSections.songs ? '16px' : '0'
                }}
                onClick={() => toggleSection('songs')}
              >
                <SoundOutlined style={{
                  color: (() => {
                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                    // 為不同顏色創建對應的深色版本
                    const colorMap = {
                      '#9A91F2': '#8076B7',
                      '#FFD700': '#B8860B',
                      '#63C3DE': '#4B9DB4',
                      '#FFFFFF': '#919191',
                      '#C0EBD7': '#37A471',
                      '#FF5546': '#CC0000',
                      '#ADD5A2': '#89C379'
                    };
                    return colorMap[baseColor] || '#333';
                  })(),
                  marginRight: '8px',
                  fontSize: '18px'
                }} />
                <Title level={4} style={{
                  margin: '0',
                  color: (() => {
                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                    // 為不同顏色創建對應的深色版本
                    const colorMap = {
                      '#9A91F2': '#8076B7',
                      '#FFD700': '#B8860B',
                      '#63C3DE': '#4B9DB4',
                      '#FFFFFF': '#919191',
                      '#C0EBD7': '#37A471',
                      '#FF5546': '#CC0000',
                      '#ADD5A2': '#89C379'
                    };
                    return colorMap[baseColor] || '#333';
                  })()
                }}>
                  個人歌曲 ({memberDetails.songs.length})
                </Title>
                {expandedSections.songs ? <DownOutlined /> : <RightOutlined />}
              </div>

              {expandedSections.songs && (
                <div>
                  {/* 單曲 */}
                  {memberDetails.songs.filter(song => song.type === '單曲').length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <Title level={5} style={{
                        color: '#D6B600',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        單曲
                      </Title>
                      <List
                        dataSource={memberDetails.songs.filter(song => song.type === '單曲')}
                        renderItem={(item) => (
                          <List.Item style={{ padding: '8px 0', border: 'none' }}>
                            <div style={{ width: '100%' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                  <Text strong style={{ fontSize: '15px' }}>{item.title}</Text>
                                  <br />
                                  <Text style={{ color: '#666', fontSize: '13px' }}>
                                    發行日期: {item.releaseDate}
                                  </Text>
                                  <br />
                                  <Text style={{ color: '#999', fontSize: '11px' }}>{item.description}</Text>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {item.audioUrl && (
                                    <Button
                                      type="primary"
                                      size="small"
                                      icon={<PlayCircleOutlined />}
                                      onClick={() => window.open(item.audioUrl, '_blank')}
                                      style={{
                                        background: '#FFD700',
                                        border: 'none',
                                        color: '#000'
                                      }}
                                    >
                                      播放
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}

                  {/* 專輯 */}
                  {memberDetails.songs.filter(song => song.type === '專輯').length > 0 && (
                    <div>
                      <Title level={5} style={{
                        color: '#25A7DA',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        EP
                      </Title>
                      <List
                        dataSource={memberDetails.songs.filter(song => song.type === '專輯')}
                        renderItem={(item) => (
                          <List.Item style={{ padding: '8px 0', border: 'none' }}>
                            <div style={{ width: '100%' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <div style={{ flex: 1 }}>
                                  <Text strong style={{ fontSize: '15px' }}>{item.title}</Text>
                                  <br />
                                  <Text style={{ color: '#666', fontSize: '13px' }}>
                                    發行日期: {item.releaseDate} | 共 {item.songs ? item.songs.length : 0} 首歌曲
                                  </Text>
                                  <br />
                                  <Text style={{ color: '#999', fontSize: '11px' }}>{item.description}</Text>
                                </div>
                              </div>

                              {/* 專輯中的單曲列表 */}
                              {item.songs && item.songs.length > 0 && (
                                <div style={{
                                  marginLeft: '16px',
                                  padding: '8px 12px',
                                  backgroundColor: '#f8f9fa',
                                  borderRadius: '6px',
                                  border: '1px solid #e9ecef'
                                }}>
                                  <Text style={{
                                    fontSize: '12px',
                                    color: '#25A7DA',
                                    fontWeight: 'bold',
                                    marginBottom: '4px',
                                    display: 'block'
                                  }}>
                                    專輯曲目:
                                  </Text>
                                  {item.songs.map((song, index) => (
                                    <div key={index} style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: '2px 0',
                                      fontSize: '12px'
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <Text style={{
                                          color: '#666',
                                          marginRight: '8px',
                                          minWidth: '20px'
                                        }}>
                                          {index + 1}.
                                        </Text>
                                        <Text style={{ color: '#333' }}>{song.title}</Text>
                                      </div>
                                      {song.audioUrl && (
                                        <Button
                                          type="text"
                                          size="small"
                                          icon={<PlayCircleOutlined />}
                                          onClick={() => window.open(song.audioUrl, '_blank')}
                                          style={{
                                            color: '#25A7DA',
                                            padding: '0 4px',
                                            height: '20px',
                                            fontSize: '10px'
                                          }}
                                        >
                                          播放
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}

                  {/* 合作 */}
                  {memberDetails.songs.filter(song => song.type === '合作').length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <Title level={5} style={{
                        color: '#D60000',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        合作
                      </Title>
                      <List
                        dataSource={memberDetails.songs.filter(song => song.type === '合作')}
                        renderItem={(item) => (
                          <List.Item style={{ padding: '8px 0', border: 'none' }}>
                            <div style={{ width: '100%' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                  <Text strong style={{ fontSize: '15px' }}>{item.title}</Text>
                                  <br />
                                  <Text style={{ color: '#666', fontSize: '13px' }}>
                                    發行日期: {item.releaseDate}
                                  </Text>
                                  <br />
                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <UserOutlined style={{ color: '#D60000', marginRight: '4px', fontSize: '10px' }} />
                                    <Text style={{ color: '#999', fontSize: '11px' }}>{item.description}</Text>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  {item.audioUrl && (
                                    <Button
                                      type="primary"
                                      size="small"
                                      icon={<PlayCircleOutlined />}
                                      onClick={() => window.open(item.audioUrl, '_blank')}
                                      style={{
                                        background: '#FF6B6B',
                                        border: 'none',
                                        color: '#fff'
                                      }}
                                    >
                                      播放
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </div>
              )}
            </Card>
          )}

          {/* 綜藝節目 */}
          {memberDetails.variety && memberDetails.variety.length > 0 && (
            <Card
              style={{
                marginBottom: '16px',
                borderRadius: '12px',
                border: `2px solid ${Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor}20`
              }}
              styles={{ body: { padding: '20px' } }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: expandedSections.variety ? '16px' : '0'
                }}
                onClick={() => toggleSection('variety')}
              >
                <MonitorOutlined style={{
                  color: (() => {
                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                    // 為不同顏色創建對應的深色版本
                    const colorMap = {
                      '#9A91F2': '#8076B7',
                      '#FFD700': '#B8860B',
                      '#63C3DE': '#4B9DB4',
                      '#FFFFFF': '#919191',
                      '#C0EBD7': '#37A471',
                      '#FF5546': '#CC0000',
                      '#ADD5A2': '#89C379'
                    };
                    return colorMap[baseColor] || '#333';
                  })(),
                  marginRight: '8px',
                  fontSize: '18px'
                }} />
                <Title level={4} style={{
                  margin: '0',
                  color: (() => {
                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                    // 為不同顏色創建對應的深色版本
                    const colorMap = {
                      '#9A91F2': '#8076B7',
                      '#FFD700': '#B8860B',
                      '#63C3DE': '#4B9DB4',
                      '#FFFFFF': '#919191',
                      '#C0EBD7': '#37A471',
                      '#FF5546': '#CC0000',
                      '#ADD5A2': '#89C379'
                    };
                    return colorMap[baseColor] || '#333';
                  })()
                }}>
                  個人外務 ({memberDetails.variety.length})
                </Title>
                {expandedSections.variety ? <DownOutlined /> : <RightOutlined />}
              </div>

              {expandedSections.variety && (
                <List
                  dataSource={memberDetails.variety}
                  renderItem={(item) => (
                    <List.Item style={{ padding: '12px 0' }}>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <Text strong style={{ fontSize: '16px' }}>{item.title}</Text>
                            <br />
                            <Text style={{ color: '#666', fontSize: '14px' }}>
                              角色：{item.role} | 年份：{item.year}
                            </Text>
                            <br />
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Text style={{ color: '#999', fontSize: '12px', whiteSpace: 'pre-line' }}>{item.description}</Text>
                              {item.videoUrl && (
                                <Button
                                  type="primary"
                                  icon={<PlayCircleOutlined />}
                                  onClick={() => window.open(item.videoUrl, '_blank')}
                                  style={{
                                    backgroundColor: Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor,
                                    borderColor: Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor,
                                    borderRadius: '20px',
                                    height: '28px',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    padding: '0 12px',
                                    marginLeft: '12px',
                                    flexShrink: 0
                                  }}
                                >
                                  觀看影片
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          )}

          {/* 影視劇作品 */}
          {memberDetails.movies && memberDetails.movies.length > 0 && (
            <Card
              style={{
                marginBottom: '16px',
                borderRadius: '12px',
                border: `2px solid ${Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor}20`
              }}
              styles={{ body: { padding: '20px' } }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: expandedSections.movies ? '16px' : '0'
                }}
                onClick={() => toggleSection('movies')}
              >
                <VideoCameraOutlined style={{
                  color: (() => {
                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                    // 為不同顏色創建對應的深色版本
                    const colorMap = {
                      '#9A91F2': '#8076B7',
                      '#FFD700': '#B8860B',
                      '#63C3DE': '#4B9DB4',
                      '#FFFFFF': '#919191',
                      '#C0EBD7': '#37A471',
                      '#FF5546': '#CC0000',
                      '#ADD5A2': '#89C379'
                    };
                    return colorMap[baseColor] || '#333';
                  })(),
                  marginRight: '8px',
                  fontSize: '18px'
                }} />
                <Title level={4} style={{
                  margin: '0',
                  color: (() => {
                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                    // 為不同顏色創建對應的深色版本
                    const colorMap = {
                      '#9A91F2': '#8076B7',
                      '#FFD700': '#B8860B',
                      '#63C3DE': '#4B9DB4',
                      '#FFFFFF': '#919191',
                      '#C0EBD7': '#37A471',
                      '#FF5546': '#CC0000',
                      '#ADD5A2': '#89C379'
                    };
                    return colorMap[baseColor] || '#333';
                  })()
                }}>
                  影視劇作品 ({memberDetails.movies.length})
                </Title>
                {expandedSections.movies ? <DownOutlined /> : <RightOutlined />}
              </div>

              {expandedSections.movies && (
                <List
                  dataSource={memberDetails.movies}
                  renderItem={(item) => (
                    <List.Item style={{ padding: '12px 0' }}>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <Text strong style={{ fontSize: '16px' }}>{item.title}</Text>
                            <br />
                            <Text style={{ color: '#666', fontSize: '14px' }}>
                              角色：{item.role} | 年份：{item.year} | 類型：{item.type}
                            </Text>
                            <br />
                            <Text style={{ color: '#999', fontSize: '12px' }}>{item.description}</Text>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          )}

          {/* 獲獎 */}
          {memberDetails.awards && memberDetails.awards.length > 0 && (
            <Card
              style={{
                marginBottom: '16px',
                borderRadius: '12px',
                border: `2px solid ${Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor}20`
              }}
              styles={{ body: { padding: '20px' } }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: expandedSections.awards ? '16px' : '0'
                }}
                onClick={() => toggleSection('awards')}
              >
                <TrophyOutlined style={{
                  color: (() => {
                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                    // 為不同顏色創建對應的深色版本
                    const colorMap = {
                      '#9A91F2': '#8076B7',
                      '#FFD700': '#B8860B',
                      '#63C3DE': '#4B9DB4',
                      '#FFFFFF': '#919191',
                      '#C0EBD7': '#37A471',
                      '#FF5546': '#CC0000',
                      '#ADD5A2': '#89C379'
                    };
                    return colorMap[baseColor] || '#333';
                  })(),
                  marginRight: '8px',
                  fontSize: '18px'
                }} />
                <Title level={4} style={{
                  margin: '0',
                  color: (() => {
                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                    // 為不同顏色創建對應的深色版本
                    const colorMap = {
                      '#9A91F2': '#8076B7',
                      '#FFD700': '#B8860B',
                      '#63C3DE': '#4B9DB4',
                      '#FFFFFF': '#919191',
                      '#C0EBD7': '#37A471',
                      '#FF5546': '#CC0000',
                      '#ADD5A2': '#89C379'
                    };
                    return colorMap[baseColor] || '#333';
                  })()
                }}>
                  獲獎 ({memberDetails.awards.length})
                </Title>
                {expandedSections.awards ? <DownOutlined /> : <RightOutlined />}
              </div>

              {expandedSections.awards && (
                <List
                  dataSource={memberDetails.awards}
                  renderItem={(item) => (
                    <List.Item style={{ padding: '12px 0' }}>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <Text strong style={{ fontSize: '16px' }}>{item.title}</Text>
                            <br />
                            <Text style={{ color: '#666', fontSize: '14px' }}>
                            頒獎典禮：{item.award} | 日期：{item.year}
                            </Text>
                            <br />
                            <Text style={{ color: '#999', fontSize: '12px' }}>{item.description}</Text>
                          </div>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              )}
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberDetail;
