# Single-instance demo deployment. Do not use as a production-ready multiplayer service.
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV STATIC_EXPORT=1
RUN npm run build

FROM node:24-alpine AS runtime
ENV NODE_ENV=production PORT=3000 SITE_DIR=/app/site
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/out ./site
COPY --from=build /app/server ./server
COPY --from=build /app/src/lib/party-spec.mjs ./src/lib/party-spec.mjs
USER node
EXPOSE 3000
CMD ["node", "server/party.mjs"]
