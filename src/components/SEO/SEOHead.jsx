import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SEO Head 組件 - 動態管理每個頁面的 meta 標籤、Open Graph、Twitter Card 和結構化資料
 * @param {Object} props
 * @param {string} props.title - 頁面標題
 * @param {string} props.description - 頁面描述
 * @param {string} props.keywords - 頁面關鍵字（可選）
 * @param {string} props.image - 頁面圖片 URL（可選，預設為 logo）
 * @param {string} props.type - Open Graph 類型（可選，預設為 'website'）
 * @param {Object} props.structuredData - 結構化資料物件（可選）
 */
const SEOHead = ({
  title = '時代少年團',
  description = 'TNT時代少年團。此為自製網站，提供成員資訊、音樂作品、演唱會記錄、綜藝節目、紀錄片...時時更新最新資料',
  keywords = '時代少年團,時團,TNT,馬嘉祺,丁程鑫,宋亞軒,劉耀文,張真源,嚴浩翔,賀峻霖,時團物料,時團音樂,時團演唱會,時團綜藝,時團紀錄片,TNT時代少年團,二代,時代峰峻,爆米花,大米爆,樓絲,光辉岁月,光環下的少年,光環中的少年,sdfj',
  image = 'https://teensintimes-website.zeabur.app/images/members/logo.jpg',
  type = 'website',
  structuredData = null
}) => {
  const location = useLocation();
  const baseUrl = 'https://teensintimes-website.zeabur.app';
  const fullUrl = `${baseUrl}${location.pathname}`;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  useEffect(() => {
    // 更新 document title
    document.title = title;

    // 更新或創建 meta 標籤的輔助函數
    const updateOrCreateMeta = (name, content, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 更新或創建 link 標籤的輔助函數
    const updateOrCreateLink = (rel, href) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // 基本 SEO Meta Tags
    updateOrCreateMeta('description', description);
    updateOrCreateMeta('keywords', keywords);
    updateOrCreateMeta('robots', 'index, follow');

    // Canonical URL
    updateOrCreateLink('canonical', fullUrl);

    // Open Graph Tags
    updateOrCreateMeta('og:type', type, true);
    updateOrCreateMeta('og:url', fullUrl, true);
    updateOrCreateMeta('og:title', title, true);
    updateOrCreateMeta('og:description', description, true);
    updateOrCreateMeta('og:image', fullImageUrl, true);
    updateOrCreateMeta('og:site_name', 'TNT時代少年團', true);
    updateOrCreateMeta('og:locale', 'zh_TW', true);

    // Twitter Card Tags
    updateOrCreateMeta('twitter:card', 'summary_large_image', true);
    updateOrCreateMeta('twitter:url', fullUrl, true);
    updateOrCreateMeta('twitter:title', title, true);
    updateOrCreateMeta('twitter:description', description, true);
    updateOrCreateMeta('twitter:image', fullImageUrl, true);

    // 移除舊的結構化資料（如果存在）
    const oldStructuredData = document.querySelector('script[type="application/ld+json"]');
    if (oldStructuredData) {
      oldStructuredData.remove();
    }

    // 添加新的結構化資料
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }
  }, [title, description, keywords, image, type, structuredData, fullUrl, fullImageUrl, location.pathname]);

  return null; // 此組件不渲染任何內容
};

export default SEOHead;

