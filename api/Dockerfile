# ---------- Etap 1: budowa ----------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ---------- Etap 2: uruchomienie ----------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Zależności produkcyjne + wygenerowany klient Prisma
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate

COPY --from=build /app/dist ./dist
# Skrypty administracyjne (seed) uruchamiane ręcznie: docker compose exec api ...
COPY scripts ./scripts

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=3s --start-period=20s \
  CMD wget -qO- http://127.0.0.1:4000/api/health || exit 1

# Migracje wykonują się przy starcie, potem wstaje serwer.
CMD ["sh", "-c", "npx prisma migrate deploy || npx prisma db push --accept-data-loss; node dist/server.js"]
