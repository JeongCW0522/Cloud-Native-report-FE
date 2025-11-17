FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p uploads && chmod 777 uploads

EXPOSE 8002

CMD ["npm", "run", "dev"]