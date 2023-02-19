FROM node:16.16.0-alpine AS builder

RUN mkdir /frontend
WORKDIR /frontend
COPY . /frontend
RUN npm install
RUN npm run build
RUN rm -rf node_modules


FROM nginx:alpine
ADD react_site.conf /etc/nginx/conf.d/
WORKDIR /usr/share/nginx/html
COPY --from=builder /frontend/webpack/dist .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
