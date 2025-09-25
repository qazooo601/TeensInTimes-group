import React, { useState } from 'react';
import { Card, Form, Input, Button, Select, Avatar, Typography, message, Row, Col, Tag } from 'antd';
import { UserOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const UserProfile = ({ user, onUpdateProfile }) => {
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue({
      nickName: user.nickName,
      fanAttributes: user.fanAttributes,
      realName: user.realName || '',
      phone: user.phone || '',
      mail: user.mail || ''
    });
  };

  const handleSave = async (values) => {
    try {
      // 模擬API調用
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = {
        ...user,
        ...values
      };

      message.success('個人資料更新成功！');
      onUpdateProfile(updatedUser);
      setEditing(false);
    } catch (error) {
      message.error('更新失敗，請稍後再試');
    }
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields();
  };

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
          <UserOutlined />
          個人資料管理
        </Title>
      </div>

      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '32px' }}
          >
            {/* 頭像區域 */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <Avatar
                size={100}
                icon={<UserOutlined />}
                style={{
                  backgroundColor: '#FFD700',
                  marginBottom: '16px'
                }}
              />
              <div>
                <Title level={3} style={{ margin: 0, color: '#333' }}>
                  {user.nickName}
                </Title>
                <Text type="secondary">
                  {user.userCode}
                </Text>
              </div>
            </div>

            {editing ? (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                size="large"
              >
                <Form.Item
                  label="暱稱"
                  name="nickName"
                  rules={[
                    { required: true, message: '請輸入暱稱！' },
                    { min: 2, message: '暱稱至少需要2個字符！' },
                    { max: 20, message: '暱稱不能超過20個字符！' }
                  ]}
                >
                  <Input placeholder="暱稱（中文）" />
                </Form.Item>

                <Form.Item
                  label="粉絲屬性"
                  name="fanAttributes"
                  rules={[{ required: true, message: '請選擇您的屬性！' }]}
                >
                  <Select placeholder="選擇屬性">
                    <Option value="團">團</Option>
                    <Option value="團偏">團偏</Option>
                    <Option value="唯">唯</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label="真實姓名"
                  name="realName"
                >
                  <Input placeholder="真實姓名（選填）" />
                </Form.Item>

                <Form.Item
                  label="電話"
                  name="phone"
                  rules={[
                    { pattern: /^09\d{8}$/, message: '請輸入正確的手機號碼格式！' }
                  ]}
                >
                  <Input placeholder="09開頭的手機號碼（選填）" />
                </Form.Item>

                <Form.Item
                  label="郵箱"
                  name="mail"
                  rules={[
                    { type: 'email', message: '請輸入正確的郵箱格式！' }
                  ]}
                >
                  <Input placeholder="郵箱地址（選填）" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      style={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        border: 'none'
                      }}
                    >
                      保存
                    </Button>
                    <Button onClick={handleCancel}>
                      取消
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            ) : (
              <div>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>暱稱：</Text>
                      <div style={{ marginTop: '4px' }}>
                        <Text>{user.nickName}</Text>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>粉絲屬性：</Text>
                      <div style={{ marginTop: '4px' }}>
                        <Tag color="blue">{user.fanAttributes}</Tag>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>用戶代碼：</Text>
                      <div style={{ marginTop: '4px' }}>
                        <Text type="secondary">{user.userCode}</Text>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div style={{ marginBottom: '16px' }}>
                      <Text strong>註冊時間：</Text>
                      <div style={{ marginTop: '4px' }}>
                        <Text type="secondary">
                          {new Date(user.joinDate).toLocaleDateString('zh-TW')}
                        </Text>
                      </div>
                    </div>
                  </Col>
                  {user.realName && (
                    <Col span={12}>
                      <div style={{ marginBottom: '16px' }}>
                        <Text strong>真實姓名：</Text>
                        <div style={{ marginTop: '4px' }}>
                          <Text>{user.realName}</Text>
                        </div>
                      </div>
                    </Col>
                  )}
                  {user.phone && (
                    <Col span={12}>
                      <div style={{ marginBottom: '16px' }}>
                        <Text strong>電話：</Text>
                        <div style={{ marginTop: '4px' }}>
                          <Text>{user.phone}</Text>
                        </div>
                      </div>
                    </Col>
                  )}
                  {user.mail && (
                    <Col span={24}>
                      <div style={{ marginBottom: '16px' }}>
                        <Text strong>郵箱：</Text>
                        <div style={{ marginTop: '4px' }}>
                          <Text>{user.mail}</Text>
                        </div>
                      </div>
                    </Col>
                  )}
                </Row>

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      border: 'none'
                    }}
                  >
                    編輯個人資料
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfile;
