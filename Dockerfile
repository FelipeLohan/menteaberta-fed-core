# ─────────────────────────────────────────────────────────────
# Stage 1 – deps: instala dependências com cache de lockfile
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ─────────────────────────────────────────────────────────────
# Stage 2 – builder: compila com vinext (vite-powered Next.js)
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Gera: dist/client, dist/server, dist/standalone/
RUN pnpm run build:vinext

# ─────────────────────────────────────────────────────────────
# Stage 3 – runner: imagem de produção com nginx + Node.js
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

# Instala nginx e wget (usado no healthcheck do entrypoint)
RUN apk add --no-cache nginx wget

WORKDIR /app

ENV NODE_ENV=production
# Porta interna do Node.js (nginx faz proxy para essa porta)
ENV PORT=3000

# Usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copia saída standalone gerada pelo vinext build
COPY --from=builder --chown=nextjs:nodejs /app/dist/standalone ./dist/standalone
COPY --from=builder --chown=nextjs:nodejs /app/dist/client     ./dist/client
COPY --from=builder --chown=nextjs:nodejs /app/public          ./public

# Copia configuração do nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copia e torna o entrypoint executável
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Cria e garante permissão dos diretórios que o nginx precisa acessar,
# incluindo /var/lib/nginx (usado internamente pelo nginx no Alpine)
RUN mkdir -p \
      /var/lib/nginx \
      /var/lib/nginx/tmp \
      /var/lib/nginx/logs \
      /var/log/nginx \
      /var/cache/nginx \
      /run/nginx \
      /tmp/client_body \
      /tmp/proxy_temp \
      /tmp/fastcgi_temp \
 && chown -R nextjs:nodejs \
      /var/lib/nginx \
      /var/log/nginx \
      /var/cache/nginx \
      /run/nginx \
      /tmp/client_body \
      /tmp/proxy_temp \
      /tmp/fastcgi_temp \
 && chown nextjs:nodejs /etc/nginx/nginx.conf

USER nextjs

# Porta pública exposta ao Coolify
EXPOSE 2002

ENTRYPOINT ["docker-entrypoint.sh"]
