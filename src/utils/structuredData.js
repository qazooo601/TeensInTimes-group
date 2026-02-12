/**
 * 生成結構化資料（Schema.org JSON-LD）的工具函數
 */

const baseUrl = 'https://teensintimes-website.zeabur.app';

/**
 * 生成網站整體的結構化資料
 */
export const generateWebsiteStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '時代少年團',
    url: baseUrl,
    description: 'TNT時代少年團。此為自製網站，提供成員資訊、音樂作品、演唱會記錄、綜藝節目、紀錄片...時時更新最新資料',
    inLanguage: 'zh-TW',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };
};

/**
 * 生成組織（團體）的結構化資料
 */
export const generateOrganizationStructuredData = (groupInfo) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    name: groupInfo?.groupName || '時代少年團',
    alternateName: groupInfo?.groupNameEn || 'TNT',
    description: groupInfo?.description || 'TNT時代少年團',
    url: baseUrl,
    image: `${baseUrl}/images/members/logo.jpg`,
    sameAs: [
      // 可以在這裡添加官方社群媒體連結
    ],
    member: [
      // 成員資料可以從資料庫載入後填入
    ]
  };
};

/**
 * 生成成員的結構化資料
 */
export const generatePersonStructuredData = (member) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    alternateName: member.nameEn,
    description: member.description || `${member.name} - 時代少年團成員`,
    image: member.image ? `${baseUrl}${member.image}` : `${baseUrl}/images/members/logo.jpg`,
    jobTitle: '歌手',
    memberOf: {
      '@type': 'MusicGroup',
      name: '時代少年團'
    },
    birthDate: member.birthday || undefined,
    nationality: '中國'
  };
};

/**
 * 生成音樂作品的結構化資料
 */
export const generateMusicAlbumStructuredData = (album) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'MusicAlbum',
    name: album.title,
    description: album.description || `${album.title} - 時代少年團音樂作品`,
    image: album.image ? `${baseUrl}${album.image}` : `${baseUrl}/images/members/logo.jpg`,
    byArtist: {
      '@type': 'MusicGroup',
      name: '時代少年團'
    },
    datePublished: album.releaseDate || undefined,
    numTracks: album.tracks?.length || undefined
  };
};

/**
 * 生成活動/演唱會的結構化資料
 */
export const generateEventStructuredData = (event) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.description || `${event.title} - 時代少年團演唱會`,
    image: event.image ? `${baseUrl}${event.image}` : `${baseUrl}/images/members/logo.jpg`,
    startDate: event.date || undefined,
    location: {
      '@type': 'Place',
      name: event.venue || '未指定地點',
      address: event.location || undefined
    },
    organizer: {
      '@type': 'MusicGroup',
      name: '時代少年團'
    }
  };
};

/**
 * 生成麵包屑導航的結構化資料
 */
export const generateBreadcrumbStructuredData = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`
    }))
  };
};

