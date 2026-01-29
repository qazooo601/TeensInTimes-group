// 資料庫服務 - 通過 API 連接資料庫
import axios from 'axios';

// API 基礎 URL（從環境變數讀取）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003';

// 建立 axios 實例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 增加到 60 秒，因為查詢可能包含大量資料
  headers: {
    'Content-Type': 'application/json'
  }
});

// 資料庫服務函數
export const dbService = {
  // 獲取所有成員資料
  async getMembers() {
    try {
      const response = await api.get('/api/members');
      return response.data;
    } catch (error) {
      console.error('獲取成員資料失敗:', error);
      if (error.response) {
        console.error('後端錯誤詳情:', error.response.data);
        // 將後端的錯誤訊息傳遞給前端
        const backendError = error.response.data;
        throw new Error(backendError.message || backendError.error || '獲取成員資料失敗');
      }
      throw error;
    }
  },

  // 獲取團體榮譽資料
  async getGroupHonors() {
    try {
      const response = await api.get('/api/honors');
      return response.data;
    } catch (error) {
      console.error('獲取榮譽資料失敗:', error);
      if (error.response) {
        console.error('後端錯誤詳情:', error.response.data);
        // 將後端的錯誤訊息傳遞給前端
        const backendError = error.response.data;
        throw new Error(backendError.message || backendError.error || '獲取榮譽資料失敗');
      }
      throw error;
    }
  },

  // 獲取團體資訊
  async getGroupInfo() {
    try {
      const response = await api.get('/api/group-info');
      return response.data;
    } catch (error) {
      console.error('獲取團體資訊失敗:', error);
      if (error.response) {
        console.error('後端錯誤詳情:', error.response.data);
        // 將後端的錯誤訊息傳遞給前端
        const backendError = error.response.data;
        throw new Error(backendError.message || backendError.error || '獲取團體資訊失敗');
      }
      throw error;
    }
  },

  // 獲取音樂資料
  async getMusic() {
    try {
      const response = await api.get('/api/music');
      return response.data;
    } catch (error) {
      console.error('獲取音樂資料失敗:', error);
      if (error.response) {
        console.error('後端錯誤詳情:', error.response.data);
        // 將後端的錯誤訊息傳遞給前端
        const backendError = error.response.data;
        throw new Error(backendError.message || backendError.error || '獲取音樂資料失敗');
      }
      throw error;
    }
  },

  // 獲取演唱會資料
  async getConcerts() {
    try {
      const response = await api.get('/api/concerts');
      return response.data;
    } catch (error) {
      console.error('獲取演唱會資料失敗:', error);
      if (error.response) {
        console.error('後端錯誤詳情:', error.response.data);
        // 將後端的錯誤訊息傳遞給前端
        const backendError = error.response.data;
        throw new Error(backendError.message || backendError.error || '獲取演唱會資料失敗');
      }
      throw error;
    }
  },

  // 獲取綜藝節目資料
  async getVariety() {
    try {
      const response = await api.get('/api/variety');
      return response.data;
    } catch (error) {
      console.error('獲取綜藝節目資料失敗:', error);
      if (error.response) {
        console.error('後端錯誤詳情:', error.response.data);
        // 將後端的錯誤訊息傳遞給前端
        const backendError = error.response.data;
        throw new Error(backendError.message || backendError.error || '獲取綜藝節目資料失敗');
      }
      throw error;
    }
  },

  // 獲取首頁照片
  async getHomePhotos() {
    try {
      const response = await api.get('/api/home-photos');
      return response.data;
    } catch (error) {
      console.error('獲取首頁照片失敗:', error);
      if (error.response) {
        console.error('後端錯誤詳情:', error.response.data);
        const backendError = error.response.data;
        throw new Error(backendError.message || backendError.error || '獲取首頁照片失敗');
      }
      throw error;
    }
  },

  // 獲取成員詳細資料
  async getMemberDetails(memberCode) {
    try {
      const response = await api.get(`/api/member-details/${memberCode}`);
      return response.data;
    } catch (error) {
      console.error('獲取成員詳細資料失敗:', error);
      if (error.response) {
        console.error('後端錯誤詳情:', error.response.data);
        // 將後端的錯誤訊息傳遞給前端
        const backendError = error.response.data;
        throw new Error(backendError.message || backendError.error || '獲取成員詳細資料失敗');
      }
      throw error;
    }
  },

  // 獲取最新更新日期
  async getLatestUpdate() {
    try {
      const response = await api.get('/api/latest-update');
      return response.data.latestDate;
    } catch (error) {
      console.error('獲取最新更新日期失敗:', error);
      if (error.response) {
        console.error('後端錯誤詳情:', error.response.data);
        const backendError = error.response.data;
        throw new Error(backendError.message || backendError.error || '獲取最新更新日期失敗');
      }
      throw error;
    }
  }
};

export default dbService;

