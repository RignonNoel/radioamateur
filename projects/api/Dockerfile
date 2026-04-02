FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY src ./src

# Create a folder to store SQLite3 database
RUN mkdir -p /data

EXPOSE 3000

CMD ["npm", "start"]