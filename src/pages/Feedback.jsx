import React, { useState, useMemo, useEffect } from 'react';
import { Typography, Form, Input, Select, Button, Card, message, Steps, ConfigProvider } from 'antd';
import { FormOutlined, InstagramOutlined } from '@ant-design/icons';
import { BsCursor } from "react-icons/bs";
import emailjs from '@emailjs/browser';
import { usePageTitle } from '../hooks/usePageTitle';
import { apiService } from '../services/api';

const { Title } = Typography;
const { TextArea } = Input;

// EmailJS 配置 - 請在環境變數或配置文件中設置這些值
// 獲取方式：https://www.emailjs.com/
const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id',
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id',
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key',
  RECEIVER_EMAIL: import.meta.env.VITE_RECEIVER_EMAIL || '18lou_xuefen'
};

const Feedback = () => {
  const [form] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    pageOptions: [],
    typeOptions: [],
    deliveryOptions: [],
    deliveryTemplates: {},
    placeholderTemplates: {}
  });

  usePageTitle('留言投稿｜時代少年團');

  // 載入 Feedback 配置
  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        console.log('開始載入 Feedback 配置...');
        console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || '/api');

        const feedbackConfig = await apiService.getFeedbackConfig();

        console.log('Feedback 配置載入成功:', feedbackConfig);
        console.log('配置內容統計:', {
          pageOptions: feedbackConfig.pageOptions?.length || 0,
          typeOptions: feedbackConfig.typeOptions?.length || 0,
          deliveryOptions: feedbackConfig.deliveryOptions?.length || 0,
          deliveryTemplates: Object.keys(feedbackConfig.deliveryTemplates || {}).length,
          placeholderTemplates: Object.keys(feedbackConfig.placeholderTemplates || {}).length
        });

        // 驗證配置是否完整
        if (!feedbackConfig || typeof feedbackConfig !== 'object') {
          throw new Error('API 返回的配置資料格式錯誤');
        }

        if (!feedbackConfig.pageOptions || !Array.isArray(feedbackConfig.pageOptions) || feedbackConfig.pageOptions.length === 0) {
          console.error('pageOptions 為空，完整配置:', JSON.stringify(feedbackConfig, null, 2));
          throw new Error('配置資料不完整：pageOptions 為空，請檢查資料庫中的 ConfigType = "pageOptions" 的資料');
        }

        if (!feedbackConfig.typeOptions || !Array.isArray(feedbackConfig.typeOptions) || feedbackConfig.typeOptions.length === 0) {
          console.error('typeOptions 為空，完整配置:', JSON.stringify(feedbackConfig, null, 2));
          throw new Error('配置資料不完整：typeOptions 為空，請檢查資料庫中的 ConfigType = "typeOptions" 的資料');
        }

        setConfig(feedbackConfig);
        message.success('配置載入成功');
      } catch (error) {
        console.error('載入 Feedback 配置失敗:', error);
        console.error('錯誤詳情:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          baseURL: error.config?.baseURL
        });

        const errorMessage = error.response?.data?.message || error.message || '未知錯誤';
        message.error(`載入配置失敗：${errorMessage}`);

        // 不設置預設配置，讓用戶知道需要修復 API 連接
      } finally {
        // 無論成功或失敗，都要停止 loading 狀態
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // 確保 EmailJS 已初始化
  useEffect(() => {
    if (EMAILJS_CONFIG.PUBLIC_KEY && EMAILJS_CONFIG.PUBLIC_KEY !== 'your_public_key') {
      try {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        console.log('EmailJS 已初始化');
      } catch (error) {
        console.error('EmailJS 初始化失敗:', error);
      }
    }
  }, []);

  const handleFormSubmit = async (values) => {
    setSubmitting(true);
    try {
      // 保存表單資料到狀態（用於下一步顯示和發送郵件）
      setFormData(values);

      // 進入下一步填寫IG/FB帳號
      setCurrentStep(1);
      message.success('表單提交成功，請填寫您的IG/FB帳號');
    } catch (error) {
      message.error('提交失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailSubmit = async (values) => {
    setSendingEmail(true);
    try {
      // 驗證 EmailJS 配置是否正確設置
      const configErrors = [];
      if (!EMAILJS_CONFIG.SERVICE_ID || EMAILJS_CONFIG.SERVICE_ID === 'your_service_id') {
        configErrors.push('VITE_EMAILJS_SERVICE_ID 未設置');
      }
      if (!EMAILJS_CONFIG.TEMPLATE_ID || EMAILJS_CONFIG.TEMPLATE_ID === 'your_template_id') {
        configErrors.push('VITE_EMAILJS_TEMPLATE_ID 未設置');
      }
      if (!EMAILJS_CONFIG.PUBLIC_KEY || EMAILJS_CONFIG.PUBLIC_KEY === 'your_public_key') {
        configErrors.push('VITE_EMAILJS_PUBLIC_KEY 未設置');
      }

      if (configErrors.length > 0) {
        const errorMsg = `EmailJS 配置錯誤：${configErrors.join('、')}。請檢查環境變數設置。`;
        console.error('EmailJS 配置驗證失敗:', {
          configErrors,
          currentConfig: {
            SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
            TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID,
            PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY ? `${EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 5)}...` : '未設定',
            RECEIVER_EMAIL: EMAILJS_CONFIG.RECEIVER_EMAIL
          },
          envVars: {
            VITE_EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '(未設置)',
            VITE_EMAILJS_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '(未設置)',
            VITE_EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? `${import.meta.env.VITE_EMAILJS_PUBLIC_KEY.substring(0, 5)}...` : '(未設置)',
            VITE_RECEIVER_EMAIL: import.meta.env.VITE_RECEIVER_EMAIL || '(未設置)'
          }
        });
        // 使用 throw 而不是 return，確保 finally 區塊會執行
        throw new Error(errorMsg);
      }

      // 準備郵件模板參數
      // 注意：to_email 應該在 EmailJS 服務配置中設定，而不是在模板參數中
      // 如果模板需要 to_email，請確保 EmailJS 模板中有對應的變數
      // 先根據畫面決定要用哪一種文字
      const displayType =
        formData.page === '領取驚喜'
          ? formData.deliveryMethod || '（未選擇領取方式）'
          : formData.type || '（未選擇類別）';

      const displayTypeLabel =
        formData.page === '領取驚喜' ? '領取方式' : '修改類別';

      const templateParams = {
        to_email: EMAILJS_CONFIG.RECEIVER_EMAIL, // 保留以防模板需要
        from_email: values.instagram,
        subject: `時團資料回饋 - ${formData.page} - ${displayType} - ${values.instagram}`,
        page: formData.page,
        type: displayType,               // 傳給模板的 type 也用同一個值
        content: formData.content,
        user_email: values.instagram,
        message:
          `畫面： ${formData.page}\n` +
          `${displayTypeLabel}： ${displayType}\n` +
          `內容： ${formData.content}\n\n` +
          `來自： ${values.instagram}`,
      };

      console.log('發送郵件，配置:', {
        SERVICE_ID: EMAILJS_CONFIG.SERVICE_ID,
        TEMPLATE_ID: EMAILJS_CONFIG.TEMPLATE_ID,
        PUBLIC_KEY: EMAILJS_CONFIG.PUBLIC_KEY ? `${EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 5)}...` : '未設定',
        RECEIVER_EMAIL: EMAILJS_CONFIG.RECEIVER_EMAIL,
        templateParams,
        envCheck: {
          VITE_EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID ? '已設置' : '未設置',
          VITE_EMAILJS_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ? '已設置' : '未設置',
          VITE_EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? '已設置' : '未設置'
        }
      });

      // 發送郵件（使用 @emailjs/browser）
      // 注意：如果已經用 emailjs.init() 初始化，這裡也可以傳 PUBLIC_KEY 作為備用
      const response = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      console.log('EmailJS 發送成功:', response);
      message.success('郵件已成功發送！我們會盡快處理您的回饋。');

      // 重置表單並返回第一步
      form.resetFields();
      emailForm.resetFields();
      setFormData(null);
      setCurrentStep(0);
    } catch (error) {
      // 詳細記錄錯誤資訊
      console.error('EmailJS 錯誤詳情:', {
        message: error.message,
        text: error.text,
        status: error.status,
        statusText: error.statusText,
        response: error.response,
        fullError: error
      });

      // 根據錯誤類型提供更具體的錯誤訊息
      let errorMessage = '郵件發送失敗';

      if (error.status === 400) {
        errorMessage = '請求格式錯誤，請檢查 EmailJS 模板配置和參數名稱是否匹配';
      } else if (error.status === 401) {
        errorMessage = '認證失敗，請檢查 EmailJS Public Key 是否正確，或前往 EmailJS Dashboard 重新連接 Gmail 服務';
      } else if (error.status === 403) {
        errorMessage = '權限不足，請檢查 EmailJS Service ID 和 Template ID，或重新連接 Gmail 服務並授予「Send email on your behalf」權限';
      } else if (error.status === 404) {
        errorMessage = '服務不存在，請檢查 EmailJS Service ID 和 Template ID 是否正確';
      } else if (error.status === 412) {
        errorMessage = 'Gmail 權限不足，請前往 EmailJS Dashboard 重新連接 Gmail 服務並授予所有必要權限';
      } else if (error.text) {
        // EmailJS 通常會在 error.text 中提供詳細錯誤訊息
        errorMessage = `發送失敗：${error.text}`;
        if (error.text.includes('authentication') || error.text.includes('scope') || error.text.includes('insufficient')) {
          errorMessage += '。請前往 EmailJS Dashboard 重新連接 Gmail 服務並授予「Send email on your behalf」權限';
        }
      } else if (error.message) {
        errorMessage = `發送失敗：${error.message}`;
      }

      message.error(errorMessage);
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
      title: '填寫留言',
      icon: <FormOutlined style={{ color: currentStep >= 0 ? '#EBC700' : '#bfbfbf' }} />,
    },
    {
      title: '填寫IG/FB帳號',
      icon: <InstagramOutlined style={{ color: currentStep >= 1 ? '#EBC700' : '#bfbfbf' }} />,
    },
  ];

  if (loading) {
    return (
      <div style={{
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '20px',
        color: '#FFD700'
      }}>
        載入中...
      </div>
    );
  }

  return (
    <div style={{ marginTop: '-25px', padding: '24px', position: 'relative', marginBottom: '0' }}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <Title level={1} style={{ color: '#EBC700', marginBottom: '8px', fontSize: '36px' }}>
          留言投稿
        </Title>
      </div>
      <Card style={{ borderRadius: '20px', border: '3px solid rgb(250, 236, 112)', boxShadow: 'none', transition: 'all 0.3s ease', maxWidth: 800, margin: '0 auto', marginBottom: '0' }}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#EBC700'
            }
          }}
        >
          <Steps
            current={currentStep}
            items={steps}
            style={{ marginBottom: '32px' }}
          />
        </ConfigProvider>

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
              <Select options={config.pageOptions} placeholder="請選擇畫面" allowClear showSearch size="large" />
            </Form.Item>

            <Form.Item
              noStyle
              shouldUpdate={(prev, current) => prev.page !== current.page}
            >
              {({ getFieldValue }) => {
                const pageValue = getFieldValue('page');
                // 當畫面是「領取驚喜」時，不顯示「修改類別」
                if (pageValue === '領取驚喜') {
                  return null;
                }

                return (
                  <Form.Item
                    label="修改類別"
                    name="type"
                    rules={[{ required: true, message: '請選擇修改類別' }]}
                  >
                    <Select
                      placeholder="請選擇類別"
                      options={config.typeOptions}
                      size="large"
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>

            {/* 當選擇「領取驚喜」時顯示交貨方式選擇 */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) => prevValues.page !== currentValues.page}
            >
              {({ getFieldValue, setFieldsValue }) => {
                const pageValue = getFieldValue('page');
                if (pageValue === '領取驚喜') {
                  return (
                    <Form.Item
                      label="領取方式"
                      name="deliveryMethod"
                      rules={[{ required: true, message: '請選擇領取方式' }]}
                    >
                      <Select
                        placeholder="請選擇領取方式"
                        options={config.deliveryOptions}
                        size="large"
                        onChange={(value) => {
                          // 根據選擇自動填入預設模板（從資料庫配置中讀取）
                          const template = config.deliveryTemplates[value];
                          if (template) {
                            setFieldsValue({
                              content: template
                            });
                          }
                        }}
                      />
                    </Form.Item>
                  );
                }
                return null;
              }}
            </Form.Item>

            {/* 根據三個情境動態調整標籤和 placeholder */}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.page !== currentValues.page ||
                prevValues.deliveryMethod !== currentValues.deliveryMethod
              }
            >
              {({ getFieldValue }) => {
                const pageValue = getFieldValue('page');
                const deliveryMethod = getFieldValue('deliveryMethod');

                let label = '詳細修改內容';
                let placeholder = config.placeholderTemplates['default'] || '請描述要補充或更正的內容...';

                if (pageValue === '領取驚喜') {
                  if (deliveryMethod === '面交') {
                    label = '領取資訊-面交';
                    placeholder = config.placeholderTemplates['領取驚喜-面交'] || '請填寫面交相關資訊（例如：地點、時間等）...';
                  } else if (deliveryMethod === '賣貨便') {
                    label = '領取資訊-賣貨便';
                    placeholder = config.placeholderTemplates['領取驚喜-賣貨便'] || '請填寫賣貨便相關資訊（例如：門市名稱、地址等）...';
                  } else {
                    label = '領取資訊';
                    placeholder = config.placeholderTemplates['領取驚喜-未選擇'] || '請先選擇領取方式...';
                  }
                }

                return (
                  <Form.Item
                    label={label}
                    name="content"
                    rules={[{ required: true, message: '請填寫內容' }, { min: 3, message: '至少 3 個字' }]}
                  >
                    <TextArea rows={6} placeholder={placeholder} />
                  </Form.Item>
                );
              }}
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={() => form.resetFields()} size="large">清除</Button>
              <Button type="primary" htmlType="submit" loading={submitting} size="large" style={{ background: ' #FFD700', border: 'none',color: '#000' }}>
                下一步
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
              label="您的IG帳號/FB帳號"
              name="instagram"
              rules={[
                { required: true, message: '請輸入您的IG帳號/FB帳號' },
                { type: 'text', message: '請輸入有效的IG帳號/FB帳號' }
              ]}
            >
              <Input placeholder="IG:18lou_xuefen" size="large" />
            </Form.Item>

            <div style={{
              padding: '16px',
              backgroundColor: '#fff7e6',
              borderRadius: '8px',
              marginBottom: '24px',
              border: '1px solid #ffe58f'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>內容預覽：</div>
              <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#666' }}>
                <div><strong>畫面：</strong>{formData?.page}</div>
                {formData?.type ? (
                <div><strong>修改類別：</strong>{formData.type}</div>
              ) : formData?.page === '領取驚喜' ? (
                <div><strong>領取方式：</strong>{formData?.deliveryMethod}</div>
              ) : null}
                <div>
                  <strong>內容：</strong>
                  <span style={{ whiteSpace: 'pre-line' }}>
                    {formData?.content}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={handleBack} size="large">
                返回
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={sendingEmail}
                icon={<BsCursor />}
                size="large"
                style={{
                  background: ' #FFD700',
                  border: 'none',
                  color: '#000'
                }}
              >
                送出
              </Button>
            </div>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Feedback;


