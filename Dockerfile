# Zero-dependency Node app — nothing to install, just run.
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
COPY server.js ./
COPY public ./public
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
