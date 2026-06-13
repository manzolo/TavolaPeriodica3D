# ---- Dockerfile multi-stage: build + serve statico con nginx ----
# Build di produzione (utile per testare la versione "deploy" in locale)

FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# In locale serviamo dalla root, quindi base = "/"
ENV BASE_PATH=/
RUN npm run build

FROM nginx:alpine AS serve
COPY --from=build /app/dist /usr/share/nginx/html
# SPA fallback non necessario (nessun routing), config di default va bene
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
