# 第一階段：建置階段
FROM node:18-alpine AS build

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝依賴
RUN npm ci --only=production

# 複製所有專案檔案
COPY . .

# 建置專案
RUN npm run build

# 第二階段：運行階段
FROM nginx:alpine

# 複製建置好的檔案到 nginx
COPY --from=build /app/dist /usr/share/nginx/html

# 複製 nginx 配置（用於處理 React Router）
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]

