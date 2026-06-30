FROM node:18-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

USER appuser

CMD ["node", "server.js"] 