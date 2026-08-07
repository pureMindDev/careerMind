# --- build ---
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Vite inlines VITE_* env vars at build time, so the backend URL must be
# passed as a build arg: docker build --build-arg VITE_API_URL=https://api.example.com
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL
# vite.config.ts emits to ../dist relative to this folder — that's fine
# inside the container, it just lands at /dist.
RUN npm run build

# --- runtime ---
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
