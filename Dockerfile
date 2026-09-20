FROM node:22-alpine AS build
WORKDIR /app

# Empty = same-origin /api via nginx. Set an absolute URL only for Vercel-style deploys.
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL
ENV HUSKY=0

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
