import React from 'react';
import { Card, Row, Col, Typography, Tag, Avatar, Divider, Button } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, HeartOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const MemberDetail = ({ member }) => {
  const navigate = useNavigate();

  const getAge = (birthday) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getSupportColorStyle = (color) => {
    if (!color) return {};
    const colors = color.split(' ');
    if (colors.length === 1) {
      return { backgroundColor: colors[0] };
    } else {
      return {
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)`
      };
    }
  };

  if (!member) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Title level={3}>成員資訊載入中...</Title>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{ marginBottom: '16px' }}
        >
          返回首頁
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* 成員基本資訊 */}
        <Col xs={24} lg={8}>
          <Card
            style={{
              height: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '32px', textAlign: 'center' }}
          >
            <Avatar
              size={120}
              icon={<HeartOutlined />}
              style={{
                marginBottom: '24px',
                ...getSupportColorStyle(member.supportColor)
              }}
            />

            <Title level={2} style={{
              color: '#333',
              marginBottom: '8px'
            }}>
              {member.memberName}
            </Title>

            <Text type="secondary" style={{ fontSize: '18px', marginBottom: '16px' }}>
              {member.memberNameEn}
            </Text>

            <div style={{ marginBottom: '16px' }}>
              <Tag
                color="blue"
                style={{ fontSize: '16px', padding: '8px 16px' }}
              >
                {member.position}
              </Tag>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <Text style={{ fontSize: '16px' }}>
                <CalendarOutlined /> {getAge(member.birthday)}歲
              </Text>
            </div>

            {member.fanName && (
              <div style={{ marginBottom: '16px' }}>
                <Text style={{ fontSize: '16px', color: '#FFD700' }}>
                  粉絲名：{member.fanName}
                </Text>
              </div>
            )}

            {member.supportColor && (
              <div style={{ marginBottom: '16px' }}>
                <Text style={{ fontSize: '16px' }}>
                  應援色：
                </Text>
                <div
                  style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    marginLeft: '8px',
                    ...getSupportColorStyle(member.supportColor)
                  }}
                />
              </div>
            )}
          </Card>
        </Col>

        {/* 詳細介紹 */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                詳細介紹
              </Title>
            }
            style={{
              height: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '32px' }}
          >
            {member.content ? (
              <div dangerouslySetInnerHTML={{ __html: member.content }} />
            ) : (
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                這裡是 {member.memberName} 的詳細介紹內容。包含個人經歷、特長、性格特點等資訊。
                更多詳細內容將在後續更新中補充。
              </Paragraph>
            )}
          </Card>
        </Col>

        {/* 音樂作品 */}
        <Col xs={24}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                <PlayCircleOutlined /> 音樂作品
              </Title>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text strong>團體專輯</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Tag color="blue">《全校通報》</Tag>
                    <Tag color="blue">《無盡的冒險》</Tag>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text strong>個人作品</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">待更新</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text strong>合作作品</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">待更新</Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 影視作品 */}
        <Col xs={24}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                影視作品
              </Title>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text strong>電視劇</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">待更新</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text strong>電影</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">待更新</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" style={{ textAlign: 'center' }}>
                  <Text strong>綜藝節目</Text>
                  <div style={{ marginTop: '8px' }}>
                    <Text type="secondary">待更新</Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 個人外務 */}
        <Col xs={24}>
          <Card
            title={
              <Title level={3} style={{ margin: 0, color: '#FFD700' }}>
                個人外務
              </Title>
            }
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">個人外務資訊將在後續更新中補充</Text>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MemberDetail;
