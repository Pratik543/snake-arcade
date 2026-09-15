# --- Build stage ---
FROM oven/bun:1 AS build

WORKDIR /app

# Install dependencies first so this layer caches
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build the app (type-check + bundle)
COPY . .
RUN bun run build

# --- Serve stage ---
FROM nginx:alpine AS serve

COPY --from=build /app/dist /usr/share/nginx/html

# SPA-friendly config: gzip + cache static assets, fallback to index.html
RUN printf '%s\n' \
  'server {' \
  '  listen 80;' \
  '  server_name _;' \
  '  root /usr/share/nginx/html;' \
  '  index index.html;' \
  '  gzip on;' \
  '  gzip_types text/css application/javascript image/svg+xml;' \
  '  location / {' \
  '    try_files $uri $uri/ /index.html;' \
  '  }' \
  '}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
