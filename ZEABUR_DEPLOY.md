# 🚀 Zeabur 部署指南 - TNT 粉絲網站

## 📋 已完成的準備工作

✅ **Dockerfile** - 已建立
✅ **.dockerignore** - 已建立
✅ **專案建置測試** - 完成

您的專案現在已經準備好在 Zeabur 上部署了！

---

## 🎯 Zeabur 部署步驟

### 步驟 1：註冊並登入 Zeabur

1. 前往 [Zeabur 官網](https://zeabur.com)
2. 點擊右上角 **Sign Up** 或 **登入**
3. 使用 **GitHub 帳號** 登入（推薦）

### 步驟 2：建立新專案

1. 登入後，點擊 **Create Project**（建立專案）
2. 輸入專案名稱，例如：`TNT-Website`
3. 選擇地區（建議選擇 **Asia Pacific** 以獲得更好的速度）

### 步驟 3：部署服務

1. 在新建的專案中，點擊 **Deploy New Service**（部署新服務）
2. 選擇 **Deploy from GitHub**（從 GitHub 部署）
3. 授權 Zeabur 存取您的 GitHub 帳號
4. 選擇 **TNTapp** 專案儲存庫
5. 選擇要部署的分支（通常是 `main` 或 `master`）

### 步驟 4：等待自動部署

1. Zeabur 會自動檢測到您的 **Dockerfile**
2. 開始自動建置和部署
3. 等待 3-5 分鐘完成部署
4. 您會看到部署狀態變為 **Running**（運行中）

### 步驟 5：取得網址並測試

1. 在服務詳情頁面，找到 **Domain**（網域）區塊
2. 點擊 **Generate Domain**（生成網域）
3. 系統會自動給您一個免費網址，如：`tnt-website.zeabur.app`
4. 點擊網址測試網站是否正常運作

---

## 🌐 自訂網域（可選）

### 步驟 1：新增自訂網域

1. 在服務頁面的 **Domain** 區塊
2. 點擊 **Add Domain**（新增網域）
3. 輸入您的網域名稱，例如：`www.tnt-fan.com`

### 步驟 2：設定 DNS

前往您的網域提供商（如 Namecheap、GoDaddy、Cloudflare）：

**設定 CNAME 記錄：**
```
類型：CNAME
名稱：www
值：<您的 Zeabur 網址>
TTL：自動或 3600
```

**設定根網域（可選）：**
```
類型：A
名稱：@
值：<Zeabur 提供的 IP>
```

### 步驟 3：驗證網域

1. 等待 DNS 傳播（通常 5-30 分鐘）
2. Zeabur 會自動驗證您的網域
3. 驗證成功後，SSL 憑證會自動配置

---

## 🔄 自動部署

設定完成後，每次您推送程式碼到 GitHub：

1. ✅ Zeabur 會自動偵測更新
2. ✅ 自動重新建置 Docker 映像
3. ✅ 自動部署新版本
4. ✅ 零停機時間切換

---

## 💰 費用說明

### 免費方案包含：
- ✅ 每月 $5 USD 免費額度
- ✅ 自動 HTTPS
- ✅ 自訂網域
- ✅ 自動部署
- ✅ 全球 CDN

### 付費方案：
- 💳 按使用量計費
- 📊 查看 [Zeabur 定價](https://zeabur.com/pricing)

> **注意**：對於靜態網站，免費額度通常已足夠！

---

## 🔧 進階設定

### 環境變數（如需要）

1. 在服務頁面點擊 **Variables**（變數）
2. 新增環境變數：
   ```
   KEY: VITE_APP_TITLE
   VALUE: TNT 粉絲網站
   ```
3. 儲存後會自動重新部署

### 查看日誌

1. 在服務頁面點擊 **Logs**（日誌）
2. 查看即時建置和運行日誌
3. 方便除錯和監控

### 監控資源使用

1. 在專案頁面查看 **Usage**（使用量）
2. 監控：
   - CPU 使用率
   - 記憶體使用量
   - 網路流量
   - 儲存空間

---

## ✅ 部署後檢查清單

- [ ] 網站可以正常開啟
- [ ] 所有頁面路由正常（測試導航）
- [ ] 圖片載入正常
- [ ] 行動裝置顯示正常
- [ ] HTTPS 正常運作（有綠色鎖頭）
- [ ] 載入速度合理（< 3 秒）

---

## 🚨 常見問題解決

### 問題 1：建置失敗
**解決方法：**
1. 檢查 Zeabur 的建置日誌
2. 確認 `package.json` 中的依賴正確
3. 本地測試建置：`npm run build`

### 問題 2：路由 404 錯誤
**解決方法：**
- 已經在 Dockerfile 中設定好 nginx 轉發規則
- 如果還有問題，檢查日誌中的錯誤訊息

### 問題 3：圖片無法顯示
**解決方法：**
1. 確認圖片檔案在 `public/` 或 `src/` 目錄
2. 檢查圖片路徑是否正確
3. 確認 `.dockerignore` 沒有排除圖片資料夾

### 問題 4：部署很慢
**原因：**
- 第一次部署需要建置 Docker 映像
- 後續部署會使用快取，速度會更快

---

## 📊 效能優化建議

### 已在 Dockerfile 中完成：
- ✅ 多階段建置（減小映像大小）
- ✅ Nginx 提供靜態檔案（高效能）
- ✅ 路由轉發設定（支援 SPA）

### 額外優化：
- 🖼️ 壓縮圖片（使用 WebP 格式）
- 📦 啟用 Gzip 壓縮
- 🚀 使用 Zeabur 的 CDN
- 📱 優化行動裝置體驗

---

## 🎉 部署完成

恭喜！您的 TNT 粉絲網站現在已經在 Zeabur 上運行了！

### 下一步：
1. ✅ 分享給朋友測試
2. ✅ 在社群媒體宣傳
3. ✅ 收集使用者回饋
4. ✅ 持續優化改進

### 維護建議：
- 🔄 定期更新依賴套件
- 📊 監控網站效能和使用量
- 🛡️ 定期檢查日誌
- 📈 分析使用者行為

---

## 📞 技術支援

### 如果遇到問題：

1. **查看 Zeabur 文件**
   - [官方文件](https://zeabur.com/docs)
   - [部署指南](https://zeabur.com/docs/deploy)

2. **查看建置日誌**
   - 在服務頁面點擊 **Logs**
   - 找出錯誤訊息

3. **本地測試**
   ```bash
   # 測試建置
   npm run build

   # 測試 Docker
   docker build -t tntapp .
   docker run -p 8080:80 tntapp
   ```

4. **社群支援**
   - [Zeabur Discord](https://discord.gg/zeabur)
   - [GitHub Issues](https://github.com/zeabur/zeabur)

---

## 🔗 相關資源

- 📖 [Zeabur 官方文件](https://zeabur.com/docs)
- 🎓 [Docker 基礎教學](https://docs.docker.com/get-started/)
- 🌐 [Nginx 配置指南](https://nginx.org/en/docs/)
- ⚛️ [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)

---

**祝您部署順利！🎊**

如果遇到任何問題，歡迎參考本指南或尋求 Zeabur 社群支援。

