# Vachan web app (Next.js) — production image.
# Build from the REPOSITORY ROOT:
#   docker build -f frontend/Dockerfile --build-arg BACKEND_URL=http://backend:4000 -t vachan-web .
# BACKEND_URL is read at BUILD time by next.config.ts (the /api proxy). It is not a secret and
# is never sent to the browser; NEXT_PUBLIC_API_URL is intentionally NOT set (use the proxy).
FROM node:22-slim
WORKDIR /app

COPY package.json package-lock.json ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/
RUN npm ci -w frontend --ignore-scripts && npm cache clean --force

COPY frontend frontend
ARG BACKEND_URL=http://backend:4000
ENV BACKEND_URL=$BACKEND_URL NEXT_TELEMETRY_DISABLED=1
RUN npm run build -w frontend

ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["npm", "run", "start", "-w", "frontend", "--", "-p", "3000"]
