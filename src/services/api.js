// API 服務 - 連接 Zeabur MySQL 資料庫
import axios from 'axios';

// API 基礎 URL（從環境變數讀取）
// 如果沒有設置，使用相對路徑（適用於同域名下的 API）
// 如果設置了完整 URL（如 http://localhost:3003），則使用完整 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
      const response = await api.get('/members');
      return response.data;
    } catch (error) {
      console.error('獲取成員資料失敗:', error);
      throw error;
    }
  },

  // 獲取團體榮譽資料
  async getGroupHonors() {
    try {
      const response = await api.get('/honors');
      return response.data;
    } catch (error) {
      console.error('獲取榮譽資料失敗:', error);
      throw error;
    }
  },

  // 獲取團體資訊
  async getGroupInfo() {
    try {
      const response = await api.get('/group-info');
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
      console.log('發送 API 請求:', {
        url: '/feedback-config',
        baseURL: API_BASE_URL,
        params
      });

      const response = await api.get('/feedback-config', { params });

      console.log('API 回應:', {
        status: response.status,
        data: response.data
      });

      if (!response.data) {
        throw new Error('API 回應資料為空');
      }

      return response.data;
    } catch (error) {
      console.error('獲取 Feedback 配置失敗:', error);
      if (error.response) {
        // 伺服器回應了錯誤狀態碼
        console.error('伺服器錯誤:', {
          status: error.response.status,
          data: error.response.data
        });
        throw new Error(error.response.data?.message || `伺服器錯誤：${error.response.status}`);
      } else if (error.request) {
        // 請求已發送但沒有收到回應
        console.error('無伺服器回應:', error.request);
        throw new Error('無法連接到伺服器，請檢查 API 端點配置');
      } else {
        // 其他錯誤
        console.error('請求設定錯誤:', error.message);
        throw error;
      }
    }
  }
};

export default apiService;

