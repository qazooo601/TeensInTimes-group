import React, { useState, useEffect } from 'react';
import { Typography, Card, Tag, Space, Row, Col, Button, Avatar, Spin, message, Image, Carousel } from 'antd';
import { HeartOutlined, FireOutlined, TrophyOutlined, StarOutlined, TeamOutlined, RightOutlined, EyeOutlined } from '@ant-design/icons';
import { BsSinaWeibo } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import UpdateTime from '../components/Layout/UpdateTime';
import { usePageTitle } from '../hooks/usePageTitle';
import { ref, get, set, runTransaction, onValue } from 'firebase/database';
import { database } from '../config/firebase';
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

const Home = () => {
  const navigate = useNavigate();
  const [visitCount, setVisitCount] = useState(0);
  const [showAllHonors, setShowAllHonors] = useState(false);
  const [membersData, setMembersData] = useState([]);
  const [groupHonors, setGroupHonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [homePhotos, setHomePhotos] = useState([]);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);

  usePageTitle('TNT時代少年團');

  // 從資料庫載入資料（方案3：定期自動刷新）
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log('開始從資料庫載入資料...');
        // 嘗試從資料庫載入資料
        const [members, honors, photos] = await Promise.all([
          dbService.getMembers(),
          dbService.getGroupHonors(),
          dbService.getHomePhotos()
        ]);

        console.log('成功載入資料:', { members: members.length, honors: honors.length, photos: photos.length });
        setMembersData(members);
        setGroupHonors(honors);
        setHomePhotos(photos);
        // 只在首次載入時顯示成功訊息，避免定時刷新時頻繁提示
        if (membersData.length === 0 && groupHonors.length === 0 && homePhotos.length === 0) {
          message.success(`成功從資料庫載入 ${members.length} 位成員、${honors.length} 筆榮譽資料和 ${photos.length} 張首頁照片`);
        }
      } catch (error) {
        console.error('從資料庫載入資料失敗:', error);
        console.error('錯誤詳情:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status
        });

        // 載入失敗時保持空陣列，不顯示資料
        setMembersData([]);
        setGroupHonors([]);
        setHomePhotos([]);

        // 只在首次載入失敗時顯示錯誤訊息
        if (membersData.length === 0 && groupHonors.length === 0 && homePhotos.length === 0) {
          const errorMsg = error.response
            ? `API 錯誤 (${error.response.status}): ${error.response.data?.error || error.message}`
            : error.code === 'ERR_NETWORK'
            ? '無法連接到後端 API 服務，請確認後端服務是否正在運行 (http://localhost:3003)'
            : `無法連接到資料庫: ${error.message}`;

          message.error(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    // 立即載入一次
    loadData();

    // 每 60 秒自動刷新資料（方案3）
    const interval = setInterval(() => {
      console.log('定時刷新資料...');
      loadData();
    }, 60000); // 60 秒

    // 清理定時器
    return () => clearInterval(interval);
  }, []);

  // 只負責讀取與監聽全站訪問次數，不再在這裡增加計數
  useEffect(() => {
    let unsubscribe;

    const loadVisitCount = async () => {
      if (database) {
        try {
          const countRef = ref(database, 'visitCount');

          // 先獲取當前計數
          const snapshot = await get(countRef);
          const currentCount = snapshot.val() || 0;
          setVisitCount(currentCount);

          // 再監聽計數變化（即時更新）
          unsubscribe = onValue(countRef, (snapshot) => {
            const count = snapshot.val() || 0;
            setVisitCount(count);
          });
        } catch (error) {
          console.error('Firebase 操作失敗，回退到 localStorage:', error);
          const storedCount = parseInt(localStorage.getItem('homeVisitCount') || '0', 10);
          setVisitCount(storedCount);
        }
      } else {
        // Firebase 未配置時，使用 localStorage 作為備用方案
        const storedCount = parseInt(localStorage.getItem('homeVisitCount') || '0', 10);
        setVisitCount(storedCount);
      }
    };

    loadVisitCount();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);


  const handleMemberClick = (member) => {
    navigate('/member-detail', { state: { member } });
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

  const fixedPhoto = homePhotos.find(photo => photo.photoType === 'fixed');
  const carouselPhotos = homePhotos.filter(photo => photo.photoType === 'carousel');

  return (
    <div style={{ padding: '24px', position: 'relative' }}>
      {/* 瀏覽次數 - 右上角 */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: '#FFD700',
          borderRadius: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 10
        }}
      >
        <EyeOutlined style={{ color: '#000', fontSize: '16px' }} />
        <Text strong style={{ color: '#000', fontSize: '14px' }}>
          {visitCount}
        </Text>
      </div>

      {/* 歡迎區域 */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center' }}>
          <Title level={1} style={{
            color: '#EBC700',
            marginBottom: '8px',
            fontSize: '36px'
          }}>
            時代少年團
          </Title>
          <Paragraph style={{
            fontSize: '16px',
            color: '#666',
            marginBottom: '16px',
            maxWidth: '600px',
            margin: '0 auto 16px'
          }}>
            ✨ 破天下，定風雲，時代少年並肩行 ✨<br/>
            時代少年團（Teens in Times，<br className="mobile-only" />簡稱TNT、小炸）<br/>
            粉絲名：爆米花（又稱：大米爆）/ <br className="mobile-only" />二代粉：樓絲
          </Paragraph>
          <div
            style={{
              marginTop: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <Space wrap>
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
            <div>
              <UpdateTime align="right" showIcon showLabel={false} />
            </div>
          </div>
        </div>
      </div>

      {/* 第一張照片 - 固定放在歡迎區域下方 */}
      {fixedPhoto && (
        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto 40px' }}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(255,215,0,0.3)'
            }}
          >
            <Image
              src={`${fixedPhoto.photoPath}?t=${fixedPhoto.updatedDate ? new Date(fixedPhoto.updatedDate).getTime() : Date.now()}`}
              alt={fixedPhoto.altText || '時代少年團照片'}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
              preview={{
                mask: '點擊查看'
              }}
            />
          </div>
          {fixedPhoto.altText && (
            <div style={{
              textAlign: 'center',
              marginTop: '12px',
              color: '#666',
              fontSize: '14px',
              fontStyle: 'italic'
            }}>
              {fixedPhoto.altText}
            </div>
          )}
        </div>
      )}

      {/* 卡片區域 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* 團體介紹 */}
        <Card
          title={<><StarOutlined /> 團體簡介</>}
          style={{
            borderRadius: '15px',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 12px rgba(255,215,0,0.2)',
            width: '100%',
            maxWidth: '800px'
          }}
        >
          <Paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
          時代少年團（Teens in Times，TNT）是由北京時代峰峻文化藝術發展有限公司推出的中國內地男子演唱組合，由馬嘉祺、丁程鑫、宋亞軒、劉耀文、張真源、嚴浩翔、賀峻霖七人組成。<br/>
          2019年8月25日，真人秀節目《台風少年蛻變之戰》落幕，馬嘉祺、丁程鑫、宋亞軒、劉耀文、張真源、嚴浩翔、賀峻霖七人正式成團；
          10月11日，由七人組成的團體正式公布團名為"時代少年團"，英文名為"Teens in Times"，縮寫為"TNT"，寓意著組合未來將火力全開，勢不可擋；
          11月23日，舉行出道暨新歌首唱會，並發布出道曲《全校通報》，從而正式出道。
          </Paragraph>
        </Card>

        {/* 照片輪播區域 - 團體簡介後 */}
        {carouselPhotos.length > 0 && (
          <div style={{ width: '100%', maxWidth: '800px', marginBottom: '24px' }}>
            <Carousel
              autoplay
              autoplaySpeed={3000}
              dots={true}
              effect="fade"
              beforeChange={(from, to) => setCurrentCarouselIndex(to)}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(255,215,0,0.3)'
              }}
            >
              {carouselPhotos.map((photo) => (
                <div key={photo.id}>
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16/9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f5f5f5'
                    }}
                  >
                    <Image
                      src={`${photo.photoPath}?t=${photo.updatedDate ? new Date(photo.updatedDate).getTime() : Date.now()}`}
                      alt={photo.altText || '時代少年團照片'}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        display: 'block'
                      }}
                      preview={{
                        mask: '點擊查看'
                      }}
                    />
                  </div>
                </div>
              ))}
            </Carousel>
            {/* AltText 顯示在輪播圖框外面 */}
            {carouselPhotos[currentCarouselIndex]?.altText && (
              <div style={{
                textAlign: 'center',
                marginTop: '12px',
                color: '#666',
                fontSize: '14px',
                fontStyle: 'italic',
                padding: '0 16px'
              }}>
                {carouselPhotos[currentCarouselIndex].altText}
              </div>
            )}
          </div>
        )}

        {/* 成員概覽 */}
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><TeamOutlined /> 團體成員</span>
              <Button
                type="link"
                icon={<RightOutlined />}
                onClick={() => navigate('/members')}
                style={{
                  color: '#D6B600',
                  padding: '0',
                  height: 'auto',
                  fontSize: '14px'
                }}
              >
                更多
              </Button>
            </div>
          }
          style={{
            borderRadius: '15px',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 12px rgba(255,215,0,0.2)',
            width: '100%',
            maxWidth: '800px'
          }}
        >
          <Row gutter={[16, 16]}>
            {membersData.map((member, index) => {
              const primaryColor = Array.isArray(member.supportColor) ? member.supportColor[0] : member.supportColor;

              return (
                <Col xs={12} sm={8} md={6} key={index}>
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '10px',
                      cursor: 'pointer',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      border: '2px solid transparent'
                    }}
                    onClick={() => handleMemberClick(member)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = primaryColor;
                      e.currentTarget.style.backgroundColor = `${primaryColor}15`;
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Avatar
                      size={70}
                      src={member.image}
                      style={{
                        backgroundColor: primaryColor,
                        marginBottom: '8px',
                        border: `2px solid ${primaryColor}`,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                      }}
                      onError={() => {
                        return member.emoji;
                      }}
                    >
                      {member.emoji}
                    </Avatar>
                    <Text strong style={{ display: 'block', marginBottom: '2px' }}>
                      {member.memberName}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {formatDate(member.birthday)}
                    </Text>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card>


        {/* 團體榮譽 */}
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><TrophyOutlined /> 團體榮譽</span>
              <Button
                type="link"
                icon={
                  <RightOutlined
                    style={{
                      transform: showAllHonors ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                }
                onClick={() => setShowAllHonors(prev => !prev)}
                style={{
                  color: '#D6B600',
                  padding: 0,
                  height: 'auto',
                  fontSize: '14px'
                }}
              >
                {showAllHonors ? '收起' : '更多'}
              </Button>
            </div>
          }
          style={{
            borderRadius: '15px',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 12px rgba(255,215,0,0.2)',
            width: '100%',
            maxWidth: '800px'
          }}
        >
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            {(showAllHonors ? groupHonors : groupHonors.slice(0, 5)).map((honor) => (
              <div key={honor.id} style={{ marginBottom: '8px' }}>
                {honor.type} {formatDate(honor.date)} | {honor.award}
              </div>
            ))}
          </div>
        </Card>

        {/* 出道前的團體經歷 */}
        <Card
          title={<> 出道前的成員經歷</>}
          style={{
            borderRadius: '15px',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 12px rgba(255,215,0,0.2)',
            width: '100%',
            maxWidth: '800px'
          }}
        >
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '8px' }}>以下為公開資訊：</div>
            <div style={{ marginBottom: '8px' }}>• 2015年，台風四子時期，成員：黃宇航、丁程鑫、敖子逸、黃其淋</div>
            <div style={{ marginBottom: '8px' }}>• 2015~2016年，台風十二子時期，成員：黃宇航、黃其淋、丁程鑫、敖子逸、張真源、陳泗旭、曹峻瑋、賀峻霖、嚴浩翔、代昊林、殷湧智、潘政霖</div>
            <div style={{ marginBottom: '8px' }}>• 2017年4月《天天向上》由成員：丁程鑫、敖子逸、賀峻霖、張真源、宋亞軒，節目中稱之為完顏團</div>
            <div style={{ marginBottom: '8px' }}>• 2017年，台風十子時期，成員：丁程鑫、敖子逸、賀峻霖、張真源、陳泗旭、宋亞軒、劉耀文、陳璽達、李天澤、馬嘉祺</div>
            <div style={{ marginBottom: '8px' }}>• 2018年10月7日，TF家族推出的組合台風少年團正式出道，成員：丁程鑫(隊長)、馬嘉祺、宋亞軒、劉耀文、姚景元</div>
            <div style={{ marginBottom: '8px', textAlign: 'center' }}>
              <strong>
                ~ 祝君武运昌隆，愿君頂峰相遇 !<br className="mobile-only" /> 思念的人终会相聚 ~
              </strong>
            </div>
          </div>
        </Card>
      </div>


    </div>
  );
};

export default Home;

