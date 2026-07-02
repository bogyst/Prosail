# ---------- Etap 1: budowa aplikacji ----------
FROM node:22-alpine AS build
WORKDIR /app

# Najpierw manifesty — lepsze cache'owanie warstw Dockera
COPY package.json package-lock.json* ./
RUN npm ci

# Reszta źródeł i build produkcyjny
COPY . .
RUN npm run build

# ---------- Etap 2: lekki serwer statyczny (nginx) ----------
FROM nginx:1.27-alpine AS runtime

# Konfiguracja nginx z obsługą routingu SPA i cache'owaniem
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Skopiuj zbudowane pliki statyczne
COPY --from=build /app/dist /usr/share/nginx/html

# Nienależący do roota użytkownik już istnieje w obrazie nginx (nginx)
EXPOSE 80

# Prosty healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -qO- http://127.0.0.1/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
