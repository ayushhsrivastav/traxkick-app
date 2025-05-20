# Stage 1: Build Angular app
FROM node:22 as build

WORKDIR /app
COPY client/ ./
COPY environment.prod.ts ./src/environments/environment.prod.ts
RUN npm install && npm run build --configuration=production

# Stage 2: Serve using nginx
FROM nginx:alpine
COPY --from=build /app/dist/client /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf