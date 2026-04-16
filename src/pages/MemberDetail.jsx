import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Typography, Avatar, Tag, Space, Button, Divider, List, Collapse, Row, Col, Spin, message, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, HeartOutlined, StarOutlined, CalendarOutlined, PlayCircleOutlined, DownOutlined, RightOutlined, VideoCameraOutlined, CustomerServiceOutlined, MonitorOutlined, TrophyOutlined, UserOutlined } from '@ant-design/icons';
import { BsSinaWeibo, BsMusicNote } from "react-icons/bs";
import { membersData as localMembersData } from '../data/membersData';
import { getMemberDetails as getLocalMemberDetails } from '../data/members/index';
import { usePageTitle } from '../hooks/usePageTitle';
import { dbService } from '../services/database';
import SEOHead from '../components/SEO/SEOHead';
import { generateBreadcrumbStructuredData, generatePersonStructuredData } from '../utils/structuredData';

const { Title, Paragraph, Text } = Typography;

// 格式化日期：轉成本地時區的 YYYY-MM-DD，避免少一天
const formatDate = (dateString) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    // 無法解析就退回原本前 10 碼
    return String(dateString).slice(0, 10);
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 簡單文字標記轉換：支援 **粗體** 與 [[color:文字]] 顏色標記
const COLOR_TAGS = {
  red: '#D60000',
  green: '#88AA00',
  blue: '#2A52BE',
  gold: '#D6B600',
  brown: '#D2691E',
  orange: '#E67E22',
  purple: '#986FB3',
};

const renderRichText = (text) => {
  if (!text) return null;
  const source = String(text);
  const nodes = [];

  // 支援兩種標記：
  // 1. **粗體**
  // 2. [[color:文字]] 例如 [[green:随行记录]]
  const tokenRegex = /(\[\[([a-zA-Z]+):([^\]]+)\]\]|\*\*([^*]+)\*\*)/g;

  let lastIndex = 0;

  source.replace(tokenRegex, (match, _full, colorName, colorText, boldText, offset) => {
    // 先推入前面的純文字
    if (offset > lastIndex) {
      nodes.push(source.slice(lastIndex, offset));
    }

    if (colorName && colorText != null) {
      const lower = colorName.toLowerCase();
      const color = COLOR_TAGS[lower] || lower; // 未定義的顏色直接當 CSS 顏色用
      nodes.push(
        <span key={nodes.length} style={{ color }}>
          {colorText}
        </span>
      );
    } else if (boldText != null) {
      nodes.push(
        <strong key={nodes.length}>
          {boldText}
        </strong>
      );
    }

    lastIndex = offset + match.length;
    return match;
  });

  // 加上最後一段純文字
  if (lastIndex < source.length) {
    nodes.push(source.slice(lastIndex));
  }

  return nodes;
};

const MemberDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobileView = typeof window !== 'undefined' && window.innerWidth <= 768;
  const pageContainerStyle = isMobileView
    ? { padding: '24px', position: 'relative', marginTop: '-25px' }
    : { padding: '24px', position: 'relative', marginTop: '-8px' };
  const [expandedSections, setExpandedSections] = useState({
    movies: false,
    songs: false,
    variety: false,
    awards: false,
    vlogs: false
  });
  const [expandedSeries, setExpandedSeries] = useState({});
  const [imageError, setImageError] = useState(false);
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memberDetails, setMemberDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [seoDescription, setSeoDescription] = useState('時代少年團成員介紹：七位成員的詳細資料、個人作品、外務綜藝、影視作品、獲獎記錄等完整資訊。');

  // 根據不同的 ID 設定漸變色順序和邊框顏色（與 Members.jsx 相同邏輯）
  const getColorConfig = (id, supportColor) => {
    switch (id) {
      case 1:
        // Id=1: 漸變色順序 #EAF2FF → #9A91F2，邊框 #9A91F2
        return {
          gradientColors: ['#EAF2FF', '#9A91F2'],
          borderColor: '#9A91F2'
        };
      case 4:
        // Id=4: 漸變色順序 #D1D1D1 → #FFFFFF → #A1A3A6，邊框 #A1A3A6
        return {
          gradientColors: ['#D1D1D1', '#FFFFFF', '#A1A3A6'],
          borderColor: '#A1A3A6'
        };
      case 3:
        // Id=3: 漸變色順序 #63C5DE → #E1F5FA，邊框 #63C5DE
        return {
          gradientColors: ['#63C5DE', '#E1F5FA'],
          borderColor: '#63C5DE'
        };
      case 5:
        // Id=5: 漸變色順序 #C0EBD7 → #F98D74，邊框 #C0EBD7
        return {
          gradientColors: ['#C0EBD7', '#F98D74'],
          borderColor: '#C0EBD7'
        };
      case 7:
        // Id=7: 流動漸變色 #ADD5A2 → #B0E0E6 → #FFB6C1 → #E6E6FA → #FFFACD → #FFDAB9 → #ADD5A2，邊框 #ADD5A2
        return {
          gradientColors: ['#ADD5A2', '#B0E0E6', '#FFB6C1', '#E6E6FA', '#FFFACD', '#FFDAB9', '#ADD5A2'],
          borderColor: '#ADD5A2',
          hasIridescentEffect: true
        };
      default:
        // 預設：使用資料庫的 supportColor，邊框使用第一個顏色
        const colors = Array.isArray(supportColor)
          ? supportColor
          : [supportColor];
        return {
          gradientColors: colors,
          borderColor: colors[0]
        };
    }
  };

  // 生成漸層樣式（支援 2、3 個顏色，以及多色漸變）
  const generateGradient = (colors, opacity = '') => {
    if (colors.length === 2) {
      return `linear-gradient(135deg, ${colors[0]}${opacity} 0%, ${colors[1]}${opacity} 100%)`;
    } else if (colors.length === 3) {
      return `linear-gradient(135deg, ${colors[0]}${opacity} 0%, ${colors[1]}${opacity} 50%, ${colors[2]}${opacity} 100%)`;
    } else if (colors.length > 3) {
      const colorStops = colors.map((color, i) =>
        `${color}${opacity} ${(i / (colors.length - 1)) * 100}%`
      ).join(', ');
      return `linear-gradient(135deg, ${colorStops})`;
    } else {
      return `${colors[0]}${opacity}`;
    }
  };

  // 依據支援色取得較深色（用於標題 / icon 等）
  const getDeepSupportColor = (baseColor) => {
    const colorMap = {
      '#EAF2FF': '#8076B7',
      '#FFD700': '#B8860B',
      '#63C5DE': '#4B9DB4',
      '#D1D1D1': '#919191',
      '#C0EBD7': '#37A471',
      '#FF7F50': '#CC0000',
      '#ADD5A2': '#89C379'
    };
    return colorMap[baseColor] || '#333';
  };

  // 從資料庫載入成員列表
  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true);
      try {
        const members = await dbService.getMembers();
        setMembersData(members);
      } catch (error) {
        console.error('從資料庫載入成員資料失敗，使用本地資料:', error);
        setMembersData(localMembersData);

        const errorMsg = error.response
          ? `API 錯誤 (${error.response.status}): ${error.response.data?.error || error.message}`
          : error.code === 'ERR_NETWORK'
            ? '無法連接到後端 API 服務，請確認後端服務是否正在運行 (http://localhost:3003)'
            : `無法連接到資料庫: ${error.message}`;

        message.warning(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, []);

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

  // 如果沒有從 state 或 URL 獲取到成員，嘗試從 membersData 中查找
  if (!member && membersData.length > 0) {
    const memberCode = searchParams.get('code');
    if (memberCode) {
      member = membersData.find(m => m.memberCode === memberCode);
    }
  }

  // 合併本地資料以補充缺失的欄位（如 weibo, memberNameCn, images）
  if (member) {
    const localMember = localMembersData.find(m => m.memberCode === member.memberCode);
    if (localMember) {
      member = {
        ...member,
        weibo: member.weibo || localMember.weibo,
        memberNameCn: member.memberNameCn || localMember.memberNameCn,
        images: member.images || localMember.images || member.image
      };
    }
  }

  // 從資料庫載入成員詳細資料
  useEffect(() => {
    const loadMemberDetails = async () => {
      if (!member?.memberCode) {
        setMemberDetails(null);
        return;
      }

      setDetailsLoading(true);
      try {
        const details = await dbService.getMemberDetails(member.memberCode);
        // 將個人外務、影視作品、獲獎依年份由新到舊排序
        // vlogs 已在後端按 sortOrder 排序，不需要再次排序
        const sortedDetails = {
          ...details,
          variety: (details.variety || []).slice().sort((a, b) => {
            const yearA = String(a.year || '');
            const yearB = String(b.year || '');
            return yearB.localeCompare(yearA);
          }),
          movies: (details.movies || []).slice().sort((a, b) => {
            const yearA = String(a.year || '');
            const yearB = String(b.year || '');
            return yearB.localeCompare(yearA);
          }),
          awards: (details.awards || []).slice().sort((a, b) => {
            const yearA = String(a.year || '');
            const yearB = String(b.year || '');
            return yearB.localeCompare(yearA);
          }),
          vlogs: details.vlogs || []
        };

        setMemberDetails(sortedDetails);

        // 根據成員資料生成 SEO description
        if (member) {
          const description = `${member.memberName}（${member.memberNameEn}）- 時代少年團成員。${member.content ? member.content.substring(0, 100) : '詳細成員介紹'}。包含個人作品、外務綜藝、影視作品、獲獎記錄等完整資訊。`;
          setSeoDescription(description);
        }
      } catch (error) {
        console.error('從資料庫載入成員詳細資料失敗:', error);


        // 只有在網路錯誤或嚴重錯誤時才回退到本地資料
        if (error.code === 'ERR_NETWORK') {
          message.error('無法連接到後端 API 服務，請確認後端服務是否正在運行 (http://localhost:3003)');
          // 不設置 memberDetails，讓頁面顯示載入失敗狀態
          setMemberDetails(null);
        } else {
          // 其他錯誤：顯示錯誤但不回退到本地資料
          const errorMsg = error.response
            ? `資料庫錯誤: ${error.response.data?.message || error.message}`
            : `載入失敗: ${error.message}`;

          message.error(errorMsg);
          setMemberDetails(null);
        }
      } finally {
        setDetailsLoading(false);
      }
    };

    loadMemberDetails();
  }, [member?.memberCode]);

  // 設定分頁標題
  usePageTitle(
    member
      ? `${member.memberName} ｜時代少年團`
      : '成員介紹｜時代少年團'
  );

  // 生成麵包屑結構化資料
  const breadcrumbData = member
    ? generateBreadcrumbStructuredData([
      { name: '首頁', url: '/' },
      { name: '成員', url: '/members' },
      { name: member.memberName, url: `/member-detail?code=${member.memberCode}` }
    ])
    : generateBreadcrumbStructuredData([
      { name: '首頁', url: '/' },
      { name: '成員', url: '/members' }
    ]);

  // 當成員改變時重置圖片錯誤狀態
  useEffect(() => {
    setImageError(false);
  }, [member?.memberCode]);

  // 切換區塊展開/收合
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 切換系列展開/收合
  const toggleSeries = (seriesId) => {
    setExpandedSeries(prev => ({
      ...prev,
      [seriesId]: !prev[seriesId]
    }));
  };

  // 如果沒有傳入特定成員，顯示所有成員列表
  if (!member) {
    if (loading) {
      return (
        <>
          <SEOHead
            title="成員介紹｜時代少年團"
            description={seoDescription}
            structuredData={breadcrumbData}
          />
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
        </>
      );
    }

    return (
      <>
        <SEOHead
          title="成員介紹｜時代少年團"
          description={seoDescription}
          structuredData={breadcrumbData}
        />
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
              // 根據不同的 ID 設定漸變色順序和邊框顏色
              const colorConfig = getColorConfig(memberData.id, memberData.supportColor);
              const gradientColors = colorConfig.gradientColors;
              const borderColor = colorConfig.borderColor;
              const backgroundStyle = generateGradient(gradientColors, '70');
              const avatarGradient = generateGradient(gradientColors);

              return (
                <Card
                  key={index}
                  hoverable
                  onClick={() => {
                    // 保存當前滾動位置
                    const currentPosition = window.scrollY;
                    sessionStorage.setItem('scroll_/member-detail', currentPosition.toString());
                    // 標記為前進導航
                    sessionStorage.setItem('nav_type_/member-detail', 'forward');
                    navigate('/member-detail', { state: { member: memberData } });
                  }}
                  style={{
                    textAlign: 'center',
                    borderRadius: '20px',
                    border: `3px solid ${borderColor}`,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    background: backgroundStyle,
                    cursor: 'pointer'
                  }}
                  bodyStyle={{ padding: '20px' }}
                >
                  <Avatar
                    size={60}
                    src={memberData.images}
                    style={{
                      background: avatarGradient,
                      marginBottom: '12px',
                      fontSize: '24px',
                      border: `2px solid ${borderColor}`,
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
                    color: borderColor,
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
      </>
    );
  }

  // 生成成員的結構化資料
  const personStructuredData = member ? generatePersonStructuredData({
    name: member.memberName,
    nameEn: member.memberNameEn,
    description: member.content,
    image: member.images,
    birthday: member.birthday
  }) : null;

  // 顯示特定成員的詳細資訊
  return (
    <>
      <SEOHead
        title={`${member.memberName} ｜時代少年團`}
        description={seoDescription}
        structuredData={personStructuredData || breadcrumbData}
        image={member.images}
      />
      <div style={pageContainerStyle}>
        <div style={{ marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => {
              // 保存當前滾動位置
              const currentPosition = window.scrollY;
              sessionStorage.setItem('scroll_/member-detail', currentPosition.toString());
              // 標記為返回導航
              sessionStorage.setItem('nav_type_/members', 'back');
              navigate('/members');
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
          <Breadcrumb
            separator="»"
            items={[
              {
                title: (
                  <span style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
                    首頁
                  </span>
                )
              },
              {
                title: (
                  <span style={{ cursor: 'pointer' }} onClick={() => navigate('/members')}>
                    團體成員
                  </span>
                )
              },
              {
                title: member.memberName
              }
            ]}
          />
        </div>

        <Card
          style={{
            borderRadius: '20px',
            border: `3px solid ${(() => {
              const colorConfig = getColorConfig(member.id, member.supportColor);
              return colorConfig.borderColor;
            })()}`,
            boxShadow: 'none',
            background: (() => {
              const colorConfig = getColorConfig(member.id, member.supportColor);
              return generateGradient(colorConfig.gradientColors, '70');
            })()
          }}
          styles={{ body: { padding: '40px' } }}
        >
          <Row gutter={[32, 32]} align="top">
            {/* 左側圖片 - 大螢幕顯示，小螢幕時隱藏 */}
            <Col xs={24} md={8} style={{ textAlign: 'center' }}>
              {(() => {
                const colorConfig = getColorConfig(member.id, member.supportColor);
                const gradientColors = colorConfig.gradientColors;
                const borderColor = colorConfig.borderColor;
                const avatarGradient = generateGradient(gradientColors);

                return imageError || !member.images ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      width: '80%',
                      maxWidth: '300px',
                      aspectRatio: '1',
                      background: avatarGradient,
                      fontSize: '48px',
                      border: `3px solid ${borderColor}`,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                      borderRadius: '8px',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {member.emoji}
                  </div>
                ) : (
                  <img
                    src={member.images}
                    alt={member.memberName}
                    onError={() => setImageError(true)}
                    style={{
                      width: '100%',
                      maxWidth: '100%',
                      height: 'auto',
                      border: `3px solid ${borderColor}`,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                      borderRadius: '8px',
                      display: 'block'
                    }}
                  />
                );
              })()}
            </Col>

            {/* 右側資訊 */}
            <Col xs={24} md={16}>
              <div style={{ textAlign: 'center', marginBottom: '-15px' }}>
                <Title level={1} style={{
                  color: (() => {
                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                    return getDeepSupportColor(baseColor);
                  })(),
                  marginBottom: '8px',
                  fontSize: '36px'
                }}>
                  {member.memberName}
                </Title>
                <Title level={2} style={{
                  color: '#333',
                  marginBottom: '10px',
                  marginTop: '-15px',
                  fontSize: '24px'
                }}>
                  {member.memberNameEn}
                </Title>
                <Space wrap style={{ marginBottom: '20px' }}>
                  <Tag color="gold" icon={<HeartOutlined />}>{member.fanName}</Tag>
                  <Tag color="default" icon={<CalendarOutlined />}>{formatDate(member.birthday)}</Tag>
                  {member.weibo && (
                    <Tag
                      color="red"
                      icon={<BsSinaWeibo style={{ transform: 'translateY(2px)', marginRight: '4px' }} />}
                      style={{ cursor: 'pointer' }}
                      onClick={() => window.open(member.weibo, '_blank')}
                    >
                      @{member.memberNameCn || member.memberName}
                    </Tag>
                  )}
                </Space>
              </div>

              <Divider style={{ borderColor: Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor, margin: '10px 0' }} />

              <div>
                <Title level={3} style={{
                  color: '#333',
                  marginBottom: '6px',
                  textAlign: 'center'
                }}>
                  成員介紹
                </Title>
                <Paragraph style={{
                  fontSize: '14px',
                  lineHeight: '1.8',
                  color: '#666',
                  textAlign: 'left',
                  whiteSpace: 'pre-line'
                }}>
                  {member.content}
                </Paragraph>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 詳細資料區塊 */}
        {detailsLoading ? (
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
        ) : memberDetails && (
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
                  <BsMusicNote style={{
                    color: (() => {
                      const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                      return getDeepSupportColor(baseColor);
                    })(),
                    marginRight: '8px',
                    fontSize: '18px'
                  }} />
                  <Title level={4} style={{
                    margin: '0',
                    color: (() => {
                      const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                      return getDeepSupportColor(baseColor);
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
                                      發行日期: {formatDate(item.releaseDate)}
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
                                      發行日期: {formatDate(item.releaseDate)} | 共 {item.songs ? item.songs.length : 0} 首歌曲
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
                                      發行日期: {formatDate(item.releaseDate)}
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
                      return getDeepSupportColor(baseColor);
                    })(),
                    marginRight: '8px',
                    fontSize: '18px'
                  }} />
                  <Title level={4} style={{
                    margin: '0',
                    color: (() => {
                      const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                      return getDeepSupportColor(baseColor);
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
                                身份：{item.role} | 年份：{item.year}
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

            {/* 影視作品 */}
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
                      return getDeepSupportColor(baseColor);
                    })(),
                    marginRight: '8px',
                    fontSize: '18px'
                  }} />
                  <Title level={4} style={{
                    margin: '0',
                    color: (() => {
                      const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                      return getDeepSupportColor(baseColor);
                    })()
                  }}>
                    影視作品 ({memberDetails.movies.length})
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

            {/* 視頻vlog */}
            {memberDetails.vlogs && memberDetails.vlogs.length > 0 && (() => {
              // 依照系列內「最新影片發布日期」由新到舊排序系列
              const parseDate = (value) => {
                if (!value) return 0;
                const time = new Date(value).getTime();
                return Number.isNaN(time) ? 0 : time;
              };

              const getSeriesLatestTime = (series) => {
                if (!series.videos || series.videos.length === 0) return 0;
                return Math.max(
                  ...series.videos.map(video => parseDate(video.publishDate))
                );
              };

              const sortedVlogs = [...memberDetails.vlogs].sort(
                (a, b) => getSeriesLatestTime(b) - getSeriesLatestTime(a)
              );

              return (
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
                      marginBottom: expandedSections.vlogs ? '16px' : '0'
                    }}
                    onClick={() => toggleSection('vlogs')}
                  >
                    <PlayCircleOutlined style={{
                      color: (() => {
                        const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                        return getDeepSupportColor(baseColor);
                      })(),
                      marginRight: '8px',
                      fontSize: '18px'
                    }} />
                    <Title level={4} style={{
                      margin: '0',
                      color: (() => {
                        const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                        return getDeepSupportColor(baseColor);
                      })()
                    }}>
                      {member.vlogTitle || '視頻vlog'} ({memberDetails.vlogs.length})
                    </Title>
                    {expandedSections.vlogs ? <DownOutlined /> : <RightOutlined />}
                  </div>

                  {expandedSections.vlogs && (
                    <div>
                      {sortedVlogs.map((series) => {
                        // 每個系列中的影片依「發布日期」由新到舊排序
                        const sortedVideos = Array.isArray(series.videos)
                          ? [...series.videos].sort(
                            (a, b) => parseDate(b.publishDate) - parseDate(a.publishDate)
                          )
                          : [];

                        return (
                          <Card
                            key={series.seriesId}
                            style={{
                              marginBottom: '12px',
                              borderRadius: '8px',
                              border: `1px solid ${Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor}15`,
                              backgroundColor: '#fafafa'
                            }}
                            styles={{ body: { padding: '16px' } }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                                marginBottom: expandedSeries[series.seriesId] ? '12px' : '0'
                              }}
                              onClick={() => toggleSeries(series.seriesId)}
                            >
                              <Title level={5} style={{
                                margin: '0',
                                color: (() => {
                                  const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                                  const colorMap = {
                                    '#EAF2FF': '#5A4F8C',
                                    '#FFD700': '#8B6914',
                                    '#63C5DE': '#2E7A8F',
                                    '#D1D1D1': '#666666',
                                    '#C0EBD7': '#1E7A4F',
                                    '#FF7F50': '#990000',
                                    '#ADD5A2': '#5A8A4F'
                                  };
                                  return colorMap[baseColor] || '#333';
                                })()
                              }}>
                                {series.seriesName} ({series.videos.length})
                              </Title>
                              {expandedSeries[series.seriesId] ? <DownOutlined style={{ marginLeft: '8px' }} /> : <RightOutlined style={{ marginLeft: '8px' }} />}
                            </div>

                            {expandedSeries[series.seriesId] && (
                              <div>
                                {series.description && (
                                  <Text style={{ color: '#666', fontSize: '13px', display: 'block', marginBottom: '12px' }}>
                                    {renderRichText(series.description)}
                                  </Text>
                                )}
                                <List
                                  dataSource={sortedVideos}
                                  renderItem={(video) => (
                                    <List.Item style={{ padding: '8px 0' }}>
                                      <div style={{ width: '100%' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                          <div style={{ flex: 1 }}>
                                            <Text strong style={{ fontSize: '15px' }}>{video.title}</Text>
                                            <br />
                                            <Text style={{ color: '#666', fontSize: '13px' }}>
                                              發布日期: {video.publishDate}
                                            </Text>
                                          </div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {video.videoUrl && (
                                              <Button
                                                type="primary"
                                                size="small"
                                                icon={<PlayCircleOutlined />}
                                                onClick={() => window.open(video.videoUrl, '_blank')}
                                                style={{
                                                  backgroundColor: (() => {
                                                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                                                    const colorMap = {
                                                      '#EAF2FF': '#CCA3CC',
                                                      '#FFD700': '#FFBF00',
                                                      '#63C5DE': '#61B0E2',
                                                      '#D1D1D1': '#A9A9A9',
                                                      '#C0EBD7': '#549688',
                                                      '#FF7F50': '#B22222',
                                                      '#ADD5A2': '#16982B'
                                                    };
                                                    return colorMap[baseColor] || '#333';
                                                  })(),
                                                  borderColor: (() => {
                                                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                                                    const colorMap = {
                                                      '#EAF2FF': '#CCA3CC',
                                                      '#FFD700': '#FFBF00',
                                                      '#63C5DE': '#61B0E2',
                                                      '#D1D1D1': '#A9A9A9',
                                                      '#C0EBD7': '#549688',
                                                      '#FF7F50': '#B22222',
                                                      '#ADD5A2': '#16982B'
                                                    };
                                                    return colorMap[baseColor] || '#333';
                                                  })(),
                                                  borderRadius: '20px',
                                                  height: '28px',
                                                  fontSize: '12px',
                                                  fontWeight: 'bold',
                                                  padding: '0 12px',
                                                  flexShrink: 0,
                                                  color: '#fff'
                                                }}
                                              >
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
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })()}

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
                      return getDeepSupportColor(baseColor);
                    })(),
                    marginRight: '8px',
                    fontSize: '18px'
                  }} />
                  <Title level={4} style={{
                    margin: '0',
                    color: (() => {
                      const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                      return getDeepSupportColor(baseColor);
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
    </>
  );
};

export default MemberDetail;
