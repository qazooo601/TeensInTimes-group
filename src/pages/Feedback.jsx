import React, { useState, useMemo } from 'react';
import { Typography, Form, Input, Select, Button, Card, message, Steps } from 'antd';
import { MailOutlined, FormOutlined } from '@ant-design/icons';
import emailjs from '@emailjs/browser';
import { usePageTitle } from '../hooks/usePageTitle';

const { Title } = Typography;
const { TextArea } = Input;

// EmailJS 配置 - 請在環境變數或配置文件中設置這些值
// 獲取方式：https://www.emailjs.com/
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key',
  RECEIVER_EMAIL: import.meta.env.VITE_RECEIVER_EMAIL || 'your_email@example.com'
};

const Feedback = () => {
  const [form] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(null);

  usePageTitle('意見回饋｜TNT時代少年團');

  const pageOptions = useMemo(() => [
    { label: '首頁', value: '首頁' },
    { label: '成員詳情', value: '成員詳情' },
    { label: '歌曲', value: '歌曲' },
    { label: '演唱會', value: '演唱會' },
    { label: '綜藝節目', value: '綜藝節目' },
    { label: '其他問題', value: '其他問題' }
  ], []);

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      // 保存表單資料到狀態（用於下一步顯示和發送郵件）
      setFormData(values);

      // 進入下一步填寫郵箱
      setCurrentStep(1);
      message.success('表單提交成功，請填寫您的郵箱');
    } catch (error) {
      message.error('提交失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSubmit = async (values) => {
    setSendingEmail(true);
    try {
      // 準備郵件模板參數
      const templateParams = {
        to_email: EMAILJS_CONFIG.RECEIVER_EMAIL,
        from_email: values.email,
        subject: `時團資料回饋 - ${formData.page} - ${formData.type}`,
        page: formData.page,
        type: formData.type,
        content: formData.content,
        user_email: values.email,
        message: `畫面：${formData.page}\n修改類別：${formData.type}\n詳細內容：${formData.content}\n\n來自郵箱：${values.email}`,
      };

      // 發送郵件（使用 @emailjs/browser）
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      message.success('郵件已成功發送！我們會盡快處理您的回饋。');

      // 重置表單並返回第一步
      form.resetFields();
      emailForm.resetFields();
      setFormData(null);
      setCurrentStep(0);
    } catch (error) {
      console.error('EmailJS 錯誤:', error);
      message.error('郵件發送失敗，請檢查配置或稍後再試');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(0);
    emailForm.resetFields();
  };

  const steps = [
    {
      title: '填寫回饋',
      icon: <FormOutlined />,
    },
    {
      title: '填寫郵箱',
      icon: <MailOutlined />,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1} style={{ color: '#EBC700', marginBottom: '8px', fontSize: '32px' }}>
          留言投稿
        </Title>
        <div style={{ color: '#666', fontSize: '14px', lineHeight: 1.8 }}>
          填寫回饋並發送郵件給我
        </div>
      </div>

      <Card style={{ borderRadius: 16, border: '2px solid #FFD700', maxWidth: 800, margin: '0 auto' }}>
        <Steps
          current={currentStep}
          items={steps}
          style={{ marginBottom: '32px' }}
        />

        {currentStep === 0 ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFormSubmit}
            requiredMark
          >
            <Form.Item
              label="畫面"
              name="page"
              rules={[{ required: true, message: '請選擇畫面' }]}
            >
              <Select options={pageOptions} placeholder="請選擇畫面" allowClear showSearch size="large" />
            </Form.Item>

            <Form.Item
              label="修改類別"
              name="type"
              rules={[{ required: true, message: '請選擇修改類別' }]}
            >
              <Select
                placeholder="請選擇類別"
                options={[{ label: '缺少', value: '缺少' }, { label: '更正', value: '更正' }, { label: '其他', value: '其他' }]}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="詳細修改內容"
              name="content"
              rules={[{ required: true, message: '請填寫內容' }, { min: 3, message: '至少 3 個字' }]}
            >
              <TextArea rows={6} placeholder="請描述要補充或更正的內容..." />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={() => form.resetFields()}>清除</Button>
              <Button type="primary" htmlType="submit" loading={submitting} size="large">
                送出
              </Button>
            </div>
          </Form>
        ) : (
          <Form
            form={emailForm}
            layout="vertical"
            onFinish={handleEmailSubmit}
            requiredMark
          >
            <Form.Item
              label="您的郵箱"
              name="email"
              rules={[
                { required: true, message: '請輸入您的郵箱' },
                { type: 'email', message: '請輸入有效的郵箱地址' }
              ]}
            >
              <Input placeholder="example@email.com" size="large" />
            </Form.Item>

            <div style={{
              padding: '16px',
              backgroundColor: '#fff7e6',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #ffe58f'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>回饋內容預覽：</div>
              <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#666' }}>
                <div><strong>畫面：</strong>{formData?.page}</div>
                <div><strong>修改類別：</strong>{formData?.type}</div>
                <div><strong>詳細內容：</strong>{formData?.content}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <Button onClick={handleBack} size="large">
                返回
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={sendingEmail}
                icon={<MailOutlined />}
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%,rgb(255, 196, 0) 100%)',
                  border: 'none'
                }}
              >
                發送Mail
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Feedback;


