import React from 'react';
import { Typography, Card, Space, Divider } from 'antd';
import { UserOutlined, HeartOutlined, StarOutlined } from '@ant-design/icons';
import { usePageTitle } from '../hooks/usePageTitle';

const { Title, Paragraph, Text } = Typography;

const About = () => {
  usePageTitle('關於版主｜TNT時代少年團');

  return (
    <div style={{ padding: '24px', position: 'relative' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <Title level={1} style={{
          color: '#EBC700',
          marginBottom: '8px',
          fontSize: '36px'
        }}>
          關於版主
        </Title>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        marginBottom: '40px'
      }}>
        {/* 版主介紹卡片 */}
        <Card
          style={{
            borderRadius: '15px',
            border: '2px solid #FFD700',
            boxShadow: '0 4px 12px rgba(255,215,0,0.2)',
            width: '100%',
            maxWidth: '800px'
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Title level={3} style={{ color: '#EBC700', marginBottom: '16px' }}>
                自我介紹
              </Title>
              <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', textAlign: 'left' }}>
                小C，02年，活動範圍北北基桃<br/>
                一代16年入坑，團偏千<br/>
                二代17年入坑，團偏嚴<br/>
                三、四、五代沒特別追<br/>
                不拒同擔，CP都磕<br/><br/>
                目前主要以二代為主，本人是超級團粉，非常喜歡成員之間的互動，還有那滿滿的團魂，不雷任何一位成員。<br/>
                至於為什麼會上樓，在16年時被朋友推坑。先是認識了解TFBOYS之後，開始補他們的物料、演唱會和綜藝節目。後來知道 sdfj 也有推出了二代，便順帶關注了一下。真正開始認真看二代物料，是因為小馬的〈小星星〉，這首根本我的白月光，那段時間很喜歡祺澤。<br/><br/>
                希望有可以閒聊、聊他們的朋友，有機會也可以一起跑活動，基本上每個成員的生日燈箱都會去~ 這是我的追星帳：
                <a href="https://www.instagram.com/18lou_xuefen" target="_blank" rel="noopener noreferrer" style={{ color: '#1677ff' }}>
                  @18lou_xuefen
                </a><br/><br/>
                我會持續更新和完善這個網站，如果有任何建議或發現資訊有誤，歡迎去留言投稿(在團體成員頁面)。<br/>
                希望能透過這個網站能讓更多人了解時代少年團！✨
              </Paragraph>
            </div>

            <Divider style={{ borderColor: '#FFD700' }} />

            <div>
              <Title level={3} style={{ color: '#EBC700', marginBottom: '12px' }}>
                網站特色
              </Title>
              <ul style={{ fontSize: '14px', lineHeight: '2', paddingLeft: '20px' }}>
                <li>若資訊有誤 - 可以留言投稿 ( 在團體成員頁面，首頁 {'>'} 團體成員(更多) {'>'} 留言投稿 )</li>
                <li>微博圖標 - 點擊可以連結到成員的微博</li>
                <li>團體成員 - 點擊可以查看詳細資料</li>
                <li>歌曲 專輯 - 點擊可以查看收錄單曲</li>
                <li>歌曲 - 有播放按鈕，點擊 YT Music 或 Bilibili 播放</li>
                <li>演唱會 - 點擊有曲目詳細資訊，有連結到演唱會的影片</li>
                <li>綜藝節目 - 有連結到相關影片</li>
                <li>綜藝節目 - 若是近一個月內更新的，會有 NEW 標籤</li>
              </ul>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default About;

