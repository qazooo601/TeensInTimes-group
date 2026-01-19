// Firebase 配置
// 用於跨裝置統一計數

import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// 從環境變數讀取配置（更安全）
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// 檢查 Firebase 是否已配置
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.databaseURL && 
  firebaseConfig.projectId;

// 只有在配置完整時才初始化 Firebase
let app = null;
let database = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
  } catch (error) {
    console.warn('Firebase 初始化失敗:', error);
    console.warn('將使用 localStorage 作為備用方案');
  }
} else {
  console.warn('Firebase 未配置，將使用 localStorage（僅限單一裝置）');
  console.warn('如需跨裝置統一計數，請設置 Firebase 環境變數');
}

// 導出 database（可能為 null）
export { database };

