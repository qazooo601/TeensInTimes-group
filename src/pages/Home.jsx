import React from 'react';
import { Typography, Card, Tag, Space, Row, Col, Button, Avatar } from 'antd';
import { HeartOutlined, FireOutlined, TrophyOutlined, StarOutlined, TeamOutlined, RightOutlined } from '@ant-design/icons';
import { BsSinaWeibo } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { membersData } from '../data/membersData';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const handleMemberClick = (member) => {
    navigate('/member-detail', { state: { member } });
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 歡迎區域 */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
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
          時代少年團（Teens in Times，簡稱TNT）是由時代峰峻推出的中國內地男子演唱組合
        </Paragraph>
        <Space>
          <Tag color="gold" icon={<HeartOutlined />}>大米爆 聚集地</Tag>
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

      {/* 團體介紹 */}
      <Row gutter={[24, 24]} style={{ marginBottom: '40px' }}>
        <Col xs={24} lg={12}>
          <Card
            title={<><StarOutlined /> 團體簡介</>}
            style={{
              borderRadius: '15px',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 12px rgba(255,215,0,0.2)'
            }}
          >
            <Paragraph style={{ fontSize: '14px', lineHeight: '1.6' }}>
              時代少年團成立於2019年，由七位才華橫溢的年輕成員組成。他們以出色的音樂才華、
              精湛的舞蹈技巧和獨特的個人魅力，在華語樂壇嶄露頭角。每位成員都有自己獨特的風格和專長，
              共同創造出屬於時代少年團的獨特音樂世界。
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title={<><TrophyOutlined /> 團體榮譽</>}
            style={{
              borderRadius: '15px',
              border: '2px solid #FFD700',
              boxShadow: '0 4px 12px rgba(255,215,0,0.2)'
            }}
          >
            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <div style={{ marginBottom: '8px' }}>🏆 2020年 亞洲音樂盛典 最佳新人獎</div>
              <div style={{ marginBottom: '8px' }}>🎵 多首歌曲登上各大音樂平台排行榜</div>
              <div style={{ marginBottom: '8px' }}>🌟 擁有數千萬粉絲的強大影響力</div>
              <div>💫 多次獲得音樂獎項和媒體認可</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 成員概覽 */}
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span><TeamOutlined /> 成員概覽</span>
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
          marginBottom: '20px'
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
                    size={48}
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
                    {member.birthday}
                  </Text>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>
      {/* 出道前的團體經歷 */}
      <Card
        title={<><FireOutlined /> 出道前的團體經歷</>}
        style={{
          borderRadius: '15px',
          border: '2px solid #FFD700',
          boxShadow: '0 4px 12px rgba(255,215,0,0.2)',
          marginBottom: '20px'
        }}
      >
        <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
          <div style={{ marginBottom: '8px' }}>• 2015年，台風四子時期，成員：黃其淋、黃宇航、丁程鑫、敖子逸</div>
          <div style={{ marginBottom: '8px' }}>• 2015~2017年，二代練習生成員：黃其淋、黃宇航、丁程鑫、敖子逸、宋亞軒、李天澤、賀峻霖、嚴浩翔...</div>
          <div style={{ marginBottom: '8px' }}>• 2017年4月《天天向上》由成員：丁程鑫、敖子逸、張真源、賀峻霖、宋亞軒，組成完顏團</div>
          <div style={{ marginBottom: '8px' }}>• 2017年，台風十子時期，成員：丁程鑫、馬嘉祺、敖子逸、張真源、陳璽達、陳泗旭、宋亞軒、李天澤、賀峻霖、劉耀文</div>
          <div>• 2018年10月7日，TF家族推出的組合台風少年團正式出道，成員：丁程鑫(隊長)、馬嘉祺、宋亞軒、劉耀文、姚景元</div>
        </div>
      </Card>
    </div>
  );
};

export default Home;
