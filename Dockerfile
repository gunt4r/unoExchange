# 1. Берем Node
FROM node:20-alpine

# 2. Рабочая папка внутри контейнера
WORKDIR /app

RUN npm install -g pnpm

# 3. Копируем package.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 7. Открываем порт
EXPOSE 3000

# 8. Запуск приложения
CMD ["npm", "run", "dev"]

# 1. Сборочный этап
# FROM node:22-alpine AS builder

# RUN apk add --no-cache libc6-compat
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build

# # 2. Production-этап
# FROM node:22-alpine

# RUN apk add --no-cache openssl tzdata
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --omit=dev

# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/next.config.mjs ./
# COPY --from=builder /app/next-i18next.config.js ./

# # TypeORM
# COPY --from=builder /app/src/models ./src/models
# COPY --from=builder /app/src/libs/DB.ts ./src/libs/DB.ts

# RUN chown -R node:node /app
# USER node

# EXPOSE 3000
# ENV NODE_ENV=production
# CMD ["npm", "run", "start"]