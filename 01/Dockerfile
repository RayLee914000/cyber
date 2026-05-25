FROM node:22-slim

WORKDIR /app
COPY app.js config.js ./
COPY public ./public

EXPOSE 8080
CMD ["node", "app.js"]
