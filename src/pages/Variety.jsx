import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Avatar, Tag, Space, Divider, Button, Collapse } from 'antd';
import { CalendarOutlined, PlayCircleOutlined, UserOutlined, FireOutlined, VideoCameraOutlined, DownOutlined, RightOutlined, RocketOutlined, ThunderboltOutlined, SmileOutlined, CustomerServiceOutlined, QqOutlined, BilibiliOutlined, YoutubeOutlined, WeiboOutlined, GiftOutlined } from '@ant-design/icons';
import { selfMadeVariety, documentaryRecord, birthdayRecord, externalVariety, performanceVariety, tfFamilyPeriodVariety, tytPeriodVariety } from '../data/varietyData';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const Variety = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    selfMade: true,
    documentary: true,
    birthday: true,
    external: true,
    performance: true,
    tfFamilyPeriod: true,
    typhoonPeriod: true
  });

  // 生日紀錄依年份分組（年份由新到舊）
  const birthdayByYear = useMemo(() => {
    const groups = {};
    birthdayRecord.forEach(item => {
      const year = String(item.year).slice(0, 4);
      if (!groups[year]) groups[year] = [];
      groups[year].push(item);
    });
    return Object.fromEntries(
      Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
    );
  }, [birthdayRecord]);

  // 每年對應顯示的 title2（若無，退回第一筆的 title 或空字串）
  const birthdayTitle2ByYear = useMemo(() => {
    const map = {};
    Object.entries(birthdayByYear).forEach(([year, items]) => {
      map[year] = items[0]?.title2 || items[0]?.title || '';
    });
    return map;
  }, [birthdayByYear]);

  // 每個年份展開狀態（預設全部展開）
  const [expandedBirthdayYears, setExpandedBirthdayYears] = useState(() => {
    const initial = {};
    Object.keys(birthdayByYear).forEach(y => { initial[y] = true; });
    return initial;
  });

  const toggleBirthdayYear = (year) => {
    setExpandedBirthdayYears(prev => ({ ...prev, [year]: !prev[year] }));
  };

  // 分類綜藝節目（直接使用資料檔已分好之陣列）

  const handleVarietyClick = (variety) => {
    // 導航到綜藝節目詳細頁面
    navigate('/variety-detail', { state: { variety } });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 滾動到指定區塊並展開
  const scrollToSection = (sectionKey) => {
    // 先展開對應區塊
    if (!expandedSections[sectionKey]) {
      setExpandedSections(prev => ({
        ...prev,
        [sectionKey]: true
      }));
    }

    // 延遲滾動，確保區塊已展開
    setTimeout(() => {
      const element = document.getElementById(`section-${sectionKey}`);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  const renderVarietyCard = (item, sectionKey) => {
    const backgroundColor = `linear-gradient(135deg, ${item.color}20 0%, ${item.color}60 100%)`;

    return (
      <Card
        key={item.id}
        hoverable
        style={{
          borderRadius: '20px',
          border: `3px solid ${item.color}`,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          background: backgroundColor
        }}
        styles={{ body: { padding: '20px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* 左側圖片 */}
          <Avatar
            size={80}
            src={item.coverImage}
            style={{
              backgroundColor: item.color,
              fontSize: '32px',
              border: `3px solid ${item.color}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              flexShrink: 0
            }}
          >
            {item.emoji}
          </Avatar>

          {/* 右側資訊 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Space direction="vertical" size="small" style={{ flex: 1 }}>
                {/* 節目名稱 */}
                <Title level={3} style={{
                  color: '#333',
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  {item.title}
                </Title>

                {/* 播出年份 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarOutlined style={{ color: item.color, marginRight: '8px' }} />
                  <Text strong style={{ color: '#666' }}>{item.year}</Text>
                </div>

                {/* 參與成員（紀錄片不顯示） */}
                {sectionKey !== 'documentary' && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UserOutlined style={{ color: item.color, marginRight: '8px' }} />
                    <Text style={{ color: '#666' }}>{item.participants}</Text>
                  </div>
                )}

                {/* 集數 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <VideoCameraOutlined style={{ color: item.color, marginRight: '8px' }} />
                  <Text style={{ color: '#666' }}>{item.episodes}</Text>
                </div>

                {/* 分類標籤和播放按鈕 */}
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                  <Tag color={item.color}>
                    {item.category}
                  </Tag>
                  {item.videoUrl && (
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.videoUrl, '_blank');
                      }}
                      style={{
                        backgroundColor: item.color,
                        borderColor: item.color,
                        borderRadius: '20px',
                        height: '28px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '0 12px'
                      }}
                    >
                      觀看影片
                    </Button>
                  )}
                </div>

                {/* 描述 */}
                <div style={{ marginTop: '8px' }}>
                  <Text style={{ color: '#666', fontSize: '12px', display: 'block' }}>
                    {item.description}
                  </Text>
                </div>
              </Space>

            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderBirthdayCard = (item, sectionKey) => {
    const backgroundColor = `linear-gradient(135deg, ${item.color}20 0%, ${item.color}60 100%)`;

    return (
      <Card
        key={item.id}
        hoverable
        style={{
          borderRadius: '20px',
          border: `3px solid ${item.color}`,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          background: backgroundColor
        }}
        styles={{ body: { padding: '20px' } }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Avatar
            size={80}
            src={item.coverImage}
            style={{
              backgroundColor: item.color,
              fontSize: '32px',
              border: `3px solid ${item.color}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              flexShrink: 0
            }}
          >
            {item.emoji}
          </Avatar>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Space direction="vertical" size="small" style={{ flex: 1 }}>
                <Title level={3} style={{
                  color: '#333',
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  {item.title}
                </Title>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarOutlined style={{ color: item.color, marginRight: '8px' }} />
                  <Text strong style={{ color: '#666' }}>{item.year}</Text>
                </div>

                {sectionKey !== 'documentary' && (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <UserOutlined style={{ color: item.color, marginRight: '8px' }} />
                    <Text style={{ color: '#666' }}>{item.participants}</Text>
                  </div>
                )}

                {/* 並排的兩個播放按鈕，文字不同 */}
                <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {item.videoUrl && (
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.videoUrl, '_blank');
                      }}
                      style={{
                        backgroundColor: item.color,
                        borderColor: item.color,
                        borderRadius: '20px',
                        height: '28px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '0 12px'
                      }}
                    >
                      {item.videoLabel1 || '生日紀錄'}
                    </Button>
                  )}
                  {item.videoUrl2 && (
                    <Button
                      type="default"
                      icon={<PlayCircleOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(item.videoUrl2, '_blank');
                      }}
                      style={{
                        borderRadius: '20px',
                        height: '28px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        padding: '0 12px'
                      }}
                    >
                      {item.videoLabel2 || '生日直播(bili大會員)'}
                    </Button>
                  )}
                </div>

                <div style={{ marginTop: '8px' }}>
                  <Text style={{ color: '#666', fontSize: '12px', display: 'block' }}>
                    {item.description}
                  </Text>
                </div>
              </Space>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  const renderVarietySection = (title, data, icon, color, sectionKey) => {
    if (data.length === 0) return null;

    return (
      <div id={`section-${sectionKey}`} style={{ marginBottom: '40px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            cursor: 'pointer'
          }}
          onClick={() => toggleSection(sectionKey)}
        >
          {icon}
          <Title level={3} style={{ color: color, margin: 0, marginLeft: '12px', fontSize: '20px' }}>
            {title} ({data.length})
          </Title>
          {expandedSections[sectionKey] ?
            <DownOutlined style={{ color: color, marginLeft: '8px' }} /> :
            <RightOutlined style={{ color: color, marginLeft: '8px' }} />
          }
        </div>

        {expandedSections[sectionKey] && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '20px'
          }}>
            {data.map((item) => renderVarietyCard(item, sectionKey))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1} style={{
          color: '#EBC700',
          marginBottom: '8px',
          fontSize: '36px'
        }}>
          綜藝節目
        </Title>
        <Space wrap>
          <Tag
            color="purple"
            icon={<FireOutlined />}
            style={{ cursor: 'pointer' }}
            onClick={() => scrollToSection('selfMade')}
          >
            自製團綜
          </Tag>
          <Tag
            color="green"
            icon={<VideoCameraOutlined />}
            style={{ cursor: 'pointer' }}
            onClick={() => scrollToSection('documentary')}
          >
            紀錄片
          </Tag>
          <Tag
            color="pink"
            icon={<GiftOutlined />}
            style={{ cursor: 'pointer' }}
            onClick={() => scrollToSection('birthday')}
          >
            生日紀錄
          </Tag>
          <Tag
            color="blue"
            icon={<SmileOutlined />}
            style={{ cursor: 'pointer' }}
            onClick={() => scrollToSection('external')}
          >
            外務綜藝
          </Tag>
          <Tag
            color="red"
            icon={<CustomerServiceOutlined />}
            style={{ cursor: 'pointer' }}
            onClick={() => scrollToSection('performance')}
          >
            表演舞台
          </Tag>
          <Tag
            color="orange"
            icon={<RocketOutlined />}
            style={{ cursor: 'pointer' }}
            onClick={() => scrollToSection('tfFamilyPeriod')}
          >
            TF家族
          </Tag>
          <Tag
            color="default"
            icon={<ThunderboltOutlined />}
            style={{ cursor: 'pointer' }}
            onClick={() => scrollToSection('typhoonPeriod')}
          >
            台風少年團
          </Tag>
        </Space>
      </div>

      {/* 自製團綜區塊 */}
      {renderVarietySection(
        '自製團綜',
        selfMadeVariety,
        <FireOutlined style={{ fontSize: '24px', color: 'purple' }} />,
        'purple',
        'selfMade'
      )}

      {/* 紀錄片區塊 */}
      {renderVarietySection(
        '紀錄片',
        documentaryRecord,
        <VideoCameraOutlined style={{ fontSize: '24px', color: 'green' }} />,
        'green',
        'documentary'
      )}

      {/* 生日紀錄區塊（依年份展開/收合） */}
      <div id="section-birthday" style={{ marginBottom: '40px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px',
            cursor: 'pointer'
          }}
          onClick={() => toggleSection('birthday')}
        >
          <GiftOutlined style={{ fontSize: '24px', color: '#FF0080' }} />
          <Title level={3} style={{ color: '#FF0080', margin: 0, marginLeft: '12px', fontSize: '20px' }}>
            生日紀錄 ({birthdayRecord.length})
          </Title>
          {expandedSections['birthday'] ?
            <DownOutlined style={{ color: '#FF0080', marginLeft: '8px' }} /> :
            <RightOutlined style={{ color: '#FF0080', marginLeft: '8px' }} />
          }
        </div>

        {expandedSections['birthday'] && (
          <div>
            {Object.keys(birthdayByYear).map((year) => (
              <div key={year} style={{ marginBottom: '20px' }}>
                <div
                  style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}
                  onClick={() => toggleBirthdayYear(year)}
                >
                  <Title level={4} style={{ color: '#FF0080', margin: 0, fontSize: '18px' }}>
                    {birthdayTitle2ByYear[year] || `生日紀錄 (${birthdayByYear[year].length})`}
                  </Title>
                  {expandedBirthdayYears[year] ?
                    <DownOutlined style={{ color: '#FF0080', marginLeft: '8px' }} /> :
                    <RightOutlined style={{ color: '#FF0080', marginLeft: '8px' }} />
                  }
                </div>

                {expandedBirthdayYears[year] && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '20px'
                  }}>
                    {birthdayByYear[year].map((item) => renderBirthdayCard(item, 'birthday'))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 外務綜藝區塊 */}
      {renderVarietySection(
        '外務綜藝',
        externalVariety,
        <SmileOutlined style={{ fontSize: '24px', color: 'navy' }} />,
        'navy',
        'external'
      )}

      {/* 表演舞台區塊 */}
      {renderVarietySection(
        '表演舞台',
        performanceVariety,
        <CustomerServiceOutlined style={{ fontSize: '24px', color: 'red' }} />,
        'red',
        'performance'
      )}

      {/* 練習生時期區塊 */}
      {renderVarietySection(
        'TF家族',
        tfFamilyPeriodVariety,
        <RocketOutlined style={{ fontSize: '24px', color: '#FFA500' }} />,
        '#FFA500',
        'tfFamilyPeriod'
      )}

      {/* 台風少年時期區塊 */}
      {renderVarietySection(
        '台風少年團',
        tytPeriodVariety,
        <ThunderboltOutlined style={{ fontSize: '24px', color: '#848D94' }} />,
        '#848D94',
        'typhoonPeriod'
      )}
    </div>
  );
};

export default Variety;
