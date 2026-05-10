FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml ./
RUN pnpm install

FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build:vinext

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs
COPY --from=builder --chown=nextjs:nodejs /app/dist/standalone ./dist/standalone
COPY --from=builder --chown=nextjs:nodejs /app/dist/client     ./dist/client
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public
USER nextjs
EXPOSE 3000
CMD ["node", "dist/standalone/server.js"]
