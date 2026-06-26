# ── Stage 1: install dependencies ──────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

# ── Stage 2: production image ───────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

# Create a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only production deps and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Never copy .env into the image — inject via docker run or ECS task definition
# Make sure .dockerignore excludes it

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Drop root privileges
USER appuser

CMD ["node", "server.js"]