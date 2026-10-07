# Vachan API (Express + Prisma) — production image.
# Build from the REPOSITORY ROOT (npm workspaces: the lockfile lives there):
#   docker build -f backend/Dockerfile -t vachan-api .
# Secrets (DATABASE_URL, JWT_SECRET, GEMINI_API_KEY) are passed at RUN time, never baked in.
FROM node:22-slim

# OpenSSL for Prisma; CA certificates for HTTPS calls to the AI provider.
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

# 1. Dependencies first (cached until a package.json / the lockfile changes).
#    Dev dependencies are kept on purpose: the Prisma CLI (migrations), tsx (seed, rag:index,
#    admin:grant) run inside this container.
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY frontend/package.json frontend/
COPY backend/prisma backend/prisma
COPY backend/prisma.config.ts backend/
RUN npm ci --include=dev -w backend && npm cache clean --force

# 2. Source → compiled JavaScript in backend/dist.
COPY backend backend
RUN npm run build -w backend

# Run as the unprivileged "node" user; the embedding model cache must be writable.
RUN mkdir -p /app/backend/.cache && chown -R node:node /app/backend/.cache
USER node

EXPOSE 4000
ENV PORT=4000
# Apply pending migrations (safe: only new ones; never resets data), then start.
CMD ["sh", "-c", "npm run db:deploy -w backend && npm run start -w backend"]
