// 時代少年團演唱會資料
export const concertsData = [
  {
    id: 'concert_001',
    concertName: '按時長大',
    date: '2020-11-28',
    location: '重慶',
    venue: '',
    image: '/images/concerts/concert-1.jpg',
    emoji: '🎫',
    status: 'online', // offline, online, cancelled
    description: '按時長大，是不慌不忙，是自然而然，帶著最初的模樣，循著獨有的頻率。\n迷茫有時，驚喜有時，踟躕著，期待著。\n人生海海，山山而川；彼此陪伴，匯作勇氣。\n撥開雲層，拾階而上；懷抱熱愛，鮮活生長。\n向著遠方，向著未來。\n向著整個世界，闊步前行。\n寰宇浩蕩，少年並肩穿過時光隧道\n日月星辰，共同見證少年按時長大\n11月28日，與時代少年團不見不散！',
    videoLinks: {
      concert: '',
      rehearsal: '',
      short: ''
    },
    setlist: [
      { song: '爆米花', performer: '全體' },
      { song: '無盡的冒險', performer: '全體' }
    ]
  },
  {
    id: 'concert_002',
    concertName: '火力全開',
    date: '2021-12-14',
    location: '重慶',
    venue: '',
    image: '/images/concerts/concert-2.jpg',
    emoji: '🔥',
    status: 'online',
    description: '翎羽正燃 浴火重生🔥\n無限能量 火力全開🔥\n\n少年赤誠 少年無畏 少年遙望 少年承擔',
    videoLinks: {
      concert: 'https://www.bilibili.com/video/BV1s44y1h7ja/?spm_id_from=333.1387.upload.video_card.click',
      rehearsal: '',
      short: ''
    },
    setlist: [
      { song: '爆米花', performer: '全體' },
      { song: '無盡的冒險', performer: '全體' }
    ]
  },
  {
    id: 'concert_003',
    concertName: '火力全開·無盡夏',
    date: '2022-08-28',
    location: '',
    venue: '',
    image: '/images/concerts/concert-3.jpg',
    emoji: '🌟',
    status: 'online',
    description: '每一年的夏天都會過去，但我們相聚在夏天的約定，不曾改變。\n\n"無論分開多久，都會再次相遇。"',
    videoLinks: {
      concert: '',
      rehearsal: '',
      short: ''
    },
    setlist: [
      { song: '爆米花', performer: '全體' },
      { song: '無盡的冒險', performer: '全體' }
    ]
  },
  {
    id: 'concert_004',
    concertName: '理想之途',
    date: '2023-05-02',
    location: '	海南省海口市',
    venue: '海口市五源河體育場',
    image: '/images/concerts/concert-4.jpg',
    emoji: '🌟',
    status: 'offline',
    description: '攜奪目鎏光，蓄勢而來。\n遠方鼎沸之聲，征途萬里不息。\n跨越時空界限，具象無盡思念。\n少年是，未來無限的光彩。',
    videoLinks: {
      concert: '',
      rehearsal: 'https://www.bilibili.com/video/BV1Rs4y1q7tP/?spm_id_from=333.1387.upload.video_card.click',
      short: ''
    },
    setlist: [
      { song: '爆米花', performer: '全體' },
      { song: '無盡的冒險', performer: '全體' }
    ]
  },
  {
    id: 'concert_005',
    concertName: '參重樓',
    date: '2023-08-19、20',
    location: '青島',
    venue: '',
    image: '/images/concerts/concert-5.jpg',
    emoji: '🌟',
    status: 'cancelled',
    description: '未辦成',
    videoLinks: {
      concert: '',
      rehearsal: '',
      short: ''
    },
    setlist: [ ]
  },
  {
    id: 'concert_006',
    concertName: '「造夏」音樂分享會',
    date: '2023-08-27',
    location: '',
    venue: '',
    image: '/images/concerts/concert-6.jpg',
    emoji: '🌟',
    status: 'online',
    description: '',
    videoLinks: {
      concert: 'https://www.bilibili.com/video/BV1594y167QC/?spm_id_from=333.1387.upload.video_card.click',
      rehearsal: '',
      short: ''
    },
    setlist: [
      { song: '愛夏', performer: '丁程鑫、嚴浩翔、賀峻霖' },
      { song: '最好的都給你', performer: '馬嘉祺、劉耀文' },
      { song: '不冬眠', performer: '劉耀文' },
      { song: '情話', performer: '宋亞軒' },
      { song: '讓我留在你身邊', performer: '張真源' },
      { song: '連名帶姓', performer: '宋亞軒、張真源' },
      { song: '逝去的歌', performer: '賀峻霖' },
      { song: '看起來不錯其實也還好', performer: '嚴浩翔' },
      { song: '眼淚', performer: '丁程鑫' },
      { song: '生活倒影', performer: '馬嘉祺' },
      { song: '躺著真舒服', performer: '全體' },
      { song: '少年時代', performer: '全體' },
      { song: '怎麼辦', performer: '全體' }
    ]
  },
  {
    id: 'concert_007',
    concertName: '參重樓暨出道四周年',
    date: '2023-11-18、19',
    location: '澳門',
    venue: '銀河綜藝館',
    image: '/images/concerts/concert-7.jpg',
    emoji: '🎤',
    status: 'offline',
    description: '心緒舒展，繪制恣意率性。\n流光淺藏，氤氳溫潤光暈。\n歡呼奔湧不息，無限期待盛開。\n美好意象交疊，篆刻少年底色。',
    videoLinks: {
      concert: {
        day1: 'https://www.bilibili.com/video/BV1Ce411f7dq/?spm_id_from=333.1387.upload.video_card.click',
        day2: 'https://www.bilibili.com/video/BV1mC4y117cZ/?spm_id_from=333.1387.upload.video_card.click'
      },
      rehearsal: 'https://www.bilibili.com/video/BV1Lu4y1V7fW/?spm_id_from=333.1387.upload.video_card.click',
      short: ''
    },
    // 多天演唱會的選曲結構
    setlist: {
      day1: {
        date: '2023-11-18',
        theme: 'D1',
        songs: [
          { song: '爆米花', performer: '全體' },
      { song: '無盡的冒險', performer: '全體' }
        ]
      },
      day2: {
        date: '2023-11-19',
        theme: 'D2',
        songs: [
          { song: '爆米花', performer: '全體' },
      { song: '無盡的冒險', performer: '全體' }
        ]
      }
    }
  },
  {
    id: 'concert_008',
    concertName: '參重樓-樓間樓',
    date: '2024-05-03、04',
    location: '重慶',
    venue: '重慶龍興足球場',
    image: '/images/concerts/concert-8.jpg',
    emoji: '☀️',
    status: 'offline',
    description: '雲霧層疊重樓，光影覆現聲波，成長具象有形\n朝向夏日啟程，共循樓間秘境',
    videoLinks: {
      concert: {
        day1: 'https://www.bilibili.com/video/BV1jJ4m1A7rZ/?spm_id_from=333.1387.upload.video_card.click',
        day2: 'https://www.bilibili.com/video/BV17t421M7BF/?spm_id_from=333.1387.upload.video_card.click'
      },
      rehearsal: 'https://www.bilibili.com/video/BV1GD421V7Xk/?spm_id_from=333.1387.upload.video_card.click',
      short: 'https://www.bilibili.com/video/BV1tw4m1Q7tu/?spm_id_from=333.1387.upload.video_card.click'
    },
    setlist: {
      day1: {
        date: '2024-05-03',
        theme: 'D1',
        songs: [
          { song: '爆米花', performer: '全體' },
          { song: '無盡的冒險', performer: '全體' }
        ]
      },
      day2: {
        date: '2024-05-04',
        theme: 'D2',
        songs: [
          { song: '爆米花', performer: '全體' },
          { song: '無盡的冒險', performer: '全體' }
        ]
      }
    }
  },
  {
    id: 'concert_009',
    concertName: '參重樓-樓非樓',
    date: '2024-08-16、17',
    location: '常州',
    venue: '奥林匹克體育中心體育館',
    image: '/images/concerts/concert-9.jpg',
    emoji: '🍂',
    status: 'offline',
    description: '海浪回響，與海風協奏序曲。\n潮汐往覆，轉動孤島相連。\n每一次的潮漲潮落，都在倒數我們的盛夏之約。',
    videoLinks: {
      concert: {
        day1: '',
        day2: ''
      },
      rehearsal: '',
      short: ''
    },
    setlist: {
      day1: {
        date: '2024-08-16',
        theme: 'D1',
        songs: [
          { song: '爆米花', performer: '全體' },
          { song: '無盡的冒險', performer: '全體' }
        ]
      },
      day2: {
        date: '2024-08-17',
        theme: 'D2',
        songs: [
          { song: '爆米花', performer: '全體' },
          { song: '無盡的冒險', performer: '全體' }
        ]
      }
    }
  },
  {
    id: 'concert_010',
    concertName: '參重樓-樓非樓',
    date: '2024-08-23、24',
    location: '澳門',
    venue: '銀河綜藝館',
    image: '/images/concerts/concert-10.jpg',
    emoji: '❄️',
    status: 'offline',
    description: '海浪回響，與海風協奏序曲。\n潮汐往覆，轉動孤島相連。\n每一次的潮漲潮落，都在倒數我們的盛夏之約。',
    videoLinks: {
      concert: {
        day1: 'https://www.bilibili.com/video/BV1GRxWeyEva/?spm_id_from=333.1387.upload.video_card.click',
        day2: 'https://www.bilibili.com/video/BV1L4xeeCEVZ/?spm_id_from=333.1387.upload.video_card.click'
      },
      rehearsal: 'https://www.bilibili.com/video/BV1eT41137my',
      short: 'https://www.bilibili.com/video/BV1eT41137my'
    },
    setlist: {
      day1: {
        date: '2024-08-23',
        theme: 'D1',
        songs: [
          { song: '爆米花', performer: '全體' },
          { song: '無盡的冒險', performer: '全體' }
        ]
      },
      day2: {
        date: '2024-08-24',
        theme: 'D2',
        songs: [
          { song: '爆米花', performer: '全體' },
          { song: '無盡的冒險', performer: '全體' }
        ]
      }
    }
  },
  {
    id: 'concert_011',
    concertName: '一起走過的日子',
    date: '2024-11-23、24',
    location: '重慶',
    venue: '龍興足球場',
    image: '/images/concerts/concert-11.jpg',
    emoji: '🌸',
    status: 'offline',
    description: '銘刻你我約定的指環\n圈起我們彼此相伴的來路\n隧道盡頭的光亮\n成為少年背後耀眼的時光\n\n一起走過的日子\n因為有你 無可比擬\n順著我們的足跡\n想去的未來 只因為有你',
    videoLinks: {
      concert: {
        day1: 'https://www.bilibili.com/video/BV1fYq5YTEup/?spm_id_from=333.1387.upload.video_card.click',
        day2: 'https://www.bilibili.com/video/BV1Bmq3YcEvQ/?spm_id_from=333.1387.upload.video_card.click'
      },
      rehearsal: 'https://www.bilibili.com/video/BV116qPYQEuw/?spm_id_from=333.1387.upload.video_card.click',
      short: 'https://www.bilibili.com/video/BV1gyqcYpEqT/?spm_id_from=333.1387.upload.video_card.click'
    },
    setlist: {
      day1: {
        date: '2024-11-23',
        theme: 'D1',
        songs: [
          { song: '爆米花', performer: '全體' },
          { song: '無盡的冒險', performer: '全體' }
        ]
      },
      day2: {
        date: '2024-11-24',
        theme: 'D2',
        songs: [
          { song: '爆米花', performer: '全體' },
          { song: '無盡的冒險', performer: '全體' }
        ]
      }
    }
  },
  {
    id: 'concert_012',
    concertName: '加冠禮-冠歲海口站',
    date: '2025-05-03、04',
    location: '海口',
    venue: '海口市五源河體育場',
    image: '/images/concerts/concert-12.jpg',
    emoji: '🌞',
    status: 'offline',
    description: '天光傾瀉的白晝，\n北冕座七顆星芒是更亮眼的存在！\n\n星光彙聚，榮耀加冠 \n少年長成，責任加身\n\n這場冠歲之禮，邀你共同見證！\n時代少年團「加冠禮」演唱會-「冠歲」海口站，我們不見不散！',
    videoLinks: {
      concert: {
        day1: 'https://www.bilibili.com/video/BV1uhJczSER4/?spm_id_from=333.1387.upload.video_card.click',
        day2: 'https://www.bilibili.com/video/BV1Lzj4zbEU5/?spm_id_from=333.1387.upload.video_card.click'
      },
      rehearsal: 'https://www.bilibili.com/video/BV17Sjvz9EZm/?spm_id_from=333.1387.upload.video_card.click',
      short: ''
    },
    setlist: {
      day1: {
        date: '2025-05-03',
        theme: 'D1',
        songs: [
          { song: '爆米花', performer: '全體' },
          { song: '無盡的冒險', performer: '全體' }
        ]
      },
      day2: {
        date: '2025-05-04',
        theme: 'D2',
        songs: [
          { song: '爆米花', performer: '全體' },
          { song: '無盡的冒險', performer: '全體' }
        ]
      }
    }
  },
  {
    id: 'concert_013',
    concertName: '加冠禮-冠軍大連站',
    date: '2025-07-25、26',
    location: '大連',
    venue: '大連體育中心',
    image: '/images/concerts/concert-13.jpg',
    emoji: '🌞',
    status: 'offline',
    description: '塵霧散去，照見成長軌跡，\n一關一勵，山海即是征途！\n\n少年加冠，前路在望，\n勇則冠軍，奔赴山海！',
    videoLinks: {
      concert: {
        day1: 'https://www.bilibili.com/video/BV1kkbwzYEA3/?spm_id_from=333.1387.upload.video_card.click',
        day2: 'https://www.bilibili.com/video/BV1r9b6zzEHC/?spm_id_from=333.1387.upload.video_card.click'
      },
      rehearsal: 'https://www.bilibili.com/video/BV1uPYxzpEZd/?spm_id_from=333.1387.upload.video_card.click',
      short: 'https://www.bilibili.com/video/BV1pQ8vz8E3Z/?spm_id_from=333.1387.upload.video_card.click'
    },
    setlist: {
      day1: {
        date: '2025-07-25',
        theme: 'D1',
        songs: [
          { song: '俠', performer: '全體' },
          { song: '百憂戒', performer: '全體' },
          { song: '男兒歌', performer: '全體' },
          { song: '三天三夜', performer: '馬嘉祺/丁程鑫/張真源' },
          { song: '愛是懷疑', performer: '宋亞軒' },
          { song: '那些年', performer: '賀峻霖' },
          { song: 'Euphoria 亢奮', performer: '嚴浩翔' },
          { song: 'FlexXX 炫', performer: '劉耀文' },
          { song: '對面的女孩看過來', performer: '全體' },
          { song: '全世界我最美', performer: '全體' },
          { song: '姐姐真漂亮', performer: '全體' },
          { song: '討厭紅樓夢', performer: '宋亞軒/嚴浩翔' },
          { song: 'Brave Heart', performer: '張真源' },
          { song: '我愛TA', performer: '馬嘉祺' },
          { song: 'Crush', performer: '劉耀文/賀峻霖' },
          { song: '戀我癖', performer: '丁程鑫' },
          { song: '樓外樓', performer: '全體' },
          { song: '要你管', performer: '全體' },
          { song: 'X', performer: '全體' },
          { song: '登頂', performer: '全體' },
          { song: '小小孩', performer: '全體' },
          { song: '臥室巨星', performer: '全體' },
          { song: '爆米花', performer: '全體/大米爆' },
          { song: '無盡的冒險', performer: '全體' },
          { song: '躺著真舒服', performer: '全體' },
          { song: '偶像萬萬歲', performer: '全體' }
        ]
      },
      day2: {
        date: '2025-07-26',
        theme: 'D2',
        songs: [
          { song: '俠', performer: '全體' },
          { song: '百憂戒', performer: '全體' },
          { song: '男兒歌', performer: '全體' },
          { song: '自由', performer: '宋亞軒/嚴浩翔/賀峻霖' },
          { song: 'FlexXX 炫', performer: '劉耀文' },
          { song: '我愛TA', performer: '馬嘉祺' },
          { song: '戀我癖', performer: '丁程鑫' },
          { song: 'Brave Heart', performer: '張真源' },
          { song: '對面的女孩看過來', performer: '全體' },
          { song: '全世界我最美', performer: '全體' },
          { song: '姐姐真漂亮', performer: '全體' },
          { song: '愛是懷疑', performer: '宋亞軒' },
          { song: '那些年', performer: '賀峻霖' },
          { song: '我的名字', performer: '馬嘉祺/丁程鑫' },
          { song: 'Jessiya', performer: '劉耀文/張真源' },
          { song: 'Euphoria 亢奮', performer: '嚴浩翔' },
          { song: '樓外樓', performer: '全體' },
          { song: '要你管', performer: '全體' },
          { song: 'X', performer: '全體' },
          { song: '登頂', performer: '全體' },
          { song: '小小孩', performer: '全體' },
          { song: '臥室巨星', performer: '全體' },
          { song: '爆米花', performer: '全體/大米爆' },
          { song: '無盡的冒險', performer: '全體' },
          { song: '躺著真舒服', performer: '全體' },
          { song: '偶像萬萬歲', performer: '全體' }
        ]
      }
    }
  },
  {
    id: 'concert_014',
    concertName: '加冠禮-冠軍上海站',
    date: '2025-08-20、21、23、24',
    location: '上海',
    venue: '上海體育場',
    image: '/images/concerts/concert-14.jpg',
    emoji: '🍁',
    status: 'offline',
    description: '以「加冠」之儀，「冠軍」之志\n沖破次元之外，加冕未來星河！\n\n這一程，我們將「冠軍」的榮光與責任鍛造成星軌，向宇宙遞交成長序曲。\n\n峰頂不是終點，我們持續向上。\n\n穿過經緯線，赴一場青春與盛夏的約定；\n跨過晨與昏，為每一次奔赴刻下永恒座標。',
    videoLinks: {
      concert: {
        day1: 'https://www.bilibili.com/video/BV1mxa8zfEts/?spm_id_from=333.1387.upload.video_card.click',
        day2: 'https://www.bilibili.com/video/BV11ZaYzeEsd/?spm_id_from=333.1387.upload.video_card.click',
        day3: 'https://www.bilibili.com/video/BV1qjYMzJE8f/?spm_id_from=333.1387.upload.video_card.click',
        day4: 'https://www.bilibili.com/video/BV14ua9zZEtZ/?spm_id_from=333.1387.upload.video_card.click'
      },
      rehearsal: 'https://www.bilibili.com/video/BV1G6YNzTE1J/?spm_id_from=333.1387.upload.video_card.click',
      short: 'https://www.bilibili.com/video/BV1cAeyzfEci/?spm_id_from=333.1387.upload.video_card.click'
    },
    setlist: {
      day1: {
        date: '2025-08-20',
        theme: 'D1',
        songs: [
          { song: '登頂', performer: '全體' },
          { song: '要你管', performer: '全體' },
          { song: '火力全開', performer: '全體' },
          { song: '橘子汽水', performer: '馬嘉祺/賀峻霖' },
          { song: 'My Gospel', performer: '張真源' },
          { song: '淚橋', performer: '丁程鑫/宋亞軒' },
          { song: '漫遊宇宙 Love Me Right', performer: '劉耀文' },
          { song: 'Had It All 遺憾', performer: '嚴浩翔' },
          { song: 'I Like U Like', performer: '全體' },
          { song: '全世界我最美', performer: '全體' },
          { song: 'What makes you beautiful', performer: '全體' },
          { song: 'Like I Do', performer: '劉耀文/張真源/嚴浩翔' },
          { song: 'Redbone', performer: '賀峻霖' },
          { song: '雨天', performer: '宋亞軒' },
          { song: 'D.', performer: '丁程鑫' },
          { song: 'Another Day Of Sun', performer: '馬嘉祺' },
          { song: '理想之途', performer: '全體' },
          { song: '至少我還算快樂', performer: '全體' },
          { song: '如果的事', performer: '全體' },
          { song: '絕配', performer: '全體' },
          { song: '少年時代', performer: '全體' },
          { song: '臥室巨星', performer: '全體' },
          { song: '爆米花', performer: '全體/大米爆' },
          { song: '無盡的冒險', performer: '全體' },
          { song: '像你這樣的朋友', performer: '全體' },
          { song: '還會再相遇', performer: '全體' }
        ]
      },
      day2: {
        date: '2025-08-21',
        theme: 'D2',
        songs: [
          { song: '登頂', performer: '全體' },
          { song: '要你管', performer: '全體' },
          { song: '火力全開', performer: '全體' },
          { song: '橘子汽水', performer: '馬嘉祺/賀峻霖' },
          { song: 'My Gospel', performer: '張真源' },
          { song: '淚橋', performer: '丁程鑫/宋亞軒' },
          { song: '漫遊宇宙 Love Me Right', performer: '劉耀文' },
          { song: 'Had It All 遺憾', performer: '嚴浩翔' },
          { song: 'I Like U Like', performer: '全體' },
          { song: '愛到1440', performer: '全體' },
          { song: '素顏', performer: '全體' },
          { song: 'Like I Do', performer: '劉耀文/張真源/嚴浩翔' },
          { song: 'Redbone', performer: '賀峻霖' },
          { song: '雨天', performer: '宋亞軒' },
          { song: 'D.', performer: '丁程鑫' },
          { song: 'Another Day Of Sun', performer: '馬嘉祺' },
          { song: '理想之途', performer: '全體' },
          { song: '至少我還算快樂', performer: '全體' },
          { song: '如果的事', performer: '全體' },
          { song: '絕配', performer: '全體' },
          { song: '少年時代', performer: '全體' },
          { song: '臥室巨星', performer: '全體' },
          { song: '爆米花', performer: '全體/大米爆' },
          { song: '無盡的冒險', performer: '全體' },
          { song: '直到世界盡頭', performer: '全體' },
          { song: '還會再相遇', performer: '全體' }
        ]
      },
      day3: {
        date: '2025-08-23',
        theme: 'D3',
        songs: [
          { song: '冠軍', performer: '全體' },
          { song: '要你管', performer: '全體' },
          { song: '火力全開', performer: '全體' },
          { song: '比較浪漫', performer: '劉耀文/嚴浩翔' },
          { song: '今天沒回家', performer: '賀峻霖' },
          { song: '好朋友的祝福', performer: '馬嘉祺/張真源' },
          { song: '忽然', performer: '丁程鑫' },
          { song: '特倫斯夢遊仙境', performer: '宋亞軒' },
          { song: 'I Like U Like', performer: '全體' },
          { song: '全世界我最美', performer: '全體' },
          { song: 'What makes you beautiful', performer: '全體' },
          { song: '緩釋膠囊', performer: '馬嘉祺' },
          { song: 'Kiss You Goodbye', performer: '張真源' },
          { song: '海芋戀', performer: '丁程鑫/宋亞軒/賀峻霖' },
          { song: '獨白6208', performer: '嚴浩翔' },
          { song: 'In Two 迷霧', performer: '劉耀文' },
          { song: '理想之途', performer: '全體' },
          { song: '夢', performer: '全體' },
          { song: '沒有如果', performer: '全體' },
          { song: '相遇', performer: '全體' },
          { song: '夢遊記', performer: '全體' },
          { song: '臥室巨星', performer: '全體' },
          { song: '爆米花', performer: '全體/大米爆' },
          { song: '無盡的冒險', performer: '全體' },
          { song: '今天你要嫁給我', performer: '全體' },
          { song: '還會再相遇', performer: '全體' }
        ]
      },
      day4: {
        date: '2025-08-24',
        theme: 'D4',
        songs: [
          { song: '冠軍', performer: '全體' },
          { song: '要你管', performer: '全體' },
          { song: '火力全開', performer: '全體' },
          { song: '比較浪漫', performer: '劉耀文/嚴浩翔' },
          { song: '今天沒回家', performer: '賀峻霖' },
          { song: '好朋友的祝福', performer: '馬嘉祺/張真源' },
          { song: '忽然', performer: '丁程鑫' },
          { song: '特倫斯夢遊仙境', performer: '宋亞軒' },
          { song: 'I Like U Like', performer: '全體' },
          { song: '愛到1440', performer: '全體' },
          { song: '浪花一朵朵', performer: '全體' },
          { song: '緩釋膠囊', performer: '馬嘉祺' },
          { song: 'Kiss You Goodbye', performer: '張真源' },
          { song: '海芋戀', performer: '丁程鑫/宋亞軒/賀峻霖' },
          { song: '獨白6208', performer: '嚴浩翔' },
          { song: 'In Two 迷霧', performer: '劉耀文' },
          { song: '理想之途', performer: '全體' },
          { song: '夢', performer: '全體' },
          { song: '沒有如果', performer: '全體' },
          { song: '相遇', performer: '全體' },
          { song: '夢遊記', performer: '全體' },
          { song: '臥室巨星', performer: '全體' },
          { song: '爆米花', performer: '全體/大米爆' },
          { song: '無盡的冒險', performer: '全體' },
          { song: '多遠都要在一起', performer: '全體' },
          { song: '還會再相遇', performer: '全體' }
        ]
      }
    }
  }
];
