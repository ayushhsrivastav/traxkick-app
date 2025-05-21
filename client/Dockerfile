# Stage 1: Build Angular app
FROM node:22 as build

WORKDIR /app
COPY client/ ./
COPY /root/secrets/environment.prod.ts ./src/environments/environment.ts
RUN npm install && npm run build --configuration=production

# Stage 2: Serve using nginx
FROM nginx:alpine
COPY --from=build /app/dist/client/browser /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf