# Sử dụng một image node.js đã được cấu hình
FROM node:latest

# Đặt thư mục làm việc mặc định trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục /app
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install --force

# Sao chép tất cả các file trong dự án vào thư mục /app
COPY . .

# Build ứng dụng React TS
RUN npm run build

# Expose cổng 3000 của container
EXPOSE 1000

# Chạy ứng dụng React TS
CMD ["npm", "start"]