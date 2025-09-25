import React from 'react';
import { Card, Row, Col, Typography, List, Tag, Button, Timeline } from 'antd';
import { CalendarOutlined, EnvironmentOutlined, TicketOutlined, ShareAltOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const ConcertSection = () => {
  const upcomingConcerts = [
    {
      title: '時代少年團 2024 巡迴演唱會',
      date: '2024-06-15',
      location: '台北小巨蛋',
      venue: '台北小巨蛋',
      status: '即將開始',
      ticketInfo: '售票中'
    },
    {
      title: '時代少年團 2024 巡迴演唱會',
      date: '2024-07-20',
      location: '高雄巨蛋',
      venue: '高雄巨蛋',
      status: '售票中',
      ticketInfo: '售票中'
    }
  ];

  const pastConcerts = [
    {
      title: '時代少年團 2023 演唱會',
      date: '2023-12-25',
      location: '台北小巨蛋',
      venue: '台北小巨蛋',
      status: '已結束',
      setlist: ['全校通報', '無盡的冒險', '夢遊記']
    },
    {
      title: '時代少年團 2023 演唱會',
      date: '2023-10-01',
      location: '高雄巨蛋',
      venue: '高雄巨蛋',
      status: '已結束',
      setlist: ['全校通報', '無盡的冒險']
    }
  ];

  const fanShares = [
    {
      title: '演唱會精彩瞬間',
      author: '爆米花小編',
      date: '2023-12-26',
      content: '昨晚的演唱會太精彩了！成員們的表演讓人印象深刻...',
      likes: 128
    },
    {
      title: '搶票心得分享',
      author: '幸運大米爆',
      date: '2023-11-15',
      content: '分享一些搶票的小技巧，希望能幫助到大家...',
      likes: 89
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={2} style={{
          color: '#FFD700',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <CalendarOutlined />
          演唱會專區
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          時代少年團演唱會資訊與粉絲分享
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {/* 演唱會日程 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                演唱會日程
              </Title>
            }
            style={{
              height: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <List
              dataSource={upcomingConcerts}
              renderItem={(concert) => (
                <List.Item
                  style={{
                    padding: '16px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text strong style={{ fontSize: '16px' }}>
                          {concert.title}
                        </Text>
                        <Tag color="green">{concert.status}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <Text type="secondary">
                            <CalendarOutlined /> 演出日期：{concert.date}
                          </Text>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <Text type="secondary">
                            <EnvironmentOutlined /> 演出地點：{concert.location}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary">
                            <TicketOutlined /> 票務資訊：{concert.ticketInfo}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                  <Button
                    type="primary"
                    size="small"
                    icon={<TicketOutlined />}
                  >
                    購票
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 演唱會回顧 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                演唱會回顧
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
              items={pastConcerts.map((concert, index) => ({
                color: '#FFD700',
                children: (
                  <div>
                    <Text strong style={{ color: '#FFD700', fontSize: '16px' }}>
                      {concert.date}
                    </Text>
                    <div style={{ marginTop: '4px' }}>
                      <Text strong style={{ fontSize: '15px' }}>
                        {concert.title}
                      </Text>
                    </div>
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary">
                        <EnvironmentOutlined /> {concert.location}
                      </Text>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">演出曲目：</Text>
                      {concert.setlist.map((song, idx) => (
                        <Tag key={idx} size="small" style={{ margin: '2px' }}>
                          {song}
                        </Tag>
                      ))}
                    </div>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>

        {/* 粉絲分享 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                粉絲分享
              </Title>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <List
              dataSource={fanShares}
              renderItem={(share) => (
                <List.Item
                  style={{
                    padding: '16px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <List.Item.Meta
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text strong style={{ fontSize: '16px' }}>
                          {share.title}
                        </Text>
                        <Tag color="blue">{share.likes} 讚</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <Text type="secondary">
                            作者：{share.author} | 日期：{share.date}
                          </Text>
                        </div>
                        <div>
                          <Text>{share.content}</Text>
                        </div>
                      </div>
                    }
                  />
                  <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<ShareAltOutlined />}
                  >
                    分享
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 票務資訊 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                票務資訊
              </Title>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ marginBottom: '24px' }}>
              <Title level={4} style={{ color: '#FFD700' }}>
                搶票教學
              </Title>
              <div style={{
                background: '#f8f9fa',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <ol style={{ margin: 0, paddingLeft: '20px' }}>
                  <li>提前註冊購票平台帳號</li>
                  <li>確認演出時間和場次</li>
                  <li>提前5分鐘進入購票頁面</li>
                  <li>選擇座位區域和數量</li>
                  <li>完成付款流程</li>
                </ol>
              </div>
            </div>

            <div>
              <Title level={4} style={{ color: '#FFD700' }}>
                購票平台
              </Title>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Button block>拓元售票</Button>
                </Col>
                <Col span={12}>
                  <Button block>KKTIX</Button>
                </Col>
                <Col span={12}>
                  <Button block>ibon售票</Button>
                </Col>
                <Col span={12}>
                  <Button block>全家便利商店</Button>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ConcertSection;
