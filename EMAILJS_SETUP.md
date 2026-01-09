# EmailJS 配置指南

為了讓回饋表單能夠發送郵件，您需要設置 EmailJS 服務。

## 步驟 1：註冊 EmailJS 帳號

1. 前往 [EmailJS 官網](https://www.emailjs.com/)
2. 註冊一個免費帳號（免費方案每月可發送 200 封郵件）
3. 登入後進入儀表板

## 步驟 2：添加郵件服務

如果您遇到 Gmail API 的 412 錯誤（身份驗證範圍不足），建議使用以下替代方案：

### 方案一：使用 Gmail 自訂 SMTP（推薦，解決 412 錯誤）

1. 在 EmailJS 儀表板中，點擊 **Email Services**
2. 點擊 **Add New Service**
3. 選擇 **Gmail（自訂 SMTP）** 或 **Other（自訂 SMTP）**
4. 填寫以下 SMTP 設定：
   - **SMTP 伺服器**：`smtp.gmail.com`
   - **SMTP 端口**：`587`（使用 TLS）或 `465`（使用 SSL）
   - **SMTP 用戶名**：您的 Gmail 完整郵箱地址（例如：your.email@gmail.com）
   - **SMTP 密碼**：需要使用 Gmail 應用程式專用密碼（見下方說明）

5. 記下 **Service ID**（例如：`service_xxxxxxx`）

#### 如何獲取 Gmail 應用程式專用密碼：

1. 前往您的 [Google 帳戶設定](https://myaccount.google.com/)
2. 點擊左側的 **安全性**
3. 在「登入 Google」區塊中，找到 **兩步驟驗證** 並啟用（如果尚未啟用）
4. 啟用兩步驟驗證後，回到「安全性」頁面
5. 找到 **應用程式密碼**（在「登入 Google」區塊下方）
6. 選擇應用程式類型為「郵件」，設備類型為「其他（自訂名稱）」
7. 輸入名稱（例如：EmailJS）
8. 點擊「產生」
9. Google 會顯示一個 16 位數的密碼，複製這個密碼
10. 將此密碼用作 SMTP 密碼（不要使用您的 Gmail 登入密碼）

### 方案二：使用 Outlook/Hotmail

1. 在 EmailJS 儀表板中，點擊 **Email Services**
2. 點擊 **Add New Service**
3. 選擇 **Outlook**
4. 使用 Microsoft 帳號登入授權
5. 記下 **Service ID**

### 方案三：使用其他 SMTP 服務

如果您有其他郵件服務提供商，可以使用其 SMTP 設定：
- **Outlook/Hotmail SMTP**：
  - 伺服器：`smtp-mail.outlook.com`
  - 端口：`587`
  - 需要啟用應用程式密碼

- **SendGrid、Mailgun 等專業郵件服務**：
  - 這些服務通常提供更好的穩定性
  - 按照各服務提供商的 SMTP 設定指南操作

## 步驟 3：創建郵件模板

1. 在儀表板中，點擊 **Email Templates**
2. 點擊 **Create New Template**
3. 在模板中使用以下變數：

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

4. 保存模板並記下 **Template ID**（例如：`template_xxxxxxx`）

## 步驟 4：獲取 Public Key

1. 在儀表板中，點擊 **Account** → **General**
2. 找到 **Public Key**，複製這個值

## 步驟 5：設置環境變數

在專案根目錄創建 `.env` 文件（如果還沒有），並添加以下環境變數：

```env
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
VITE_RECEIVER_EMAIL=your_email@example.com
```

將上述值替換為您在步驟 2-4 中獲取的實際值。

**注意：** `.env` 文件不應該提交到 Git。如果專案中已有 `.gitignore`，請確保 `.env` 已被包含。

## 步驟 6：測試

1. 重新啟動開發伺服器（如果正在運行）
2. 訪問回饋頁面
3. 填寫表單並測試發送郵件功能

## 疑難排解

### Gmail API 412 錯誤（身份驗證範圍不足）

**原因**：Gmail API 需要特定的權限範圍，EmailJS 的標準連接可能無法獲得足夠權限。

**解決方案**：
1. **使用 Gmail 自訂 SMTP**（推薦，見上方方案一）
   - 使用應用程式專用密碼
   - 不需要 API 授權，更穩定

2. **改用其他郵件服務**
   - Outlook/Hotmail（方案二）
   - 其他 SMTP 服務（方案三）

3. **檢查 Gmail 設定**
   - 確保已啟用「允許安全性較低的應用程式存取」（較舊的方法，不推薦）
   - 推薦使用應用程式專用密碼

### 郵件發送失敗

1. 檢查環境變數是否正確設置
2. 確認 EmailJS 服務和模板已正確配置
3. 檢查瀏覽器控制台是否有錯誤訊息
4. 確認 EmailJS 帳號沒有超過免費方案的發送限制
5. 如果使用 SMTP，確認 SMTP 設定正確（伺服器、端口、用戶名、密碼）
6. 確認應用程式專用密碼輸入正確（無空格，完整 16 位數）

### 環境變數未生效

- 確保環境變數名稱以 `VITE_` 開頭（Vite 專案要求）
- 重新啟動開發伺服器
- 清除瀏覽器快取

## 免費方案限制

EmailJS 免費方案包含：
- 每月 200 封郵件
- 2 個郵件服務
- 2 個郵件模板

如果您的使用量超過免費額度，可以考慮升級到付費方案。

