// 後端 API 服務 - 連接 Zeabur MySQL 資料庫
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// 資料庫連線設定
// 優先使用環境變數，如果沒有則使用預設值（開發和生產使用同一個資料庫）
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 設定連接選項
  connectTimeout: 60000,
  acquireTimeout: 60000,
  timeout: 60000,
  // 字符集設定
  charset: 'utf8mb4',
  // 啟用多語句（如果需要）
  multipleStatements: false
};

// 顯示當前使用的資料庫配置（不顯示密碼）
console.log('📊 資料庫連接設定:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  source: process.env.DB_HOST ? '環境變數' : '預設值'
});

// 建立連線池
const pool = mysql.createPool(dbConfig);

// 包裝執行函數，在查詢前設定會話變數以增加封包大小限制
const executeWithLargePacket = async (query, params) => {
  const connection = await pool.getConnection();
  try {
    // 設定會話級別的 max_allowed_packet 為 16MB
    await connection.execute('SET SESSION max_allowed_packet = 16777216');
    // 執行實際查詢
    const result = await connection.execute(query, params);
    return result;
  } finally {
    connection.release();
  }
};

// 中間件
app.use(cors());
app.use(express.json());

// API 路由

// 獲取所有成員資料
app.get('/api/members', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // 設定會話級別的 max_allowed_packet
    try {
      await connection.execute('SET SESSION max_allowed_packet = 67108864');
    } catch (setError) {
      // 如果設定失敗，繼續執行（使用伺服器預設值）
    }

    const [rows] = await connection.execute(
      `SELECT
        ID as id,
        MemberCode as memberCode,
        MemberName as memberName,
        MemberNameEn as memberNameEn,
        MemberNameCn as memberNameCn,
        WeiboURL as weibo,
        Birthday as birthday,
        Age as age,
        Position as position,
        FanName as fanName,
        SupportColor as supportColor,
        AvatarUrl as avatarUrl,
        DetailImageUrl as detailImageUrl,
        Content as content,
        SortOrder as sortOrder
      FROM Members
      WHERE IsActive = 1
      ORDER BY SortOrder ASC`
    );

    // 轉換資料格式
    const members = rows.map(row => {
      const emojiMap = {
        'MJQ': '🎈',
        'DCX': '⭐',
        'SYX': '🐚',
        'LYW': '🌕',
        'ZZY': '🍭',
        'YHX': '🥤',
        'HJL': '🌊'
      };

      return {
        id: row.id,
        memberCode: row.memberCode,
        memberName: row.memberName,
        memberNameEn: row.memberNameEn,
        memberNameCn: row.memberNameCn,
        birthday: row.birthday,
        fanName: row.fanName,
        weibo: row.weibo || null,
        supportColor: row.supportColor ? row.supportColor.split(', ') : [],
        image: row.avatarUrl, // 列表頁頭像
        images: row.detailImageUrl || row.avatarUrl, // 詳細頁圖片，如果沒有則使用頭像
        position: row.position,
        content: row.content || null, // 成員介紹內容（來自資料庫）
        emoji: emojiMap[row.memberCode] || '⭐'
      };
    });

    res.json(members);
  } catch (error) {
    console.error('獲取成員資料失敗:', error);
    console.error('錯誤詳情:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      errno: error.errno
    });

    // 如果是資料表不存在的錯誤，提供更明確的提示
    let errorMessage = error.message;
    if (error.code === 'ER_NO_SUCH_TABLE' || error.sqlMessage?.includes("doesn't exist")) {
      errorMessage = '資料表 Members 不存在，請先執行 npm run init:db 初始化資料庫';
    }

    res.status(500).json({
      error: '獲取成員資料失敗',
      message: errorMessage,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
  } finally {
    // 確保連接被釋放
    if (connection) {
      connection.release();
    }
  }
});

// 獲取團體榮譽資料
app.get('/api/honors', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        ID as id,
        AwardDate as date,
        HonorTitle as award,
        Type as type,
        SortOrder as sortOrder
      FROM GroupHonors
      WHERE IsActive = 1
      ORDER BY AwardDate DESC, SortOrder ASC`
    );

    const honors = rows.map(row => ({
      id: `honor_${row.id}`,
      date: row.date,
      award: row.award,
      type: row.type,
      category: '榮譽'
    }));

    res.json(honors);
  } catch (error) {
    console.error('獲取榮譽資料失敗:', error);
    console.error('錯誤詳情:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      errno: error.errno
    });

    // 如果是資料表不存在的錯誤，提供更明確的提示
    let errorMessage = error.message;
    if (error.code === 'ER_NO_SUCH_TABLE' || error.sqlMessage?.includes("doesn't exist")) {
      errorMessage = '資料表 GroupHonors 不存在，請先執行 npm run init:db 初始化資料庫';
    }

    res.status(500).json({
      error: '獲取榮譽資料失敗',
      message: errorMessage,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
  }
});

// 獲取首頁照片
app.get('/api/home-photos', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT
        ID as id,
        PhotoPath as photoPath,
        AltText as altText,
        PhotoType as photoType,
        SortOrder as sortOrder,
        UpdatedDate as updatedDate
      FROM HomePhotos
      WHERE IsActive = 1
      ORDER BY PhotoType ASC, SortOrder ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error('獲取首頁照片失敗:', error);
    console.error('錯誤詳情:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      errno: error.errno
    });

    let errorMessage = error.message;
    if (error.code === 'ER_NO_SUCH_TABLE' || error.sqlMessage?.includes("doesn't exist")) {
      errorMessage = '資料表 HomePhotos 不存在，請先執行 npm run init:db 初始化資料庫';
    }

    res.status(500).json({
      error: '獲取首頁照片失敗',
      message: errorMessage,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
  } finally {
    connection.release();
  }
});

// 獲取音樂資料
app.get('/api/music', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        ID as id,
        SectionTitle as name,
        ReleaseDate as releaseDate,
        Type as type,
        Category as category,
        ImageUrl as image,
        Emoji as emoji,
        Description as description,
        TrackList as trackList,
        SortOrder as sortOrder
      FROM MusicSection
      WHERE IsActive = 1
      ORDER BY SortOrder ASC, ReleaseDate DESC`
    );


    // 轉換資料格式
    const music = rows.map(row => {
      let trackList = [];

      try {
        if (row.trackList) {
          trackList = JSON.parse(row.trackList);
        }
      } catch (e) {
        console.error('解析 JSON 失敗:', e);
      }

      return {
        id: `music_${row.id}`,
        name: row.name || '',
        // 所有欄位都直接使用資料庫欄位
        releaseDate: row.releaseDate || '待發行',
        type: row.type || '',
        category: row.category || 'album',
        image: row.image || '',
        emoji: row.emoji || '🎵',
        description: row.description || '',
        songs: trackList || []
      };
    });

    res.json(music);
  } catch (error) {
    console.error('獲取音樂資料失敗:', error);
    console.error('錯誤詳情:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      errno: error.errno
    });

    // 如果是資料表不存在的錯誤，提供更明確的提示
    let errorMessage = error.message;
    if (error.code === 'ER_NO_SUCH_TABLE' || error.sqlMessage?.includes("doesn't exist")) {
      errorMessage = '資料表 MusicSection 不存在，請先執行 npm run init:db 初始化資料庫';
    }

    res.status(500).json({
      error: '獲取音樂資料失敗',
      message: errorMessage,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
  }
});

// 獲取演唱會資料
app.get('/api/concerts', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        ID as id,
        SectionTitle as concertName,
        ConcertDate as date,
        Location as location,
        Venue as venue,
        TrackList as trackList,
        ImageUrl as image,
        GroupPhoto as groupPhoto,
        Emoji as emoji,
        Status as status,
        ShowNumber as showNumber,
        Description as description,
        VideoLinks as videoLinks,
        SortOrder as sortOrder
      FROM ConcertSection
      WHERE IsActive = 1
      ORDER BY SortOrder DESC`
    );


    // 轉換資料格式
    const concerts = rows.map(row => {
      let setlist = [];
      let videoLinks = {};
      let groupPhoto = row.groupPhoto || '';

      try {
        // 解析 TrackList JSON
        if (row.trackList) {
          setlist = JSON.parse(row.trackList);
        }
        // 解析 VideoLinks JSON
        if (row.videoLinks) {
          videoLinks = JSON.parse(row.videoLinks);
        }
        // 解析 GroupPhoto JSON（如果是 JSON 字串）
        if (typeof groupPhoto === 'string') {
          const trimmed = groupPhoto.trim();
          if (
            (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
            (trimmed.startsWith('[') && trimmed.endsWith(']'))
          ) {
            try {
              groupPhoto = JSON.parse(trimmed);
            } catch (e) {
              console.error('解析 GroupPhoto JSON 失敗:', e, groupPhoto);
            }
          }
        }
      } catch (e) {
        console.error('解析 JSON 失敗:', e);
      }

      return {
        id: `concert_${String(row.id).padStart(3, '0')}`,
        concertName: row.concertName || '',
        // 所有欄位都直接從資料庫取得
        date: row.date || '',
        location: row.location || '',
        venue: row.venue || '',
        image: row.image || '',
        groupPhoto,
        emoji: row.emoji || '🎫',
        status: row.status || 'offline',
        showNumber: row.showNumber || '',
        description: row.description || '',
        videoLinks: videoLinks || {},
        setlist: setlist || []
      };
    });

    res.json(concerts);
  } catch (error) {
    console.error('獲取演唱會資料失敗:', error);
    console.error('錯誤詳情:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      errno: error.errno
    });

    // 如果是資料表不存在的錯誤，提供更明確的提示
    let errorMessage = error.message;
    if (error.code === 'ER_NO_SUCH_TABLE' || error.sqlMessage?.includes("doesn't exist")) {
      errorMessage = '資料表 ConcertSection 不存在，請先執行 npm run init:db 初始化資料庫';
    }

    res.status(500).json({
      error: '獲取演唱會資料失敗',
      message: errorMessage,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
  }
});

// 獲取綜藝節目資料（從所有分類表中合併）
app.get('/api/variety', async (req, res) => {
  try {

    // 定義所有綜藝節目表
    // tableName: 前端與 ID 使用的邏輯名稱（不要改）
    // dbTable:   實際在資料庫中的完整表名（包含資料庫名稱 zeabur.）
    const varietyTables = [
      { tableName: 'SelfMadeVariety', dbTable: 'zeabur.SelfMadeVariety', category: '自製團綜' },
      { tableName: 'DocumentaryRecord', dbTable: 'zeabur.DocumentaryRecord', category: '紀錄片' },
      { tableName: 'BirthdayRecord', dbTable: 'zeabur.BirthdayRecord', category: '生日紀錄' },
      { tableName: 'ExternalVariety', dbTable: 'zeabur.ExternalVariety', category: '外務綜藝' },
      { tableName: 'PerformanceVariety', dbTable: 'zeabur.PerformanceVariety', category: '表演' },
      { tableName: 'TfFamilyPeriodVariety', dbTable: 'zeabur.TfFamilyPeriodVariety', category: 'TF家族' },
      { tableName: 'TytPeriodVariety', dbTable: 'zeabur.TytPeriodVariety', category: '台風少年團' }
    ];

    let allVariety = [];

    // 從每個表中查詢資料
    for (const table of varietyTables) {
      try {
        let query = '';
        if (table.tableName === 'BirthdayRecord') {
          // 生日紀錄表有特殊欄位
          query = `SELECT
            ID as id,
            Title as title,
            Title2 as title2,
            AirDate as date,
            UpdatedDate as updatedDate,
            Category as category,
            Participants as participants,
            Emoji as emoji,
            Color as color,
            VideoUrl as videoUrl,
            VideoUrl2 as videoUrl2,
            VideoUrl3 as videoUrl3,
            VideoLabel1 as videoLabel1,
            VideoLabel2 as videoLabel2,
            VideoLabel3 as videoLabel3,
            CoverImage as coverImage,
            SortOrder as sortOrder
          FROM ${table.dbTable}
          WHERE IsActive = 1
          ORDER BY SortOrder ASC, AirDate DESC`;
        } else {
          // 其他表使用標準欄位
          query = `SELECT
            ID as id,
            Title as title,
            AirDate as date,
            UpdatedDate as updatedDate,
            Category as category,
            Participants as participants,
            Description as description,
            Emoji as emoji,
            Color as color,
            Episodes as episodes,
            VideoUrl as videoUrl,
            CoverImage as coverImage,
            SortOrder as sortOrder
          FROM ${table.dbTable}
          WHERE IsActive = 1
          ORDER BY SortOrder ASC, AirDate DESC`;
        }

        const [rows] = await pool.execute(query);

        // 轉換資料格式
        const variety = rows.map(row => {
          // 安全處理日期欄位（可能是字串或 Date 物件）
          let dateValue = '';
          if (row.date) {
            if (row.date instanceof Date) {
              // 轉成 YYYY-MM-DD 字串
              dateValue = row.date.toISOString().slice(0, 10);
            } else {
              dateValue = String(row.date);
            }
          }

          // 從日期字串提取年份
          let year = '';
          if (dateValue) {
            if (dateValue.includes('-')) {
              year = dateValue.split('-')[0];
            } else if (dateValue.length >= 4) {
              year = dateValue.slice(0, 4);
            }
          }

          // 安全處理 UpdatedDate（用來判斷是否顯示 NEW）
          let updatedDateValue = '';
          if (row.updatedDate) {
            if (row.updatedDate instanceof Date) {
              updatedDateValue = row.updatedDate.toISOString().slice(0, 10);
            } else {
              updatedDateValue = String(row.updatedDate);
            }
          }

          const baseData = {
            id: `variety_${table.tableName}_${row.id}`,
            tableName: table.tableName, // 添加表名標識
            title: row.title,
            name: row.title,
            date: dateValue,
            airDate: dateValue,
            updatedDate: updatedDateValue || dateValue,
            year: year || '',
            category: row.category || table.category,
            emoji: row.emoji || '📺',
            coverImage: row.coverImage || '',
            image: row.coverImage || '',
            color: row.color || '#DDA0DD',
            participants: row.participants || '',
            description: row.description || '',
            episodes: row.episodes || '',
            videoUrl: row.videoUrl || '',
            videoLinks: {} // 綜藝節目表沒有 VideoLinks 欄位，直接設為空物件
          };

          // 生日紀錄專用欄位
          if (table.tableName === 'BirthdayRecord') {
            baseData.title2 = row.title2 || '';
            baseData.videoUrl2 = row.videoUrl2 || '';
            baseData.videoLabel1 = row.videoLabel1 || '';
            baseData.videoLabel2 = row.videoLabel2 || '';
            baseData.videoUrl3 = row.videoUrl3 || '';
            baseData.videoLabel3 = row.videoLabel3 || '';
          } else {
            baseData.isNew = row.isNew || false;
          }

          return baseData;
        });

        allVariety = allVariety.concat(variety);
      } catch (tableError) {
        console.error(`查詢 ${table.tableName} 失敗:`, tableError.message);
        // 繼續處理其他表
      }
    }

    res.json(allVariety);
  } catch (error) {
    console.error('獲取綜藝節目資料失敗:', error);
    console.error('錯誤詳情:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      errno: error.errno
    });

    // 如果是資料表不存在的錯誤，提供更明確的提示
    let errorMessage = error.message;
    if (error.code === 'ER_NO_SUCH_TABLE' || error.sqlMessage?.includes("doesn't exist")) {
      errorMessage = '綜藝節目資料表不存在，請先執行 npm run init:db 初始化資料庫';
    }

    res.status(500).json({
      error: '獲取綜藝節目資料失敗',
      message: errorMessage,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
  }
});

// 獲取成員詳細資料（歌曲、綜藝、影視、獲獎）
app.get('/api/member-details/:memberCode', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { memberCode } = req.params;

    // 設定會話級別的 max_allowed_packet 為 64MB
    try {
      await connection.execute('SET SESSION max_allowed_packet = 67108864');
    } catch (setError) {
      // 如果設定失敗，繼續執行（使用伺服器預設值）
    }

    // 獲取個人歌曲
    let songsRows = [];
    try {
      [songsRows] = await connection.execute(
        `SELECT
          SongId as id,
          Title as title,
          ReleaseDate as releaseDate,
          Type as type,
          Description as description,
          AudioUrl as audioUrl,
          SongsData as songsData,
          SortOrder as sortOrder
        FROM MemberSongs
        WHERE MemberCode = ? AND IsActive = 1
        ORDER BY SortOrder ASC`,
        [memberCode]
      );
    } catch (songError) {
      console.error(`查詢歌曲資料失敗:`, songError.message);
      songsRows = [];
    }

    // 獲取綜藝節目
    let varietyRows = [];
    try {
      [varietyRows] = await connection.execute(
        `SELECT
          VarietyId as id,
          Title as title,
          Role as role,
          Year as year,
          Description as description,
          VideoUrl as videoUrl,
          SortOrder as sortOrder
        FROM MemberVariety
        WHERE MemberCode = ? AND IsActive = 1
        ORDER BY SortOrder ASC`,
        [memberCode]
      );
    } catch (varietyError) {
      console.error(`查詢綜藝資料失敗:`, varietyError.message);
      varietyRows = [];
    }

    // 獲取影視劇
    let moviesRows = [];
    try {
      [moviesRows] = await connection.execute(
        `SELECT
          MovieId as id,
          Title as title,
          Role as role,
          Year as year,
          Type as type,
          Description as description,
          SortOrder as sortOrder
        FROM MemberMovies
        WHERE MemberCode = ? AND IsActive = 1
        ORDER BY SortOrder ASC`,
        [memberCode]
      );
    } catch (movieError) {
      console.error(`查詢影視資料失敗:`, movieError.message);
      moviesRows = [];
    }

    // 獲取獲獎
    let awardsRows = [];
    try {
      [awardsRows] = await connection.execute(
        `SELECT
          AwardId as id,
          Title as title,
          Award as award,
          Year as year,
          Description as description,
          SortOrder as sortOrder
        FROM MemberAwards
        WHERE MemberCode = ? AND IsActive = 1
        ORDER BY SortOrder ASC`,
        [memberCode]
      );
    } catch (awardError) {
      console.error(`查詢獲獎資料失敗:`, awardError.message);
      awardsRows = [];
    }

    // 獲取視頻vlog
    let vlogsRows = [];
    try {
      [vlogsRows] = await connection.execute(
        `SELECT
          SeriesId as seriesId,
          SeriesName as seriesName,
          SeriesDescription as seriesDescription,
          VideosData as videosData,
          SortOrder as sortOrder
        FROM MemberVlogs
        WHERE MemberCode = ? AND IsActive = 1
        ORDER BY SortOrder ASC`,
        [memberCode]
      );
    } catch (vlogError) {
      console.error(`查詢視頻vlog資料失敗:`, vlogError.message);
      vlogsRows = [];
    }

    // 處理歌曲資料
    const songs = songsRows.map(row => {
      let songsData = null;
      try {
        if (row.songsData) {
          songsData = JSON.parse(row.songsData);
        }
      } catch (e) {
        console.error('解析 JSON 失敗:', e);
      }

      return {
        id: row.id,
        title: row.title,
        releaseDate: row.releaseDate || '',
        type: row.type || '',
        description: row.description || '',
        audioUrl: row.audioUrl || '',
        songs: songsData || null
      };
    });

    // 處理綜藝節目資料
    const variety = varietyRows.map(row => {
      return {
        id: row.id,
        title: row.title,
        role: row.role || '',
        year: row.year || '',
        description: row.description || '',
        videoUrl: row.videoUrl || ''
      };
    });

    // 處理影視劇資料
    const movies = moviesRows.map(row => {
      return {
        id: row.id,
        title: row.title,
        role: row.role || '',
        year: row.year || '',
        type: row.type || '',
        description: row.description || ''
      };
    });

    // 處理獲獎資料
    const awards = awardsRows.map(row => {
      return {
        id: row.id,
        title: row.title,
        award: row.award || '',
        year: row.year || '',
        description: row.description || ''
      };
    });

    // 處理視頻vlog資料（參考 MemberSongs 中專輯的處理方式）
    const vlogs = vlogsRows.map(row => {
      let videosData = null;
      try {
        if (row.videosData) {
          videosData = JSON.parse(row.videosData);
          // 按 sortOrder 排序
          videosData.sort((a, b) => {
            if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
              return a.sortOrder - b.sortOrder;
            }
            return 0;
          });
        }
      } catch (e) {
        console.error('解析 VideosData JSON 失敗:', e);
      }

      return {
        seriesId: row.seriesId,
        seriesName: row.seriesName,
        description: row.seriesDescription || '',
        videos: videosData || [],
        sortOrder: row.sortOrder
      };
    }).sort((a, b) => a.sortOrder - b.sortOrder); // 按系列排序

    const result = {
      memberCode,
      songs: songs || [],
      variety: variety || [],
      movies: movies || [],
      awards: awards || [],
      vlogs: vlogs || []
    };

    res.json(result);
  } catch (error) {
    console.error('獲取成員詳細資料失敗:', error);
    console.error('錯誤詳情:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      errno: error.errno
    });

    let errorMessage = error.message;
    if (error.code === 'ER_NO_SUCH_TABLE' || error.sqlMessage?.includes("doesn't exist")) {
      errorMessage = '成員詳細資料表不存在，請先執行 npm run init:db 初始化資料庫';
    } else if (error.code === 'ER_MALFORMED_PACKET') {
      errorMessage = '資料封包格式錯誤，可能是資料過大或連接問題。請檢查資料庫連接設定。';
    }

    // 即使錯誤，也返回空資料結構（狀態碼 200），讓前端知道查詢已執行
    // 這樣前端就不會回退到本地資料
    res.status(200).json({
      memberCode: memberCode || req.params.memberCode,
      songs: [],
      variety: [],
      movies: [],
      awards: [],
      vlogs: [],
      error: errorMessage,
      warning: '部分資料載入失敗，顯示空資料'
    });
  } finally {
    // 確保連接被釋放
    if (connection) {
      connection.release();
    }
  }
});

// 獲取團體資訊
app.get('/api/group-info', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        GroupName as groupName,
        GroupNameEn as groupNameEn,
        FanName as fanName,
        DebutDate as debutDate,
        Description as description,
        Content as content,
        Announcement as announcement
      FROM GroupInfo
      LIMIT 1`
    );

    res.json(rows.length > 0 ? rows[0] : null);
  } catch (error) {
    console.error('獲取團體資訊失敗:', error);
    res.status(500).json({ error: '獲取團體資訊失敗' });
  }
});

// 獲取所有表中最新的更新日期
app.get('/api/latest-update', async (req, res) => {
  try {
    // 查詢所有有 UpdatedDate 欄位的表，找出最新的更新日期（只取年月日，格式為 YYYY-MM-DD）
    const query = `
      SELECT DATE_FORMAT(MAX(DATE(UpdatedDate)), '%Y-%m-%d') as latestDate FROM (
        SELECT UpdatedDate FROM zeabur.Members WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.GroupHonors WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.MusicSection WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.ConcertSection WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.SelfMadeVariety WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.DocumentaryRecord WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.BirthdayRecord WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.ExternalVariety WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.PerformanceVariety WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.TfFamilyPeriodVariety WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.TytPeriodVariety WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.MemberSongs WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.MemberVariety WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.MemberMovies WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.MemberAwards WHERE IsActive = 1
        UNION ALL
        SELECT UpdatedDate FROM zeabur.MemberVlogs WHERE IsActive = 1
      ) AS all_dates
    `;

    const [rows] = await pool.execute(query);
    const latestDate = rows[0]?.latestDate || null;

    // 確保回傳 YYYY-MM-DD 格式的字串，不轉換時區
    let formattedDate = null;
    if (latestDate) {
      // 如果是 Date 物件，使用 DATE_FORMAT 或直接格式化
      if (latestDate instanceof Date) {
        // 直接從 Date 物件提取年月日數字，不轉換時區
        const year = latestDate.getFullYear();
        const month = String(latestDate.getMonth() + 1).padStart(2, '0');
        const day = String(latestDate.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      } else {
        // 如果是字串，嘗試解析
        const dateStr = String(latestDate);
        // 如果是 YYYY-MM-DD 格式，直接使用
        if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
          formattedDate = dateStr.slice(0, 10);
        } else {
          // 嘗試解析為 Date 物件
          const dateObj = new Date(dateStr);
          if (!Number.isNaN(dateObj.getTime())) {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
          } else {
            formattedDate = dateStr.slice(0, 10);
          }
        }
      }
    }

    res.json({ latestDate: formattedDate });
  } catch (error) {
    console.error('獲取最新更新日期失敗:', error);
    res.status(500).json({
      error: '獲取最新更新日期失敗',
      message: error.message
    });
  }
});

// 獲取 Feedback 配置
app.get('/api/feedback-config', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { configType } = req.query;

    console.log('收到 Feedback 配置請求:', { configType });

    let query = `SELECT ConfigType, ConfigKey, ConfigValue, Label, SortOrder
                 FROM FeedbackConfig`;
    let params = [];

    if (configType) {
      query += ` WHERE ConfigType = ?`;
      params.push(configType);
    }

    query += ` ORDER BY ConfigType, SortOrder, ConfigKey`;

    console.log('執行 SQL 查詢:', query, params);

    const [rows] = await connection.execute(query, params);

    console.log('查詢結果筆數:', rows.length);

    // 將結果組織成物件格式
    const config = {
      pageOptions: [],
      typeOptions: [],
      deliveryOptions: [],
      deliveryTemplates: {},
      placeholderTemplates: {}
    };

    rows.forEach((row, index) => {
      console.log(`處理第 ${index + 1} 筆資料:`, {
        ConfigType: row.ConfigType,
        ConfigKey: row.ConfigKey,
        ConfigValue: row.ConfigValue?.substring(0, 50),
        Label: row.Label
      });

      const option = {
        label: row.Label || row.ConfigValue,
        value: row.ConfigValue
      };

      switch (row.ConfigType) {
        case 'pageOptions':
          config.pageOptions.push(option);
          console.log(`  → 加入 pageOptions: ${option.label}`);
          break;
        case 'typeOptions':
          config.typeOptions.push(option);
          console.log(`  → 加入 typeOptions: ${option.label}`);
          break;
        case 'deliveryOptions':
          config.deliveryOptions.push(option);
          console.log(`  → 加入 deliveryOptions: ${option.label}`);
          break;
        case 'deliveryTemplates':
          config.deliveryTemplates[row.ConfigKey] = row.ConfigValue;
          console.log(`  → 加入 deliveryTemplates[${row.ConfigKey}]`);
          break;
        case 'placeholderTemplates':
          config.placeholderTemplates[row.ConfigKey] = row.ConfigValue;
          console.log(`  → 加入 placeholderTemplates[${row.ConfigKey}]`);
          break;
        default:
          console.warn(`  ⚠️  未知的 ConfigType: ${row.ConfigType}`);
      }
    });

    console.log('返回配置統計:', {
      pageOptions: config.pageOptions.length,
      typeOptions: config.typeOptions.length,
      deliveryOptions: config.deliveryOptions.length,
      deliveryTemplates: Object.keys(config.deliveryTemplates).length,
      placeholderTemplates: Object.keys(config.placeholderTemplates).length
    });

    // 驗證配置是否完整
    if (config.pageOptions.length === 0) {
      console.warn('⚠️  pageOptions 為空，請檢查資料庫中 ConfigType = "pageOptions" 的資料');
    }
    if (config.typeOptions.length === 0) {
      console.warn('⚠️  typeOptions 為空，請檢查資料庫中 ConfigType = "typeOptions" 的資料');
    }

    console.log('返回完整配置結構:', JSON.stringify(config, null, 2).substring(0, 500) + '...');

    res.json(config);
  } catch (error) {
    console.error('獲取 Feedback 配置失敗:', error);
    console.error('錯誤詳情:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    });

    res.status(500).json({
      error: '獲取配置失敗',
      message: error.message || '資料庫查詢失敗',
      details: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        sqlMessage: error.sqlMessage
      } : undefined
    });
  } finally {
    connection.release();
  }
});

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API 服務運行中' });
});

// 測試資料庫連接
async function testDatabaseConnection() {
  try {
    const [rows] = await pool.execute('SELECT 1 as test');
    console.log('✅ 資料庫連接測試成功');
    return true;
  } catch (error) {
    console.error('❌ 資料庫連接測試失敗:', error.message);
    console.error('資料庫設定:', {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    });
    return false;
  }
}

app.listen(PORT, async () => {
  console.log(`API 服務運行在 http://localhost:${PORT}`);
  console.log(`健康檢查: http://localhost:${PORT}/api/health`);
  console.log('正在測試資料庫連接...');
  await testDatabaseConnection();
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被佔用！`);
    console.error('解決方法：');
    console.error(`1. 關閉佔用端口的進程: netstat -ano | findstr :${PORT}`);
    console.error(`2. 或使用其他端口: PORT=3004 npm run dev:api`);
    process.exit(1);
  } else {
    console.error('伺服器啟動失敗:', err);
    process.exit(1);
  }
});

export default app;

