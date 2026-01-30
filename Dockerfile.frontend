# 第一階段：建置階段
FROM node:18-alpine AS build

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝所有依賴（包括 devDependencies，建置需要）
RUN npm ci

# 複製所有專案檔案
COPY . .

# 建置專案
RUN npm run build

# 第二階段：運行階段
FROM nginx:alpine

# 複製建置好的檔案到 nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 複製啟動腳本（支援 Zeabur 的動態 PORT）
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 暴露端口（Zeabur 會使用 PORT 環境變數）
EXPOSE 80

# 使用啟動腳本
CMD ["/docker-entrypoint.sh"]

