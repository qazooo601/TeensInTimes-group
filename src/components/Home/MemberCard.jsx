import React from 'react';
import { Card, Avatar, Typography, Tag, Button } from 'antd';
import { UserOutlined, CalendarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MemberCard = ({ member, onClick }) => {
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

  return (
    <Card
      hoverable
      style={{
        height: '100%',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      bodyStyle={{
        padding: '24px',
        textAlign: 'center',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      onClick={() => onClick(member)}
    >
      <div>
        <Avatar
          size={80}
          icon={<UserOutlined />}
          style={{
            marginBottom: '16px',
            ...getSupportColorStyle(member.supportColor)
          }}
        />

        <Title level={4} style={{
          marginBottom: '8px',
          color: '#333'
        }}>
          {member.memberName}
        </Title>

        <Text type="secondary" style={{ fontSize: '14px' }}>
          {member.memberNameEn}
        </Text>

        <div style={{ margin: '12px 0' }}>
          <Tag
            color="blue"
            style={{ marginBottom: '4px' }}
          >
            {member.position}
          </Tag>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <Text style={{ fontSize: '14px' }}>
            <CalendarOutlined /> {getAge(member.birthday)}歲
          </Text>
        </div>

        {member.fanName && (
          <div style={{ marginBottom: '12px' }}>
            <Text style={{ fontSize: '14px', color: '#FFD700' }}>
              粉絲名：{member.fanName}
            </Text>
          </div>
        )}
      </div>

      <Button
        type="primary"
        ghost
        size="small"
        style={{
          borderColor: member.supportColor?.split(' ')[0] || '#1890ff',
          color: member.supportColor?.split(' ')[0] || '#1890ff'
        }}
      >
        查看詳情
      </Button>
    </Card>
  );
};

export default MemberCard;
