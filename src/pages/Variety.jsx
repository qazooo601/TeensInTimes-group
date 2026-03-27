import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Avatar, Tag, Space, Divider, Button, Collapse, Spin, message } from 'antd';
import { CalendarOutlined, PlayCircleOutlined, UserOutlined, FireOutlined, VideoCameraOutlined, DownOutlined, UpOutlined, RightOutlined, RocketOutlined, ThunderboltOutlined, SmileOutlined, CustomerServiceOutlined, QqOutlined, BilibiliOutlined, YoutubeOutlined, WeiboOutlined, GiftOutlined } from '@ant-design/icons';
import { selfMadeVariety, documentaryRecord, birthdayRecord, externalVariety, performanceVariety, tfFamilyPeriodVariety, tytPeriodVariety } from '../data/variety';
import { usePageTitle } from '../hooks/usePageTitle';
import { dbService } from '../services/database';
import SEOHead from '../components/SEO/SEOHead';
import { generateBreadcrumbStructuredData } from '../utils/structuredData';

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

  // 控制右下快速導覽顯示時機（與全站 TOP 按鈕一致）
  const [showQuickNav, setShowQuickNav] = useState(false);

  // 控制每個描述的展開/收起狀態
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  // 追蹤哪些描述需要展開（內容超過限制行數）
  const [needsExpand, setNeedsExpand] = useState({});

  // 資料庫資料狀態
  const [varietyData, setVarietyData] = useState({
    selfMade: [],
    documentary: [],
    birthday: [],
    external: [],
    performance: [],
    tfFamilyPeriod: [],
    typhoonPeriod: []
  });
  const [loading, setLoading] = useState(true);
  const [seoDescription, setSeoDescription] = useState('時代少年團綜藝節目：自製團綜、紀錄片、生日紀錄、外務綜藝、活動表演等完整列表。包含播出日期、參與成員、集數等詳細資料。');

  // 將日期字串格式化為本地時區的 YYYY-MM-DD，避免少一天
  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return String(value).slice(0, 10);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 判斷是否為「一個月內更新」的節目，用於顯示 NEW 標籤
  const isNewVariety = (item) => {
    const value = item?.updatedDate || item?.date || item?.airDate || item?.year;
    if (!value) return false;
    const updated = new Date(value);
    if (Number.isNaN(updated.getTime())) return false;

    const now = new Date();
    const diffMs = now - updated;
    const oneMonthMs = 30 * 24 * 60 * 60 * 1000; // 約略 1 個月
    return diffMs >= 0 && diffMs <= oneMonthMs;
  };

  // 簡單文字標記轉換：支援 **粗體** 與 [[color:文字]] 顏色標記
  // 與 MemberDetail.jsx 保持一致（可顯示多種顏色）
  const COLOR_TAGS = {
    red: ' #D60000',
    green: ' #88AA00',
    blue: ' #2A52BE',
    gold: ' #D6B600',
    brown: ' #D2691E',
    orange: ' #E67E22',
    purple: ' #986FB3',
    pink: ' #D87DAC'
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

  // 從資料庫載入綜藝節目資料
  useEffect(() => {
    const loadVarietyData = async () => {
      setLoading(true);
      try {
        const allVariety = await dbService.getVariety();

        console.log('載入的綜藝節目資料總數:', allVariety.length);
        console.log('資料範例:', allVariety[0]);

        // 輔助函數：從 id 或 tableName 中提取表名
        const getTableName = (item) => {
          if (item.tableName) return item.tableName;
          // 從 id 格式 "variety_${tableName}_${id}" 中提取表名
          if (item.id && item.id.startsWith('variety_')) {
            const parts = item.id.split('_');
            if (parts.length >= 2) {
              return parts[1]; // 第二個部分是表名
            }
          }
          return null;
        };

        // 根據表名分類資料
        const categorized = {
          // 自製團綜：直接從 SelfMadeVariety 表獲取，按日期由新到舊排序
          selfMade: allVariety
            .filter(item => {
              const tableName = getTableName(item);
              return tableName === 'SelfMadeVariety';
            })
            .sort((a, b) => {
              const dateA = a.date || a.airDate || '';
              const dateB = b.date || b.airDate || '';
              return dateB.localeCompare(dateA); // 由新到舊
            }),
          documentary: allVariety
            .filter(item => getTableName(item) === 'DocumentaryRecord')
            .sort((a, b) => {
              const dateA = a.date || a.airDate || '';
              const dateB = b.date || b.airDate || '';
              return dateB.localeCompare(dateA); // 由新到舊
            }),
          birthday: allVariety.filter(item => getTableName(item) === 'BirthdayRecord'),
          external: allVariety
            .filter(item => getTableName(item) === 'ExternalVariety')
            .sort((a, b) => {
              const dateA = a.date || a.airDate || '';
              const dateB = b.date || b.airDate || '';
              return dateB.localeCompare(dateA); // 由新到舊
            }),
          performance: allVariety
            .filter(item => getTableName(item) === 'PerformanceVariety')
            .sort((a, b) => {
              const dateA = a.date || a.airDate || '';
              const dateB = b.date || b.airDate || '';
              return dateB.localeCompare(dateA); // 由新到舊
            }),
          tfFamilyPeriod: allVariety
            .filter(item => getTableName(item) === 'TfFamilyPeriodVariety')
            .sort((a, b) => {
              const dateA = a.date || a.airDate || '';
              const dateB = b.date || b.airDate || '';
              return dateB.localeCompare(dateA); // 由新到舊
            }),
          typhoonPeriod: allVariety.filter(item => getTableName(item) === 'TytPeriodVariety')
        };

        console.log('分類後的資料:', {
          selfMade: categorized.selfMade.length,
          documentary: categorized.documentary.length,
          birthday: categorized.birthday.length,
          external: categorized.external.length,
          performance: categorized.performance.length,
          tfFamilyPeriod: categorized.tfFamilyPeriod.length,
          typhoonPeriod: categorized.typhoonPeriod.length
        });

        setVarietyData(categorized);

        // 根據最新資料生成 SEO description
        const totalCount = Object.values(categorized).reduce((sum, arr) => sum + arr.length, 0);
        if (totalCount > 0) {
          // 取得最新的 5 筆資料（從自製團綜開始）
          const latestItems = [
            ...categorized.selfMade.slice(0, 3),
            ...categorized.documentary.slice(0, 2)
          ].filter(Boolean);
          const latestTitles = latestItems.map(item => item.title).filter(Boolean);

          if (latestTitles.length > 0) {
            const latestText = latestTitles.join('、');
            const description = `時代少年團最新綜藝節目：${latestText}。完整自製團綜、紀錄片、生日紀錄、外務綜藝、活動表演列表，包含播出日期、參與成員、集數等詳細資料。`;
            setSeoDescription(description);
          } else {
            const description = `時代少年團綜藝節目完整列表，共 ${totalCount} 個節目。包含自製團綜、紀錄片、生日紀錄、外務綜藝、活動表演等，提供播出日期、參與成員、集數等詳細資料。`;
            setSeoDescription(description);
          }
        }
      } catch (error) {
        console.error('從資料庫載入綜藝節目資料失敗:', error);
        // 如果載入失敗，使用本地資料作為後備
        setVarietyData({
          selfMade: selfMadeVariety,
          documentary: documentaryRecord,
          birthday: birthdayRecord,
          external: externalVariety,
          performance: performanceVariety,
          tfFamilyPeriod: tfFamilyPeriodVariety,
          typhoonPeriod: tytPeriodVariety
        });

        const errorMsg = error.response
          ? `API 錯誤 (${error.response.status}): ${error.response.data?.error || error.message}`
          : error.code === 'ERR_NETWORK'
          ? '無法連接到後端 API 服務，已使用本地資料'
          : `無法連接到資料庫，已使用本地資料: ${error.message}`;

        message.warning(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadVarietyData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowQuickNav(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  usePageTitle('綜藝節目｜時代少年團');

  // 生成麵包屑結構化資料
  const breadcrumbData = generateBreadcrumbStructuredData([
    { name: '首頁', url: '/' },
    { name: '綜藝節目', url: '/variety' }
  ]);

  // 生日紀錄依 Category 和 Title2 分組
  const birthdayByCategoryAndTitle2 = useMemo(() => {
    const categoryGroups = {};

    varietyData.birthday.forEach(item => {
      // 先按 Category 分組（如果 Category 為空，使用預設值）
      const category = item.category || '生日紀錄';

      if (!categoryGroups[category]) {
        categoryGroups[category] = {};
      }

      // 在每個 Category 下，按 Title2 分組
      const title2 = item.title2 || '其他';

      if (!categoryGroups[category][title2]) {
        categoryGroups[category][title2] = [];
      }

      categoryGroups[category][title2].push(item);
    });

    // 對每個 Category 下的 Title2 組進行排序
    Object.keys(categoryGroups).forEach(category => {
      const title2Groups = categoryGroups[category];
      // 按照 Title2 的第一個項目的日期排序（由舊到新）
      Object.keys(title2Groups).forEach(title2 => {
        title2Groups[title2].sort((a, b) => {
          const dateA = a.date || a.airDate || '';
          const dateB = b.date || b.airDate || '';
          return dateA.localeCompare(dateB);
        });
      });
    });

    return categoryGroups;
  }, [varietyData.birthday]);

  // 每個 Category 和 Title2 的展開狀態（預設全部展開）
  const [expandedBirthdayGroups, setExpandedBirthdayGroups] = useState(() => {
    const initial = {};
    Object.keys(birthdayByCategoryAndTitle2).forEach(category => {
      initial[category] = {};
      Object.keys(birthdayByCategoryAndTitle2[category]).forEach(title2 => {
        initial[category][title2] = true;
      });
    });
    return initial;
  });

  const toggleBirthdayGroup = (category, title2) => {
    setExpandedBirthdayGroups(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [title2]: !prev[category]?.[title2]
      }
    }));
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
    // 如果區塊已經展開，立即滾動
    if (expandedSections[sectionKey]) {
      const element = document.getElementById(`section-${sectionKey}`);
      if (element) {
        // 使用 requestAnimationFrame 確保在下一幀執行，避免阻塞
        requestAnimationFrame(() => {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        });
      }
      return;
    }

    // 如果區塊需要展開，先展開再滾動
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: true
    }));

    // 等待 React 完成渲染後再滾動
    // 使用雙重 requestAnimationFrame 確保 DOM 已完全更新
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 再次檢查元素是否存在，並確認其高度已更新
        const element = document.getElementById(`section-${sectionKey}`);
        if (element) {
          // 使用 scrollIntoView 滾動
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  const renderVarietyCard = (item, sectionKey) => {
    const backgroundColor = `linear-gradient(135deg, ${item.color}20 0%, ${item.color}60 100%)`;

    // 檢查描述是否需要展開的回調 ref
    const checkIfNeedsExpand = (element) => {
      if (element) {
        // 使用 setTimeout 確保 DOM 已渲染並應用樣式
        setTimeout(() => {
          if (element && !expandedDescriptions[item.id]) {
            // 只在收起狀態時檢查是否需要展開
            const isOverflowing = element.scrollHeight > element.clientHeight;
            if (isOverflowing) {
              setNeedsExpand(prev => ({
                ...prev,
                [item.id]: true
              }));
            }
          }
        }, 100);
      }
    };

    return (
      <Card
        key={item.id}
        hoverable
        style={{
          borderRadius: '20px',
          border: `3px solid ${item.color}`,
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          background: backgroundColor,
          maxWidth: '92%',     // 防止在極小螢幕的手機上超出範圍
        }}
        styles={{ body: { padding: '20px' } }}
      >
        {/* 上方：左側圖片 + 右側資訊 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
          {/* 左側圖片（performance 區塊不顯示） */}
          {sectionKey !== 'performance' && (
            <Avatar
              size={80}
              src={item.coverImage || null}
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
          )}

          {/* 右側資訊 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {/* 節目名稱 */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '8px' }}>
                <Title level={3} style={{
                  color: '#333',
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 'bold',
                  flex: 1
                }}>
                  {item.title}
                </Title>
                {isNewVariety(item) && (
                  <Tag
                    color="yellow"
                    icon={<FireOutlined />}
                    style={{
                      fontSize: '12px',
                      padding: '0 6px',
                      lineHeight: '20px',
                      margin: 0,
                      flexShrink: 0
                    }}
                  >
                    NEW
                  </Tag>
                )}
              </div>

              {/* 播出日期（後端已是字串，直接顯示） */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CalendarOutlined style={{ color: item.color, marginRight: '8px' }} />
                <Text strong style={{ color: '#666' }}>
                  {item.date || item.airDate || item.year}
                </Text>
              </div>

              {/* 參與成員（紀錄片不顯示） */}
              {sectionKey !== 'documentary' && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <UserOutlined style={{ color: item.color, marginRight: '8px' }} />
                  <Text style={{ color: '#666' }}>{item.participants}</Text>
                </div>
              )}

              {/* 集數（performance 區塊不顯示） */}
              {sectionKey !== 'performance' && (
                <div style={{ display: 'flex', alignItems: 'center', whiteSpace: 'pre-line' }}>
                  <VideoCameraOutlined style={{ color: item.color, marginRight: '8px' }} />
                  <Text style={{ color: '#666' }}>{item.episodes}</Text>
                </div>
              )}
            </Space>
          </div>
        </div>

        {/* 下方簡介 */}
        <div style={{ borderTop: `1px solid ${item.color}30`, paddingTop: '8px' }}>
          {/* 分類標籤和播放按鈕 */}
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
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
          <div
            style={{
              cursor: needsExpand[item.id] ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px'
            }}
            onClick={(e) => {
              if (needsExpand[item.id]) {
                e.stopPropagation();
                setExpandedDescriptions(prev => ({
                  ...prev,
                  [item.id]: !prev[item.id]
                }));
              }
            }}
          >
            <Text
              ref={checkIfNeedsExpand}
              className={expandedDescriptions[item.id] ? '' : 'variety-description-clamp'}
              style={{
                color: '#666',
                fontSize: '12px',
                whiteSpace: 'pre-line',
                flex: 1,
                ...(expandedDescriptions[item.id] ? {
                  display: 'block'
                } : {
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                })
              }}
            >
              {renderRichText(item.description)}
            </Text>
            {needsExpand[item.id] && (
              <div style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                color: item.color,
                marginTop: '2px'
              }}>
                {expandedDescriptions[item.id] ? (
                  <UpOutlined style={{ fontSize: '12px' }} />
                ) : (
                  <DownOutlined style={{ fontSize: '12px' }} />
                )}
              </div>
            )}
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
          background: backgroundColor,
          maxWidth: '92%',     // 防止在極小螢幕的手機上超出範圍
        }}
        styles={{ body: { padding: '20px' } }}
      >
        {/* 上方：左側圖片 + 右側資訊 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '8px' }}>
          {/* 左側圖片 */}
          <Avatar
            size={80}
            src={item.coverImage || null}
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
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              {/* 節目名稱 */}
              <Title level={3} style={{
                color: '#333',
                margin: 0,
                fontSize: '20px',
                fontWeight: 'bold'
              }}>
                {item.title}
              </Title>

              {/* 播出日期 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CalendarOutlined style={{ color: item.color, marginRight: '8px' }} />
                <Text strong style={{ color: '#666' }}>
                  {formatDate(item.date || item.airDate || item.year)}
                </Text>
              </div>

              {/* 參與成員（紀錄片不顯示） */}
              {sectionKey !== 'documentary' && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <UserOutlined style={{ color: item.color, marginRight: '8px' }} />
                  <Text style={{ color: '#666' }}>{item.participants}</Text>
                </div>
              )}
            </Space>
          </div>
        </div>

        {/* 下方簡介 */}
        <div style={{ borderTop: `1px solid ${item.color}30`, paddingTop: '8px' }}>
          {/* 並排的兩個播放按鈕，文字不同 */}
          <div style={{ marginBottom: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                {item.videoLabel1}
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
                {item.videoLabel2}
              </Button>
            )}
            {item.videoUrl3 && (
              <Button
                type="default"
                icon={<PlayCircleOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(item.videoUrl3, '_blank');
                }}
                style={{
                  borderRadius: '20px',
                  height: '28px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  padding: '0 12px'
                }}
              >
                {item.videoLabel3}
              </Button>
            )}
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
    <>
      <SEOHead
        title="綜藝節目｜時代少年團"
        description={seoDescription}
        structuredData={breadcrumbData}
      />
      <div style={{ padding: '24px', position: 'relative' }}>
      <style>{`
        .variety-description-clamp {
          -webkit-line-clamp: 2;
          line-clamp: 2;
        }
        @media (max-width: 767px) {
          .variety-description-clamp {
            -webkit-line-clamp: 3;
            line-clamp: 3;
          }
        }
      `}</style>
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
            活動/表演
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
        varietyData.selfMade,
        <FireOutlined style={{ fontSize: '24px', color: 'purple' }} />,
        'purple',
        'selfMade'
      )}

      {/* 紀錄片區塊 */}
      {renderVarietySection(
        '紀錄片',
        varietyData.documentary,
        <VideoCameraOutlined style={{ fontSize: '24px', color: 'green' }} />,
        'green',
        'documentary'
      )}

      {/* 生日紀錄區塊（依 Category 和 Title2 展開/收合） */}
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
            生日紀錄 ({varietyData.birthday.length})
          </Title>
          {expandedSections['birthday'] ?
            <DownOutlined style={{ color: '#FF0080', marginLeft: '8px' }} /> :
            <RightOutlined style={{ color: '#FF0080', marginLeft: '8px' }} />
          }
        </div>

        {expandedSections['birthday'] && (
          <div>
            {Object.keys(birthdayByCategoryAndTitle2).map((category) => (
              <div key={category} style={{ marginBottom: '30px' }}>
                {/* Category 標題（如果有多個 Category 才顯示） */}
                {Object.keys(birthdayByCategoryAndTitle2).length > 1 && (
                  <Title level={4} style={{ color: '#FF0080', margin: '0 0 12px 0', fontSize: '18px', fontWeight: 'bold' }}>
                    {category}
                  </Title>
                )}

                {/* 每個 Title2 組（按第一個項目的日期排序，由新到舊） */}
                {Object.keys(birthdayByCategoryAndTitle2[category])
                  .sort((title2A, title2B) => {
                    const itemsA = birthdayByCategoryAndTitle2[category][title2A];
                    const itemsB = birthdayByCategoryAndTitle2[category][title2B];
                    const dateA = itemsA[0]?.date || itemsA[0]?.airDate || '';
                    const dateB = itemsB[0]?.date || itemsB[0]?.airDate || '';
                    return dateB.localeCompare(dateA);
                  })
                  .map((title2) => {
                  const items = birthdayByCategoryAndTitle2[category][title2];
                  const isExpanded = expandedBirthdayGroups[category]?.[title2] ?? true;

                  return (
                    <div key={`${category}-${title2}`} style={{ marginBottom: '20px', marginLeft: Object.keys(birthdayByCategoryAndTitle2).length > 1 ? '20px' : '0' }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '12px' }}
                        onClick={() => toggleBirthdayGroup(category, title2)}
                      >
                        <Title level={5} style={{ color: '#FF0080', margin: 0, fontSize: '16px' }}>
                          {title2} ({items.length})
                        </Title>
                        {isExpanded ?
                          <DownOutlined style={{ color: '#FF0080', marginLeft: '8px' }} /> :
                          <RightOutlined style={{ color: '#FF0080', marginLeft: '8px' }} />
                        }
                      </div>

                      {isExpanded && (
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                          gap: '20px'
                        }}>
                          {items.map((item) => renderBirthdayCard(item, 'birthday'))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 外務綜藝區塊 */}
      {renderVarietySection(
        '外務綜藝',
        varietyData.external,
        <SmileOutlined style={{ fontSize: '24px', color: 'navy' }} />,
        'navy',
        'external'
      )}

      {/* 表演舞台區塊 */}
      {renderVarietySection(
        '活動/表演',
        varietyData.performance,
        <CustomerServiceOutlined style={{ fontSize: '24px', color: 'red' }} />,
        'red',
        'performance'
      )}

      {/* 練習生時期區塊 */}
      {renderVarietySection(
        'TF家族',
        varietyData.tfFamilyPeriod,
        <RocketOutlined style={{ fontSize: '24px', color: '#FFA500' }} />,
        '#FFA500',
        'tfFamilyPeriod'
      )}

      {/* 台風少年時期區塊 */}
      {renderVarietySection(
        '台風少年團',
        varietyData.typhoonPeriod,
        <ThunderboltOutlined style={{ fontSize: '24px', color: '#848D94' }} />,
        '#848D94',
        'typhoonPeriod'
      )}

      {/* 右下角快速導向頁籤（顯示在 TOP 按鈕之上，出現時機與 TOP 一致） */}
      {showQuickNav && (
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: 155, // 高於全站的 TOP 按鈕（bottom: 96），且盡量少遮到 Card
            zIndex: 1150,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            borderRadius: 0,
            padding: 0,
            width: 35,          // 更窄的長形直立長方形外框
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {/* 每個頁籤用「彩色正方形」包住文字 */}
          {[
            { key: 'selfMade', label: '團綜', color: 'purple' },
            { key: 'documentary', label: '紀錄', color: 'green' },
            { key: 'birthday', label: '生日', color: '#FF0080' },
            { key: 'external', label: '外務', color: 'navy' },
            { key: 'performance', label: '活動', color: 'red' },
            { key: 'tfFamilyPeriod', label: 'TF', color: '#FFA500' },
            { key: 'typhoonPeriod', label: 'TYT', color: '#848D94' },
          ].map(item => (
            <div
              key={item.key}
              onClick={() => scrollToSection(item.key)}
              style={{
                width: 35,
                height: 35,
                borderRadius: 0,
                backgroundColor: item.color,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                cursor: 'pointer',
                boxShadow: '0 1px 0 rgba(0,0,0,0.2)'
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}

    </div>
    </>
  );
};

export default Variety;
