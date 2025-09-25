import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import MemberCard from './MemberCard';

const { Title } = Typography;

const MemberList = ({ members, onMemberClick }) => {
  return (
    <div style={{ padding: '24px' }}>
      <Card
        style={{
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}
        bodyStyle={{ padding: '32px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Title level={2} style={{
            color: '#FFD700',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <TeamOutlined />
            時代少年團成員
          </Title>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: 0
          }}>
            點擊成員卡片查看詳細介紹
          </p>
        </div>

        <Row gutter={[24, 24]}>
          {members.map((member) => (
            <Col
              xs={24}
              sm={12}
              md={8}
              lg={6}
              xl={4}
              key={member.memberCode}
            >
              <MemberCard
                member={member}
                onClick={onMemberClick}
              />
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default MemberList;
