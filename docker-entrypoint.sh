#!/bin/sh
# docker-entrypoint.sh – inicia nginx (reverse proxy) + servidor Node.js vinext

set -e

echo "🧠 Mente Aberta — iniciando servidor de produção (fed-core)"
echo "   Node.js (vinext) → porta interna 3000"
echo "   nginx (proxy)    → porta pública 2002"

# O servidor Node.js standalone usa PORT=3000 internamente;
# o nginx escuta na porta 2002 e faz o proxy para ele.

# Inicia o servidor Node.js em background
PORT=3000 node dist/standalone/server.js &
NODE_PID=$!

echo "✓ Servidor Node.js iniciado (PID $NODE_PID)"

# Aguarda o Node.js estar pronto antes de iniciar o nginx
RETRIES=20
until wget -qO- http://127.0.0.1:3000/ >/dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
    echo "  ... aguardando Node.js (tentativas restantes: $RETRIES)"
    RETRIES=$((RETRIES - 1))
    sleep 1
done

# Inicia o nginx em foreground (mantém o container vivo)
echo "✓ Iniciando nginx na porta 2002"
exec nginx -c /etc/nginx/nginx.conf -g "daemon off;"
