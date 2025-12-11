# TNT 粉絲網站部署指南

## 🚀 部署選項

### 1. Vercel 部署（推薦 - 免費且簡單）

#### 步驟：
1. 註冊 [Vercel](https://vercel.com) 帳號
2. 連接您的 GitHub 帳號
3. 匯入您的專案
4. 設定建置命令：`npm run build`
5. 設定輸出目錄：`dist`
6. 點擊部署

#### 優點：
- 免費額度充足
- 自動 HTTPS
- 全球 CDN
- 自動部署（Git push 觸發）
- 自訂網域支援

### 2. Netlify 部署

#### 步驟：
1. 註冊 [Netlify](https://netlify.com) 帳號
2. 連接 GitHub 並選擇專案
3. 建置設定：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 點擊部署

#### 優點：
- 免費額度
- 表單處理
- 分支預覽
- 自訂網域

### 3. GitHub Pages 部署

#### 步驟：
1. 在專案根目錄建立 `.github/workflows/deploy.yml`
2. 推送程式碼到 GitHub
3. 在 GitHub 設定中啟用 Pages

### 4. 自架伺服器部署

#### 使用 Nginx：
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📋 部署前準備

### 1. 建置專案
```bash
npm run build
```

### 2. 測試建置結果
```bash
npm run preview
```

### 3. 檢查檔案大小
建置完成後檢查 `dist` 資料夾大小，確保在合理範圍內。

## 🔧 環境變數設定

如果需要環境變數，建立 `.env.production` 檔案：

```env
VITE_APP_TITLE=TNT 粉絲網站
VITE_APP_VERSION=1.0.0
```

## 📱 效能優化

### 已完成的優化：
- 程式碼分割
- 圖片壓縮
- 快取策略
- 最小化 CSS/JS

### 建議的額外優化：
- 使用 WebP 圖片格式
- 啟用 Gzip 壓縮
- 設定適當的快取標頭

## 🌐 自訂網域設定

### 1. 購買網域
推薦平台：
- Namecheap
- GoDaddy
- Cloudflare

### 2. DNS 設定
將網域指向您的部署平台：
- Vercel: 設定 CNAME 記錄
- Netlify: 設定 A 記錄或 CNAME

### 3. SSL 憑證
大部分平台會自動提供免費 SSL 憑證。

## 📊 監控和分析

### 建議工具：
- Google Analytics
- Vercel Analytics
- Hotjar（使用者行為分析）

## 🚨 常見問題

### 1. 路由問題
確保設定正確的 fallback 到 index.html

### 2. 圖片載入問題
檢查圖片路徑是否正確

### 3. 效能問題
使用開發者工具檢查載入時間

## 📞 技術支援

如果遇到問題，可以：
1. 檢查瀏覽器控制台錯誤
2. 查看部署平台日誌
3. 確認建置是否成功
