// API 服務 - 連接 Zeabur MySQL 資料庫
import axios from 'axios';

// API 基礎 URL（從環境變數讀取）
// 與 database.js 保持一致，確保所有 API 請求使用相同的基礎 URL
// 如果沒有設置，使用與 database.js 相同的預設值（Zeabur 生產環境 URL）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://teensintimes-backend.zeabur.app';

// 建立 axios 實例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加請求攔截器來記錄請求
api.interceptors.request.use(
  (config) => {
    console.log('API 請求:', {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加回應攔截器來記錄回應
api.interceptors.response.use(
  (response) => {
    console.log('API 回應:', {
      status: response.status,
      url: response.config.url,
      dataKeys: Object.keys(response.data || {})
    });
    return response;
  },
  (error) => {
    console.error('API 錯誤:', {
      message: error.message,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// API 服務函數
export const apiService = {
  // 獲取所有成員資料
  async getMembers() {
    try {
      const response = await api.get('/api/members');
      return response.data;
    } catch (error) {
      console.error('獲取成員資料失敗:', error);
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
      throw error;
    }
  },

  // 獲取 Feedback 配置
  async getFeedbackConfig(configType = null) {
    try {
      const params = configType ? { configType } : {};
      const response = await api.get('/api/feedback-config', { params });
      return response.data;
    } catch (error) {
      console.error('獲取 Feedback 配置失敗:', error);
      throw error;
    }
  }
};

export default apiService;

