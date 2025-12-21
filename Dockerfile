# 1. Берем Node
FROM node:20-alpine

# 2. Рабочая папка внутри контейнера
WORKDIR /app

# 3. Копируем package.json
COPY package*.json ./

# 4. Устанавливаем зависимости
RUN npm install

# 7. Открываем порт
EXPOSE 3000

# 8. Запуск приложения
CMD ["npm", "run", "dev"]
