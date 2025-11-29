#!/bin/bash

# Script para cambiar de MySQL a SQLite
# Uso: ./scripts/switch-to-sqlite.sh

echo "🔄 Cambiando configuración a SQLite..."

# Backup del schema actual
cp prisma/schema.prisma prisma/schema.mysql.prisma.backup

# Restaurar schema de SQLite (sin enums)
cat > prisma/schema.prisma << 'EOF'
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// SQLite no soporta enums, usamos String en su lugar
// En producción con MySQL se pueden convertir de vuelta a enums

model User {
  id            String    @id @default(uuid())
  nombre        String
  email         String    @unique
  dni           String    @unique
  passwordHash  String
  role          String    @default("USER") // ADMIN, USER, SPECIAL_USER
  specialRolePending Boolean @default(false) // Si está pendiente de aprobación como especial
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  reservations  Reservation[]
  logs          Log[]

  @@map("users")
}

model Space {
  id            String    @id @default(uuid())
  nombre        String
  tipo          String    // "cesped", "multi", "padel1", "padel2"
  precioBase    Float
  precioEspecial Float    // Precio para alumnos/familias/ex-alumnos
  luzPrecio     Float     @default(5.0)
  luzIncluida   Boolean   @default(false) // Para pádel (luz ya incluida)
  disponible    Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  reservations  Reservation[]

  @@map("spaces")
}

model Reservation {
  id            String            @id @default(uuid())
  userId        String
  spaceId       String
  fecha         DateTime
  franja        String            // "17:30-19:00", "19:00-20:30", "20:30-22:00", o rango libre para fines de semana
  estado        String            @default("PRE_RESERVADA") // LIBRE, PRE_RESERVADA, RESERVADA, NO_DISPONIBLE
  precioTotal   Float
  luz           Boolean           @default(false)
  dni           String?           // DNI si no está autenticado
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  user          User              @relation(fields: [userId], references: [id], onDelete: Cascade)
  space         Space             @relation(fields: [spaceId], references: [id], onDelete: Cascade)
  payment       Payment?
  logs          Log[]

  @@unique([spaceId, fecha, franja])
  @@map("reservations")
}

model Payment {
  id            String        @id @default(uuid())
  reservationId String        @unique
  amount        Float
  status        String        @default("PENDIENTE") // PENDIENTE, APROBADO, RECHAZADO
  comprobanteUrl String?      // URL del archivo subido
  motivoRechazo String?       // Motivo si se rechaza
  numeroCuenta  String        @default("ES12 3456 7890 1234 5678 9012") // Número de cuenta para transferencia
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt

  reservation   Reservation   @relation(fields: [reservationId], references: [id], onDelete: Cascade)

  @@map("payments")
}

model Log {
  id            String    @id @default(uuid())
  reservationId String?
  action        String    // "created", "approved", "rejected", "status_changed", etc.
  userId        String?
  detalles      String?   // JSON o texto con detalles adicionales
  timestamp     DateTime  @default(now())

  reservation   Reservation? @relation(fields: [reservationId], references: [id], onDelete: SetNull)
  user          User?        @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("logs")
}
EOF

echo "✅ Schema cambiado a SQLite"
echo ""
echo "📝 Próximos pasos:"
echo "1. Actualiza DATABASE_URL en .env a: file:./dev.db"
echo "2. Ejecuta: npx prisma generate"
echo "3. Ejecuta: npx prisma migrate dev"

