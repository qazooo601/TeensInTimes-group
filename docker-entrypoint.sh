#!/bin/sh

# 使用 Zeabur 提供的 PORT 環境變數，預設為 80
PORT=${PORT:-80}

# 生成 nginx 配置
cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen ${PORT};
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # 快取靜態資源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 啟動 nginx
exec nginx -g "daemon off;"


