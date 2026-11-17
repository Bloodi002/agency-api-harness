# Build context is the repository root (the harness needs ../node, ../openapi and ../docs): docker build -f harness/Dockerfile .
FROM node:22-alpine AS sdk
WORKDIR /sdks/node
COPY node/package.json node/package-lock.json ./
RUN npm ci --ignore-scripts
COPY node/tsconfig.json ./
COPY node/src ./src
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production PORT=8080
WORKDIR /app
COPY openapi ./openapi
COPY docs ./docs
COPY harness/package.json harness/server.mjs ./harness/
COPY harness/lib ./harness/lib
COPY harness/public ./harness/public
# The SDK has no runtime dependencies, so its built output is the whole package.
COPY --from=sdk /sdks/node/package.json ./harness/node_modules/@rosteredai/sdk/package.json
COPY --from=sdk /sdks/node/dist ./harness/node_modules/@rosteredai/sdk/dist
USER node
WORKDIR /app/harness
EXPOSE 8080
CMD ["node", "server.mjs"]
