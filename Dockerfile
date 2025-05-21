FROM node:22 as build

WORKDIR /app
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm install -g typescript && npm install
RUN tsc

FROM node:22
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "dist/index.js"]