import React from 'react';
import { Card, Row, Col, Typography, List, Tag, Button } from 'antd';
import { PlayCircleOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const MusicSection = () => {
  const albums = [
    {
      title: '全校通報',
      releaseDate: '2019-11-23',
      type: '出道單曲',
      tracks: ['全校通報', '無盡的冒險'],
      members: '全體成員'
    },
    {
      title: '無盡的冒險',
      releaseDate: '2019-11-23',
      type: '出道單曲',
      tracks: ['無盡的冒險', '全校通報'],
      members: '全體成員'
    },
    {
      title: '夢遊記',
      releaseDate: '2020-01-07',
      type: 'EP',
      tracks: ['夢遊記', '全校通報', '無盡的冒險'],
      members: '全體成員'
    }
  ];

  const singles = [
    {
      title: '全校通報',
      releaseDate: '2019-11-23',
      type: '單曲',
      members: '全體成員'
    },
    {
      title: '無盡的冒險',
      releaseDate: '2019-11-23',
      type: '單曲',
      members: '全體成員'
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
          <PlayCircleOutlined />
          歌曲專區
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          時代少年團的音樂作品展示
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {/* 專輯列表 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                專輯列表
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
              dataSource={albums}
              renderItem={(album) => (
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
                          {album.title}
                        </Text>
                        <Tag color="blue">{album.type}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <Text type="secondary">
                            <CalendarOutlined /> 發行日期：{album.releaseDate}
                          </Text>
                        </div>
                        <div style={{ marginBottom: '8px' }}>
                          <Text type="secondary">
                            <TeamOutlined /> 參與成員：{album.members}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary">曲目：</Text>
                          {album.tracks.map((track, index) => (
                            <Tag key={index} size="small" style={{ margin: '2px' }}>
                              {track}
                            </Tag>
                          ))}
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
                    試聽
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 單曲列表 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                單曲列表
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
              dataSource={singles}
              renderItem={(single) => (
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
                          {single.title}
                        </Text>
                        <Tag color="green">{single.type}</Tag>
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <Text type="secondary">
                            <CalendarOutlined /> 發行日期：{single.releaseDate}
                          </Text>
                        </div>
                        <div>
                          <Text type="secondary">
                            <TeamOutlined /> 參與成員：{single.members}
                          </Text>
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
                    試聽
                  </Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 歌詞展示 */}
        <Col xs={24}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                歌詞展示
              </Title>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card size="small" title="全校通報" style={{ height: '100%' }}>
                  <div style={{
                    background: '#f8f9fa',
                    padding: '16px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    <div>我們是時代少年團</div>
                    <div>全校通報 全校通報</div>
                    <div>我們來了 我們來了</div>
                    <div>...</div>
                    <div style={{ marginTop: '12px', color: '#666' }}>
                      <Text type="secondary">更多歌詞內容將在後續更新中補充</Text>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card size="small" title="無盡的冒險" style={{ height: '100%' }}>
                  <div style={{
                    background: '#f8f9fa',
                    padding: '16px',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}>
                    <div>無盡的冒險 開始了</div>
                    <div>我們一起 向前走</div>
                    <div>不怕困難 不怕挑戰</div>
                    <div>...</div>
                    <div style={{ marginTop: '12px', color: '#666' }}>
                      <Text type="secondary">更多歌詞內容將在後續更新中補充</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MusicSection;
