import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Avatar, Tag, Space, Button, Row, Col, Spin, message } from 'antd';
import { HeartOutlined, FireOutlined, EditOutlined } from '@ant-design/icons';
import { BsSinaWeibo } from "react-icons/bs";
import { membersData as localMembersData } from '../data/membersData';
import { usePageTitle } from '../hooks/usePageTitle';
import { dbService } from '../services/database';

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

const Members = () => {
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState({});
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageTitle('成員介紹｜TNT時代少年團');

  // 從資料庫載入資料
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log('開始從資料庫載入成員資料...');
        const members = await dbService.getMembers();

        console.log('成功載入成員資料:', { members: members.length });
        setMembersData(members);
        message.success(`成功從資料庫載入 ${members.length} 位成員資料`);
      } catch (error) {
        console.error('從資料庫載入成員資料失敗，使用本地資料:', error);
        console.error('錯誤詳情:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status
        });

        // 如果資料庫連接失敗，使用本地資料作為備用方案
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

    loadData();
  }, []);

  // 返回列表時還原滾動位置（等待資料載入完成再還原，避免被「載入中」畫面截斷）
  useEffect(() => {
    if (loading) return;

    const navType = sessionStorage.getItem('nav_type_/members');
    const savedPosition = sessionStorage.getItem('scroll_/members');

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
    sessionStorage.removeItem('nav_type_/members');
  }, [loading]);

  // 計算年齡的函數
  const calculateAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  const handleMemberClick = (member) => {
    // 保存當前滾動位置
    const currentPosition = window.scrollY;
    sessionStorage.setItem('scroll_/members', currentPosition.toString());
    // 標記為前進導航
    sessionStorage.setItem('nav_type_/member-detail', 'forward');
    // 使用 React Router 導航到成員詳細頁面
    navigate('/member-detail', { state: { member } });
  };

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768;

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
          團體成員
        </Title>
        <Paragraph style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '16px'
        }}>
          ✨ 時代少年團七位成員 ✨
        </Paragraph>
        <Space>
          <Tag color="gold" icon={<HeartOutlined />}>大米爆</Tag>
          <Tag color="default" icon={<FireOutlined />}>永遠在一起</Tag>
          <Tag
            color="red"
            icon={<BsSinaWeibo style={{ transform: 'translateY(2px)', marginRight: '4px' }} />}
            style={{ cursor: 'pointer' }}
            onClick={() => window.open('https://weibo.com/u/6620842908', '_blank')}
          >
            @时代少年团
          </Tag>
        </Space>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          width: '100%',
          maxWidth: '1200px'
        }}>
        {membersData.map((member, index) => {
          // 處理顏色：如果是陣列則創建漸層，如果是單一顏色則使用原色
          const isGradient = Array.isArray(member.supportColor);
          const primaryColor = isGradient ? member.supportColor[0] : member.supportColor;
          const backgroundStyle = isGradient
            ? `linear-gradient(135deg, ${member.supportColor[0]}60 0%, ${member.supportColor[1]}60 100%)`
            : `linear-gradient(135deg, ${member.supportColor}20 0%, ${member.supportColor}60 100%)`;

          return (
            <Card
              key={index}
              hoverable
              onClick={() => handleMemberClick(member)}
              style={{
                borderRadius: '20px',
                border: `3px solid ${primaryColor}`,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                background: backgroundStyle,
                cursor: 'pointer'
              }}
              styles={{ body: { padding: '20px' } }}
            >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* 左側圖片 */}
              <div style={{ flexShrink: 0, textAlign: 'center' }}>
                {imageErrors[member.memberCode] || !member.image ? (
                  <div
                    style={{
                      display: 'inline-flex',
                      width: '80px',
                      height: '80px',
                      backgroundColor: primaryColor,
                      fontSize: '32px',
                      border: `2px solid ${primaryColor}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      borderRadius: '8px',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {member.emoji}
                  </div>
                ) : (
                  <img
                    src={member.image}
                    alt={member.memberName}
                    onError={() => setImageErrors(prev => ({ ...prev, [member.memberCode]: true }))}
                    style={{
                      width: '80px',
                      height: 'auto',
                      maxWidth: '80px',
                      border: `2px solid ${primaryColor}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      borderRadius: '8px',
                      display: 'block'
                    }}
                  />
                )}
              </div>

              {/* 右側資訊 */}
              <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                <Title level={3} style={{
                  color: '#333',
                  marginBottom: '8px',
                  fontSize: '20px'
                }}>
                  {member.memberName}
                </Title>
                <Text style={{
                  color: (() => {
                    const baseColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;
                    // 為不同顏色創建對應的深色版本
                    const colorMap = {
                      '#CC66FF': '#524889',
                      '#FFD700': '#B8860B',
                      '#63C3DE': '#1D738B',
                      '#FFFFFF': '#757575',
                      '#C0EBD7': '#37A471',
                      '#FF5546': '#CC0000',
                      '#ADD5A2': '#62AC4D'
                    };
                    return colorMap[baseColor] || '#333';
                  })(),
                  fontSize: '14px'
                }}>
                  {member.fanName}<br/>
                  {formatDate(member.birthday)} | {calculateAge(formatDate(member.birthday))}歲
                </Text>
              </div>
            </div>
          </Card>
          );
        })}
        </div>
      </div>

      {/* 右下意見回饋按鈕（從 MemberDetail 移置至此） */}
      <div style={{ position: 'fixed', right: isSmallScreen ? undefined : '16px', left: isSmallScreen ? '12px' : undefined, bottom: isSmallScreen ? 'calc(env(safe-area-inset-bottom, 0px) + 96px)' : '16px', zIndex: 2001 }}>
        <Button
          type="primary"
          size={isSmallScreen ? 'small' : 'middle'}
          icon={<EditOutlined />}
          onClick={() => window.location.href = '/feedback'}
          style={{
            background: '#FFD700',
            borderColor: '#FFD700',
            color: '#000',
            fontWeight: 'bold',
            borderRadius: '20px'
          }}
        >
          留言投稿
        </Button>
      </div>
    </div>
  );
};

export default Members;
