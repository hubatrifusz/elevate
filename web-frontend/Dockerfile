FROM node:23-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration=production

FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/web-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/