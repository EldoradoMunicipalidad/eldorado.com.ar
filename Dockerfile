FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

# Install nginx
RUN apk add --no-cache nginx

WORKDIR /app

# Copy frontend assets for nginx and Express
COPY --from=builder /app/dist /usr/share/nginx/html
COPY --from=builder /app/dist /app/dist

# Copy API server
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/server ./server
COPY --from=builder /app/node_modules ./node_modules

# Copy nginx config
COPY nginx.conf /etc/nginx/http.d/default.conf

EXPOSE 80

# Start Express (background) then nginx (foreground)
CMD sh -c "node /app/server/index.cjs & nginx -g 'daemon off;'"
