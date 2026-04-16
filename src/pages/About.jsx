import React, { useEffect, useState } from 'react';
import { Typography, Card, Space, Divider, Button, message } from 'antd';
import { EditOutlined, InstagramOutlined } from '@ant-design/icons';
import { usePageTitle } from '../hooks/usePageTitle';
import { dbService } from '../services/database';

const { Title, Paragraph } = Typography;

const INSTAGRAM_URL = 'https://www.instagram.com/18lou_xuefen';

const About = () => {
  usePageTitle('關於｜時代少年團');
  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth <= 768;
  const titleTopSpacing = isSmallScreen ? '-25px' : '-15px';
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const data = await dbService.getAboutSections();
        if (!cancelled) {
          setSections(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setSections([]);
          message.error(e.message || '無法載入關於頁內容');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const fixedSide = isSmallScreen ? '12px' : '16px';

  return (
    <div style={{ marginTop: titleTopSpacing, padding: '24px', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <Title level={1} style={{
          color: '#EBC700',
          marginBottom: '8px',
          fontSize: '36px'
        }}>
          關於
        </Title>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '0'
      }}>
        <div style={{ width: '100%', maxWidth: '800px', position: 'relative' }}>
          <Button
            type="text"
            size={isSmallScreen ? 'small' : 'middle'}
            icon={<InstagramOutlined style={{ fontSize: isSmallScreen ? '25px' : '27px' }} />}
            aria-label="Instagram 追星帳"
            onClick={() => window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer')}
            style={{
              position: 'absolute',
              top: '28px',
              right: '28px',
              zIndex: 3,
              color: '#EBC700',
              fontWeight: 'bold',
              paddingInline: '6px'
            }}
          />
          <Card
            style={{
              borderRadius: '15px',
              border: '2px solid #FFD700',
              boxShadow: 'none',
              width: '100%'
            }}
          >
          {loading ? (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              color: '#EBC700',
              fontSize: '16px'
            }}
            >
              載入中...
            </div>
          ) : sections.length === 0 ? (
            <div style={{
              padding: '48px',
              textAlign: 'center',
              color: '#999',
              fontSize: '16px'
            }}
            >
              暫無內容
            </div>
          ) : (
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {sections.map((section, index) => (
                <React.Fragment key={section.id || section.sectionKey || index}>
                  {index > 0 ? <Divider style={{ borderColor: '#FFD700', margin: '10px 0' }} /> : null}
                  <div>
                    <Title level={3} style={{
                      color: '#EBC700',
                      marginBottom: section.sectionType === 'list' ? '12px' : '16px'
                    }}
                    >
                      {section.title}
                    </Title>
                    {section.sectionType === 'paragraph' ? (
                      <Paragraph style={{
                        fontSize: '16px',
                        lineHeight: '1.8',
                        textAlign: 'left',
                        marginBottom: '0px',
                        whiteSpace: 'pre-line'
                      }}
                      >
                        {section.body}
                      </Paragraph>
                    ) : (
                      <ul style={{ fontSize: '14px', lineHeight: '2', paddingLeft: '20px', margin: 0 }}>
                        {(section.listItems || []).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </Space>
          )}
          </Card>
        </div>
      </div>

      <div style={{
        position: 'fixed',
        right: isSmallScreen ? undefined : fixedSide,
        left: isSmallScreen ? fixedSide : undefined,
        bottom: isSmallScreen ? 'calc(env(safe-area-inset-bottom, 0px) + 50px)' : '24px',
        zIndex: 2001
      }}
      >
        <Button
          type="primary"
          size={isSmallScreen ? 'small' : 'middle'}
          icon={<EditOutlined />}
          onClick={() => { window.location.href = '/feedback'; }}
          style={{
            background: '#FFD700',
            borderColor: '#FFD700',
            color: '#000',
            fontWeight: 'bold',
            borderRadius: '20px'
          }}
        >
          留言投稿
        </Button>
      </div>
    </div>
  );
};

export default About;
