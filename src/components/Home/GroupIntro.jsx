import React from 'react';
import { Card, Typography, Row, Col, Timeline, Tag } from 'antd';
import { CalendarOutlined, TrophyOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const GroupIntro = () => {
  const groupInfo = {
    name: '時代少年團',
    nameEn: 'Teens in Times (TNT)',
    fanName: '爆米花',
    debutDate: '2019年11月23日',
    description: '2019年8月25日經粉絲投票於《台風蛻變之戰》宣布七人成團，由馬嘉祺擔任時代少年團隊長。2019年10月11日發布團名。2019年11月21日，公布由成員共同選出的粉絲名爆米花。2019年11月23日，發布雙單曲《全校通報》及《無盡的冒險》正式出道。'
  };

  const milestones = [
    {
      date: '2019年8月25日',
      event: '《台風蛻變之戰》宣布七人成團',
      description: '經粉絲投票決定最終成員'
    },
    {
      date: '2019年10月11日',
      event: '發布團名「時代少年團」',
      description: '正式對外公布團體名稱'
    },
    {
      date: '2019年11月21日',
      event: '公布粉絲名「爆米花」',
      description: '由成員共同選出的粉絲名稱'
    },
    {
      date: '2019年11月23日',
      event: '正式出道',
      description: '發布雙單曲《全校通報》及《無盡的冒險》'
    }
  ];

  const honors = [
    { title: '音樂風雲榜年度盛典', award: '年度最佳團體' },
    { title: '亞洲音樂盛典', award: '年度最佳新人' },
    { title: '微博之夜', award: '年度音樂團體' },
    { title: '騰訊音樂娛樂盛典', award: '年度最佳團體' }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        {/* 團體基本資訊 */}
        <Col xs={24} lg={12}>
          <Card
            style={{
              height: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Title level={1} style={{
                color: '#FFD700',
                marginBottom: '8px',
                fontSize: '32px'
              }}>
                {groupInfo.name}
              </Title>
              <Title level={3} style={{
                color: '#666',
                marginBottom: '16px',
                fontWeight: 'normal'
              }}>
                {groupInfo.nameEn}
              </Title>
              <Tag
                color="gold"
                style={{
                  fontSize: '16px',
                  padding: '8px 16px',
                  borderRadius: '20px'
                }}
              >
                <HeartOutlined /> 粉絲名：{groupInfo.fanName}
              </Tag>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <Text strong style={{ fontSize: '16px' }}>
                <CalendarOutlined /> 出道日期：{groupInfo.debutDate}
              </Text>
            </div>

            <Paragraph style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#333'
            }}>
              {groupInfo.description}
            </Paragraph>
          </Card>
        </Col>

        {/* 重要里程碑 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                <TrophyOutlined /> 重要里程碑
              </Title>
            }
            style={{
              height: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Timeline
              items={milestones.map((item, index) => ({
                color: '#FFD700',
                children: (
                  <div>
                    <Text strong style={{ color: '#FFD700', fontSize: '16px' }}>
                      {item.date}
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text strong style={{ fontSize: '15px' }}>
                        {item.event}
                      </Text>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary">
                        {item.description}
                      </Text>
                    </div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>

        {/* 團體榮譽 */}
        <Col xs={24}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                <TrophyOutlined /> 團體榮譽
              </Title>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Row gutter={[16, 16]}>
              {honors.map((honor, index) => (
                <Col xs={24} sm={12} md={6} key={index}>
                  <Card
                    size="small"
                    style={{
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      border: '1px solid #FFD700'
                    }}
                  >
                    <Text strong style={{ color: '#333', fontSize: '14px' }}>
                      {honor.title}
                    </Text>
                    <div style={{ marginTop: '8px' }}>
                      <Tag color="gold" style={{ fontSize: '12px' }}>
                        {honor.award}
                      </Tag>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GroupIntro;
