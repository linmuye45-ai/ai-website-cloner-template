FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*
ARG MINIGAMEHUB_COMMIT=f453e18fe822d0c79ccca5fc65149a91a689494f
WORKDIR /app
RUN git clone --depth 1 --no-checkout https://github.com/trazhub/Mini-Games.git /app \
 && git fetch --depth 1 origin "$MINIGAMEHUB_COMMIT" \
 && git checkout --detach "$MINIGAMEHUB_COMMIT"
RUN npm ci && npm run build:server
ENV NODE_ENV=production HOST=0.0.0.0 PORT=2567
EXPOSE 2567
CMD ["node","apps/server/dist/main.js"]
