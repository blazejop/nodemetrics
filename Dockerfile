FROM node:19-alpine
WORKDIR /app
COPY . .
RUN npm ci
CMD ["npm", "start"]