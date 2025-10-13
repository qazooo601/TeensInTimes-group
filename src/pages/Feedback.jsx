import React, { useState, useMemo } from 'react';
import { Typography, Form, Input, Select, Button, Card, message } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

const FEEDBACK_STORAGE_KEY = 'feedback_submissions';

const Feedback = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const pageOptions = useMemo(() => [
    { label: '首頁', value: '首頁' },
    { label: '成員詳情', value: '成員詳情' },
    { label: '歌曲', value: '歌曲' },
    { label: '演唱會', value: '演唱會' },
    { label: '綜藝節目', value: '綜藝節目' },
    { label: '其他問題', value: '其他問題' }
  ], []);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      const existing = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
      const record = {
        ...values,
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify([record, ...existing]));
      message.success('已送出，感謝您的回饋！');
      form.resetFields();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <Title level={1} style={{ color: '#EBC700', marginBottom: '8px', fontSize: '32px' }}>
          留言投稿
        </Title>
        <div style={{ color: '#666', fontSize: '13px', lineHeight: 1.8 }}>
          填寫完，直接複製/截圖以下內容，傳到 IG：18lou_xuefen
        </div>
      </div>

      <Card style={{ borderRadius: 16, border: '2px solid #FFD700', maxWidth: 800, margin: '0 auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark
        >
          <Form.Item
            label="畫面"
            name="page"
            rules={[{ required: true, message: '請選擇畫面' }]}
          >
            <Select options={pageOptions} placeholder="請選擇畫面" allowClear showSearch />
          </Form.Item>

          <Form.Item
            label="修改類別"
            name="type"
            rules={[{ required: true, message: '請選擇修改類別' }]}
          >
            <Select
              placeholder="請選擇類別"
              options={[{ label: '缺少', value: '缺少' }, { label: '更正', value: '更正' }]}
            />
          </Form.Item>

          <Form.Item
            label="詳細修改內容"
            name="content"
            rules={[{ required: true, message: '請填寫內容' }, { min: 5, message: '至少 5 個字' }]}
          >
            <TextArea rows={6} placeholder="請描述要補充或更正的內容..." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button onClick={() => form.resetFields()}>清除</Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Feedback;


