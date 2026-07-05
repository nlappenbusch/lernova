#!/bin/sh
set -e

echo "[entrypoint] prisma migrate deploy …"
npx prisma migrate deploy

echo "[entrypoint] starte Lernova auf Port 3210 …"
exec npx next start -p 3210
