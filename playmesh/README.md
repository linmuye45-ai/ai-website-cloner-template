# PlayMesh

A browser-first social game platform. Discover quick games, create a private room, invite friends with one link, and play together.

## Build foundation

The first playable foundation is adapted at build time from [MiniGameHub](https://github.com/trazhub/Mini-Games), pinned to commit `f453e18fe822d0c79ccca5fc65149a91a689494f`. It is an MIT-licensed React/Vite/TypeScript + Colyseus project. The upstream MIT license is retained here.

This keeps the UI and multiplayer game engine on a tested open-source base instead of hand-writing a frontend. PlayMesh applies its own brand layer, product copy, and design tokens.

## Deploy

- **Web preview:** Vercel runs `bash build.sh`, which clones the pinned upstream commit, applies the PlayMesh brand layer, runs the upstream verification gate, and publishes the static frontend.
- **Realtime backend:** `Dockerfile` and `railway.toml` are prepared for a separate persistent Node/Colyseus service. Production requires a unique `SESSION_SECRET`, explicit `ALLOWED_ORIGINS`, and a PostgreSQL `DATABASE_URL` if match history is to persist.
- **Frontend API:** set Vercel `VITE_API_URL` to the deployed HTTPS backend origin before enabling multiplayer rooms publicly.

## Release boundary

The first release is private-room gameplay only. Public UGC, open chat, creator payouts, virtual goods, and paid acquisition remain disabled until moderation, reporting, privacy, age controls, payment/refund handling, asset rights, and product-market-fit metrics have been verified.

## Commercial asset note

The inherited posters and game art are prototype placeholders. Verify the current commercial terms for the upstream Canva-generated artwork or replace it with cleared original assets before commercial launch.
