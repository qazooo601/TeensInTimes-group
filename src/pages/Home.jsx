import React from 'react';
import { Typography, Card, Tag, Space, Row, Col, Button, Avatar } from 'antd';
import { HeartOutlined, FireOutlined, TrophyOutlined, StarOutlined, TeamOutlined, RightOutlined } from '@ant-design/icons';
import { BsSinaWeibo } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { membersData } from '../data/membersData';
import { groupHonors } from '../data/honorsData';
import UpdateTime from '../components/Layout/UpdateTime';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();


  const handleMemberClick = (member) => {
    navigate('/member-detail', { state: { member } });
  };

  return (
    <div style={{ padding: '24px', position: 'relative' }}>
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
            時代少年團（Teens in Times，簡稱TNT）是由時代峰峻推出的中國內地男子演唱組合
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

        {/* 團體榮譽 */}
        <Card
          title={<><TrophyOutlined /> 團體榮譽</>}
          style={{
            borderRadius: '15px',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 12px rgba(255,215,0,0.2)',
            width: '100%',
            maxWidth: '800px'
          }}
        >
          <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
            {groupHonors.map((honor) => (
              <div key={honor.id} style={{ marginBottom: '8px' }}>
                {honor.type} {honor.date} | {honor.award}
              </div>
            ))}
          </div>
        </Card>

        {/* 出道前的團體經歷 */}
        <Card
          title={<><FireOutlined /> 出道前的團體經歷</>}
          style={{
            borderRadius: '15px',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 12px rgba(255,215,0,0.2)',
            width: '100%',
            maxWidth: '800px'
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


    </div>
  );
};

export default Home;

