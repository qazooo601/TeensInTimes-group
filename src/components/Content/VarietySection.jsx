import React from 'react';
import { Card, Row, Col, Typography, List, Tag, Button, Tabs } from 'antd';
import { PlayCircleOutlined, CalendarOutlined, TeamOutlined, VideoCameraOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const VarietySection = () => {
  const groupVariety = [
    {
      title: '時代少年團的日常',
      platform: 'B站',
      date: '2023-12-01',
      type: '自製團綜',
      description: '成員們的日常生活記錄'
    },
    {
      title: '少年們的冒險',
      platform: 'B站',
      date: '2023-11-15',
      type: '自製團綜',
      description: '戶外探險主題的團綜'
    }
  ];

  const externalVariety = [
    {
      title: '快樂大本營',
      platform: '湖南衛視',
      date: '2023-10-20',
      type: '外務綜藝',
      description: '全體成員參與的綜藝節目'
    },
    {
      title: '天天向上',
      platform: '湖南衛視',
      date: '2023-09-15',
      type: '外務綜藝',
      description: '成員們展示才藝的節目'
    }
  ];

  const documentaries = [
    {
      title: '時代少年團出道紀錄片',
      platform: 'B站',
      date: '2019-11-23',
      type: '紀錄片',
      description: '記錄出道過程的珍貴影像'
    }
  ];

  const birthdayRecords = [
    {
      title: '馬嘉祺生日特輯',
      date: '2023-12-12',
      type: '生日紀錄',
      description: '隊長馬嘉祺的生日慶祝活動'
    },
    {
      title: '丁程鑫生日特輯',
      date: '2023-02-24',
      type: '生日紀錄',
      description: '丁程鑫的生日慶祝活動'
    }
  ];

  const bilibiliLinks = [
    {
      title: '時代少年團官方頻道',
      url: 'https://space.bilibili.com/example',
      description: '官方發布的所有內容'
    },
    {
      title: '考古資料合集',
      url: 'https://space.bilibili.com/example2',
      description: '成員們早期的珍貴影像'
    }
  ];

  const tabItems = [
    {
      key: 'group',
      label: '自製團綜',
      children: (
        <List
          dataSource={groupVariety}
          renderItem={(item) => (
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
                      {item.title}
                    </Text>
                    <Tag color="blue">{item.type}</Tag>
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary">
                        <CalendarOutlined /> 播放日期：{item.date}
                      </Text>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary">
                        <VideoCameraOutlined /> 平台：{item.platform}
                      </Text>
                    </div>
                    <div>
                      <Text>{item.description}</Text>
                    </div>
                  </div>
                }
              />
              <Button
                type="primary"
                ghost
                size="small"
                icon={<PlayCircleOutlined />}
              >
                觀看
              </Button>
            </List.Item>
          )}
        />
      )
    },
    {
      key: 'external',
      label: '外務綜藝',
      children: (
        <List
          dataSource={externalVariety}
          renderItem={(item) => (
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
                      {item.title}
                    </Text>
                    <Tag color="green">{item.type}</Tag>
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary">
                        <CalendarOutlined /> 播放日期：{item.date}
                      </Text>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary">
                        <VideoCameraOutlined /> 平台：{item.platform}
                      </Text>
                    </div>
                    <div>
                      <Text>{item.description}</Text>
                    </div>
                  </div>
                }
              />
              <Button
                type="primary"
                ghost
                size="small"
                icon={<PlayCircleOutlined />}
              >
                觀看
              </Button>
            </List.Item>
          )}
        />
      )
    },
    {
      key: 'documentary',
      label: '紀錄片',
      children: (
        <List
          dataSource={documentaries}
          renderItem={(item) => (
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
                      {item.title}
                    </Text>
                    <Tag color="purple">{item.type}</Tag>
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary">
                        <CalendarOutlined /> 發布日期：{item.date}
                      </Text>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary">
                        <VideoCameraOutlined /> 平台：{item.platform}
                      </Text>
                    </div>
                    <div>
                      <Text>{item.description}</Text>
                    </div>
                  </div>
                }
              />
              <Button
                type="primary"
                ghost
                size="small"
                icon={<PlayCircleOutlined />}
              >
                觀看
              </Button>
            </List.Item>
          )}
        />
      )
    },
    {
      key: 'birthday',
      label: '生日紀錄',
      children: (
        <List
          dataSource={birthdayRecords}
          renderItem={(item) => (
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
                      {item.title}
                    </Text>
                    <Tag color="orange">{item.type}</Tag>
                  </div>
                }
                description={
                  <div>
                    <div style={{ marginBottom: '8px' }}>
                      <Text type="secondary">
                        <CalendarOutlined /> 日期：{item.date}
                      </Text>
                    </div>
                    <div>
                      <Text>{item.description}</Text>
                    </div>
                  </div>
                }
              />
              <Button
                type="primary"
                ghost
                size="small"
                icon={<PlayCircleOutlined />}
              >
                觀看
              </Button>
            </List.Item>
          )}
        />
      )
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
          <VideoCameraOutlined />
          綜藝節目
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          時代少年團的綜藝節目與紀錄片
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {/* 綜藝節目分類 */}
        <Col xs={24} lg={16}>
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Tabs
              defaultActiveKey="group"
              items={tabItems}
              size="large"
            />
          </Card>
        </Col>

        {/* B站連結 */}
        <Col xs={24} lg={8}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                考古資料連結 (B站)
              </Title>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <List
              dataSource={bilibiliLinks}
              renderItem={(link) => (
                <List.Item
                  style={{
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  <List.Item.Meta
                    title={
                      <Text strong style={{ fontSize: '14px' }}>
                        {link.title}
                      </Text>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          {link.description}
                        </Text>
                      </div>
                    }
                  />
                  <Button
                    type="link"
                    size="small"
                    href={link.url}
                    target="_blank"
                  >
                    前往
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VarietySection;
