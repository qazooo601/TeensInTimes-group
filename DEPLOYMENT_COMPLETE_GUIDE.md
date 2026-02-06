# 🚀 TNT 粉絲網站完整部署指南

## 📋 使用的服務與技術

根據您的專案配置，以下是您正在使用的服務和技術：

### 🌐 部署平台
- **Zeabur** - 主要部署平台
  - 前端服務（React 應用）
  - 後端 API 服務（Node.js/Express）
  - MySQL 資料庫服務

### 🗄️ 資料庫
- **MySQL** - 儲存所有資料（成員、音樂、演唱會、綜藝節目等）
- **Zeabur MySQL** - 託管在 Zeabur 上的 MySQL 服務

### 📧 郵件服務
- **EmailJS** - 處理回饋表單的郵件發送

### 🔍 SEO 優化
- **robots.txt** - 搜尋引擎爬蟲規則
- **sitemap.xml** - 網站地圖
- **Meta 標籤** - SEO 和社交媒體分享優化

### 🛠️ 技術棧
- **前端**：React + Vite + Ant Design
- **後端**：Node.js + Express
- **容器化**：Docker（Dockerfile 和 Dockerfile.api）

---

## 🎯 完整部署流程

### 第一階段：準備工作

#### 1.1 確認專案狀態
- [ ] 所有代碼已提交到 GitHub
- [ ] 本地測試通過（`npm run build` 成功）
- [ ] 環境變數配置已準備

#### 1.2 準備環境變數資訊
您需要準備以下資訊：
- MySQL 資料庫連接資訊（從 Zeabur MySQL 服務獲取）
- EmailJS 配置資訊（如果需要回饋表單功能）

---

### 第二階段：在 Zeabur 部署服務

#### 步驟 1：部署 MySQL 資料庫服務

1. **登入 Zeabur**
   - 前往 [Zeabur 官網](https://zeabur.com)
   - 使用 GitHub 帳號登入

2. **建立新專案**
   - 點擊 **Create Project**
   - 輸入專案名稱（例如：`TNTapp`）
   - 選擇地區（建議：**Asia Pacific**）

3. **部署 MySQL 服務**
   - 在專案中點擊 **Deploy New Service**
   - 選擇 **MySQL** 或 **Database**
   - 等待服務建立完成

4. **記錄資料庫連接資訊**
   - 進入 MySQL 服務頁面
   - 找到「**資料庫**」或「**Database**」分頁
   - 記下以下資訊：
     ```
     Host:(至別的裝置看)
     Port:
     User:
     Password:
     Database:
     ```
   - **重要：將這些資訊保存好，等一下要用！**

---

#### 步驟 2：部署後端 API 服務

1. **建立 API 服務**
   - 在專案中點擊 **Deploy New Service**
   - 選擇 **Deploy from GitHub**
   - 選擇您的 `TNTapp` 儲存庫
   - 選擇分支（通常是 `main` 或 `master`）

2. **配置建置方案**
   - 當出現「**建置方案預覽**」時，點擊「**配置**」
   - 設定以下選項：
     - **Dockerfile**：`Dockerfile.api`
     - **啟動指令**：`node server/api.js`
     - **根目錄**：`/`
   - 點擊「**部署**」

   **如果沒有配置選項：**
   - 先直接點「**部署**」
   - 部署完成後，進入服務的「**設定**」分頁
   - 修改：
     - **Dockerfile**：`Dockerfile.api`(複製`Dockerfile.api`的文字內容)
     - **啟動指令**：`node server/api.js`

3. **設定環境變數**
   在專案根目錄建立 `.env` 檔案：

   - 進入 API 服務頁面
   - 點擊「**環境變數**」或「**Variables**」分頁
   - 新增以下 5 個環境變數（使用步驟 1 記錄的資料庫資訊）：
     ```text
     DB_HOST=sjc1.clusters.zeabur.com
     DB_PORT=22919
     DB_USER=root
     DB_PASSWORD=你的密碼
     DB_NAME=zeabur
     ```
   - 點擊「**儲存**」
   - Zeabur 會自動重新部署

4. **啟用公有網路**
   - 在 API 服務頁面，點擊「**網路**」或「**Network**」分頁
   - 在「**公有網路**」區塊中，點擊「**啟用**」或「**Generate Domain**」
   - Zeabur 會生成一個公開網址，例如：`https://teensintimes-backend.zeabur.app`(或自定義)
   - **記下這個網址！**（前端要用）

5. **驗證 API 服務**
   - 在瀏覽器打開：`https://你的-api網址.zeabur.app/api/health`
   - 應該會看到：
     ```json
     {"status":"ok","message":"API 服務運行中"}
     ```
   - 檢查服務日誌（「**記錄**」分頁），應該會看到：
     ```
     📊 資料庫連接設定: { source: '環境變數' }
     ✅ 資料庫連接測試成功
     ```
6. **啟動服務**
    - 方式一：同時啟動前端和後端（推薦）

    ```bash
    npm run dev:all
    ```

    這會同時啟動：
    - 前端開發伺服器：`http://localhost:5173`
    - 後端 API 服務：`http://localhost:3001`

📁 檔案結構

```
TNTapp/
├── server/
│   └── api.js              # 後端 API 服務
├── src/
│   ├── services/
│   │   ├── api.js         # API 服務（備用）
│   │   └── database.js    # 資料庫服務（通過 API）
│   └── pages/
│       └── Home.jsx       # 修改後的首頁（從資料庫讀取）
└── .env                   # 環境變數設定
```
7. **🚀 在 Zeabur 上部署**
   - 後端 API 服務部署

   1. 在 Zeabur 建立新的服務
   2. 選擇 Node.js 環境
   3.  設定環境變數（DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME）
   4.  設定啟動命令：`node server/api.js`
   5.  設定端口：3001

    #### 前端設定
        在 Zeabur 的前端服務環境變數中設定：
    ```
    VITE_API_BASE_URL=https://your-api-service.zeabur.app
    ```
---

#### 步驟 3：部署前端服務

1. **建立前端服務**
   - 在專案中點擊 **Deploy New Service**
   - 選擇 **Deploy from GitHub**
   - 選擇您的 `TNTapp` 儲存庫
   - 選擇分支（通常是 `main` 或 `master`）

2. **配置建置方案**
   - Zeabur 會自動檢測到 `Dockerfile`
   - 確認配置：
     - **Dockerfile**：`Dockerfile`（前端專用）
     - **根目錄**：`/`
   - 點擊「**部署**」

3. **設定環境變數**
   - 進入前端服務頁面
   - 點擊「**環境變數**」或「**Variables**」分頁
   - 新增環境變數：
     ```text
     VITE_API_BASE_URL=https://你的-api網址.zeabur.app
     ```
   - **重要**：
     - 不要加 `/api` 結尾
     - 使用步驟 2 中記錄的 API 公開網址
     - 例如：`VITE_API_BASE_URL=https://teensintimes-backend.zeabur.app`
   - 點擊「**儲存**」
   - Zeabur 會自動重新建置和部署前端

4. **生成前端網址**
   - 在服務頁面的「**Domain**」區塊
   - 點擊 **Generate Domain**
   - 系統會自動給您一個免費網址，例如：`https://tnt-website.zeabur.app`

---

### 第三階段：初始化資料庫

#### 步驟 4：初始化資料庫結構

1. **本地執行初始化**
   ```bash
   npm run init:db
   ```
   這會執行 `init-database.js`，建立所有必要的資料表。

2. **或手動執行 SQL**
   - 在 Zeabur MySQL 服務中，找到資料庫管理介面
   - 執行 `init-database.sql` 中的 SQL 語句

3. **驗證資料表**
   確認以下資料表已建立：
   - `Members` - 成員資料
   - `GroupHonors` - 團體榮譽
   - `HomePhotos` - 首頁照片
   - `MusicSection` - 音樂資料
   - `ConcertSection` - 演唱會資料
   - `SelfMadeVariety`, `DocumentaryRecord`, `BirthdayRecord` 等 - 綜藝節目資料表
   - `MemberSongs`, `MemberVariety`, `MemberMovies`, `MemberAwards` - 成員詳細資料表

---

### 第四階段：配置 EmailJS（可選）

如果您需要回饋表單功能：

#### 步驟 5：設定 EmailJS

1. **註冊 EmailJS 帳號**
   - 前往 [EmailJS 官網](https://www.emailjs.com/)
   - 註冊免費帳號（每月 200 封郵件）

2. **添加郵件服務**
   - 在 EmailJS 儀表板，點擊 **Email Services**
   - 點擊 **Add New Service**
   - **推薦：使用 Gmail 自訂 SMTP**
     - 選擇 **Gmail（自訂 SMTP）** 或 **Other（自訂 SMTP）**
     - 設定：
       - SMTP 伺服器：`smtp.gmail.com`
       - SMTP 端口：`587`
       - SMTP 用戶名：您的 Gmail 完整郵箱
       - SMTP 密碼：Gmail 應用程式專用密碼（見下方說明）
     - 記下 **Service ID**

3. **獲取 Gmail 應用程式專用密碼**
   - 前往 [Google 帳戶設定](https://myaccount.google.com/)
   - 點擊 **安全性** → **兩步驟驗證**（需先啟用）
   - 找到 **應用程式密碼**
   - 選擇「郵件」和「其他（自訂名稱）」
   - 輸入名稱（例如：EmailJS）
   - 複製生成的 16 位數密碼

4. **創建郵件模板**
   - 在 EmailJS 儀表板，點擊 **Email Templates**
   - 點擊 **Create New Template**
   - 使用以下變數：
    ```
    主題：{{subject}}

    來自：{{from_email}}

    回饋內容：
    {{message}}

    ---
    詳細資訊：
    畫面：{{page}}
    修改類別：{{type}}
    詳細內容：{{content}}
    用戶郵箱：{{user_email}}
    ```
   - 保存模板並記下 **Template ID**（例如：`template_xxxxxxx`）

5. **獲取 Public Key**
   - 在 EmailJS 儀表板，點擊 **Account** → **General**
   - 複製 **Public Key**

6. **設定前端環境變數 / .env**
   - 在 Zeabur 前端服務的「**環境變數**」分頁
   - 新增以下環境變數：
     ```text
     VITE_EMAILJS_SERVICE_ID=your_service_id
     VITE_EMAILJS_TEMPLATE_ID=your_template_id
     VITE_EMAILJS_PUBLIC_KEY=your_public_key
     VITE_RECEIVER_EMAIL=your_email@example.com
     ```
   - 點擊「**儲存**」

**注意：** `.env` 文件不應該提交到 Git。如果專案中已有 `.gitignore`，請確保 `.env` 已被包含。

### 環境變數未生效
- 確保環境變數名稱以 `VITE_` 開頭（Vite 專案要求）
- 重新啟動開發伺服器
- 清除瀏覽器快取
---

### 第五階段：SEO 優化配置

#### 步驟 6：設定 SEO

1. **更新網域名稱**

   在以下文件中，將 `yourdomain.com` 替換為您的實際網址：

   **文件 1：`public/robots.txt`**
   ```txt
   Sitemap: https://your-actual-domain.zeabur.app/sitemap.xml
   ```

   **文件 2：`public/sitemap.xml`**
   - 將所有 `<loc>` 標籤中的 `https://yourdomain.com` 替換為您的實際網址
   - 共 6 處需要修改

   **文件 3：`index.html`**
   ```html
   <meta property="og:url" content="https://your-actual-domain.zeabur.app/" />
   <meta property="twitter:url" content="https://your-actual-domain.zeabur.app/" />
   <link rel="canonical" href="https://your-actual-domain.zeabur.app/" />
   ```

2. **提交到 Google Search Console**
   - 前往 [Google Search Console](https://search.google.com/search-console/)
   - 新增資源（網站）
   - 驗證網站所有權（HTML 標籤方式）
   - 提交 sitemap：`https://your-domain.com/sitemap.xml`
   - 使用「網址檢查」工具要求建立索引

---

### 第六階段：測試與驗證

#### 步驟 7：完整功能測試

1. **測試前端網站**
   - 打開前端網站網址
   - 測試所有頁面路由
   - 確認圖片載入正常
   - 測試響應式設計（行動裝置）

2. **測試 API 連接**
   - 按 `F12` 打開開發者工具
   - 點擊「**Network**」分頁
   - 重新整理頁面
   - 檢查以下 API 請求是否為 `200`：
     - `/api/members`
     - `/api/honors`
     - `/api/home-photos`
     - `/api/music`
     - `/api/concerts`
     - `/api/variety`

3. **測試資料顯示**
   - **Home 頁面**：
     - ✅ 「團體成員」卡片有顯示成員
     - ✅ 「團體榮譽」有顯示榮譽列表
     - ✅ 照片輪播有顯示
   - **Members 頁面**：
     - ✅ 所有成員列表正常顯示
   - **MemberDetail 頁面**：
     - ✅ 「個人單曲」有內容
     - ✅ 「個人外務」有內容
     - ✅ 「影視作品」有內容
     - ✅ 「獲獎」有內容

4. **測試回饋表單**（如果已配置 EmailJS）
   - 訪問回饋頁面
   - 填寫表單並提交
   - 確認收到郵件

---

### 第七階段：自訂網域（可選）

#### 步驟 8：設定自訂網域

1. **購買網域**
   - 推薦平台：Namecheap、GoDaddy、Cloudflare

2. **在 Zeabur 添加網域**
   - 在前端服務頁面的「**Domain**」區塊
   - 點擊 **Add Domain**
   - 輸入您的網域名稱（例如：`www.tnt-fan.com`）

3. **設定 DNS**
   前往您的網域提供商設定 DNS：

   **設定 CNAME 記錄：**
   ```
   類型：CNAME
   名稱：www
   值：<Zeabur 提供的 CNAME 值>
   TTL：3600
   ```

   **設定根網域（可選）：**
   ```
   類型：A
   名稱：@
   值：<Zeabur 提供的 IP>
   ```

4. **等待驗證**
   - 等待 DNS 傳播（通常 5-30 分鐘）
   - Zeabur 會自動驗證網域
   - 驗證成功後，SSL 憑證會自動配置

---

## 🔄 自動部署

設定完成後，每次您推送程式碼到 GitHub：

1. ✅ Zeabur 會自動偵測更新
2. ✅ 自動重新建置 Docker 映像
3. ✅ 自動部署新版本
4. ✅ 零停機時間切換

---

## 🚨 常見問題排除

### 問題 1：API 服務 502 Bad Gateway

**排查步驟：**
1. 檢查 API 服務狀態是否為「運作中」
2. 查看 API 服務的「**記錄**」分頁，找出錯誤
3. 確認環境變數已正確設定
4. 確認資料庫連接成功（日誌中應顯示 `✅ 資料庫連接測試成功`）
5. 確認公有網路已啟用

**常見錯誤：**
- `ECONNREFUSED` → 資料庫連接失敗，檢查環境變數
- `Cannot find module` → 依賴未安裝，檢查 Dockerfile.api
- `EADDRINUSE` → Port 衝突，確認使用 `process.env.PORT`

### 問題 2：前端顯示空資料

**排查步驟：**
1. 確認 `VITE_API_BASE_URL` 已在前端服務設定
2. 確認值正確（不要加 `/api`）
3. 在瀏覽器 Network 檢查 API 請求網址
4. 確認 API 服務的公有網路已啟用
5. 測試 API 健康檢查端點是否可訪問

### 問題 3：資料庫連接失敗

**排查步驟：**
1. 確認在 API 服務設定了環境變數（不是在 MySQL 服務）
2. 確認環境變數名稱正確：`DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PASSWORD`、`DB_NAME`
3. 確認 MySQL 服務狀態是「運作中」
4. 查看 API 服務的 Logs，確認 `source: '環境變數'`

### 問題 4：圖片無法顯示

**排查步驟：**
1. 確認圖片檔案在 `public/images/` 目錄
2. 確認圖片路徑正確
3. 確認 `.dockerignore` 沒有排除圖片資料夾
4. 檢查 API 服務的靜態文件服務是否正常

### 問題 5：路由 404 錯誤

**解決方法：**
- 已在 Dockerfile 中設定好 nginx 轉發規則
- 如果還有問題，檢查日誌中的錯誤訊息

---

## 📊 監控與維護

### 定期檢查項目

1. **服務狀態**
   - 每週檢查 Zeabur 專案中的服務狀態
   - 確認所有服務都是「運作中」

2. **資源使用**
   - 在 Zeabur 專案頁面查看「**Usage**」
   - 監控 CPU、記憶體、網路流量

3. **日誌檢查**
   - 定期查看 API 服務的日誌
   - 檢查是否有錯誤訊息

4. **資料庫備份**
   - 定期備份 MySQL 資料庫
   - 在 Zeabur MySQL 服務中設定自動備份

### SEO 監控

1. **Google Search Console**
   - 每週檢查索引狀態
   - 查看搜尋曝光和點擊率
   - 檢查是否有錯誤

2. **網站速度**
   - 使用 [PageSpeed Insights](https://pagespeed.web.dev/) 測試
   - 確保載入速度 < 3 秒

---

## ✅ 部署完成檢查清單

### 服務部署
- [ ] MySQL 資料庫服務已建立並運行
- [ ] 後端 API 服務已建立並運行
- [ ] 前端服務已建立並運行
- [ ] API 服務的 `/api/health` 測試成功
- [ ] 所有服務的公有網路已啟用

### 環境變數設定
- [ ] API 服務設定了 `DB_HOST`、`DB_PORT`、`DB_USER`、`DB_PASSWORD`、`DB_NAME`
- [ ] API 服務的 Logs 顯示 `source: '環境變數'` 和 `✅ 資料庫連接測試成功`
- [ ] 前端服務設定了 `VITE_API_BASE_URL`
- [ ] （可選）前端服務設定了 EmailJS 相關環境變數

### 資料庫
- [ ] 資料庫結構已初始化
- [ ] 所有必要的資料表已建立
- [ ] 資料已匯入（或準備匯入）

### 功能測試
- [ ] 前端網站可以正常開啟
- [ ] 所有頁面路由正常
- [ ] API 請求成功（Network 中顯示 200）
- [ ] 資料正常顯示（成員、榮譽、照片等）
- [ ] 圖片載入正常
- [ ] 行動裝置顯示正常
- [ ] （可選）回饋表單可以發送郵件

### SEO 配置
- [ ] `robots.txt` 已更新網址
- [ ] `sitemap.xml` 已更新網址
- [ ] `index.html` 的 meta 標籤已更新網址
- [ ] 已提交到 Google Search Console
- [ ] Sitemap 已提交

### 自訂網域（可選）
- [ ] 網域已購買
- [ ] DNS 記錄已設定
- [ ] 網域已驗證
- [ ] SSL 憑證已自動配置

---

## 📞 技術支援資源

### Zeabur 相關
- [Zeabur 官方文件](https://zeabur.com/docs)
- [Zeabur Discord](https://discord.gg/zeabur)

### 其他資源
- [Docker 基礎教學](https://docs.docker.com/get-started/)
- [Nginx 配置指南](https://nginx.org/en/docs/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Google Search Console](https://search.google.com/search-console/)

---

## 🎉 部署完成！

恭喜！您的 TNT 粉絲網站現在已經完全部署並運行在 Zeabur 上了！

### 下一步建議：
1. ✅ 分享給朋友測試
2. ✅ 在社群媒體宣傳
3. ✅ 收集使用者回饋
4. ✅ 持續優化改進
5. ✅ 定期更新內容

### 維護建議：
- 🔄 定期更新依賴套件
- 📊 監控網站效能和使用量
- 🛡️ 定期檢查日誌
- 📈 分析使用者行為
- 💾 定期備份資料庫

---

**祝您部署順利！🎊**

如果遇到任何問題，請參考本指南的「常見問題排除」章節，或查看 Zeabur 的官方文件。

