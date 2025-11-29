#!/bin/bash

# Script para cambiar de SQLite a MySQL
# Uso: ./scripts/switch-to-mysql.sh

echo "🔄 Cambiando configuración a MySQL..."

# Backup del schema actual
cp prisma/schema.prisma prisma/schema.sqlite.prisma.backup

# Copiar schema de MySQL
cp prisma/schema.mysql.prisma prisma/schema.prisma

echo "✅ Schema cambiado a MySQL"
echo ""
echo "📝 Próximos pasos:"
echo "1. Actualiza DATABASE_URL en .env con tus credenciales de MySQL"
echo "2. Ejecuta: npx prisma generate"
echo "3. Ejecuta: npx prisma migrate dev"
echo ""
echo "⚠️  Nota: Asegúrate de tener MySQL instalado y corriendo"

