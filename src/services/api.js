// API 服務 - 連接 Zeabur MySQL 資料庫
import axios from 'axios';

// API 基礎 URL（從環境變數讀取，如果沒有則使用相對路徑）
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// 建立 axios 實例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

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
      const response = await api.get('/feedback-config', { params });
      return response.data;
    } catch (error) {
      console.error('獲取 Feedback 配置失敗:', error);
      throw error;
    }
  }
};

export default apiService;

