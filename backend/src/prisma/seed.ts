import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Crear usuario admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cumbres.com' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@cumbres.com',
      dni: '12345678A',
      passwordHash: adminPassword,
      role: 'ADMIN',
      specialRolePending: false,
    },
  });

  console.log('✅ Usuario admin creado:', admin.email);

  // Crear usuario de prueba
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'usuario@test.com' },
    update: {},
    create: {
      nombre: 'Usuario de Prueba',
      email: 'usuario@test.com',
      dni: '87654321B',
      passwordHash: userPassword,
      role: 'USER',
      specialRolePending: false,
    },
  });

  console.log('✅ Usuario de prueba creado:', user.email);

  // Crear pistas
  const pistas = [
    {
      nombre: 'Pista Césped',
      tipo: 'cesped',
      precioBase: 50,
      precioEspecial: 30,
      luzPrecio: 5,
      luzIncluida: false,
      disponible: true,
    },
    {
      nombre: 'Pista Multi',
      tipo: 'multi',
      precioBase: 30,
      precioEspecial: 15,
      luzPrecio: 5,
      luzIncluida: false,
      disponible: true,
    },
    {
      nombre: 'Pista Pádel 1',
      tipo: 'padel1',
      precioBase: 18,
      precioEspecial: 10,
      luzPrecio: 0,
      luzIncluida: true,
      disponible: true,
    },
    {
      nombre: 'Pista Pádel 2',
      tipo: 'padel2',
      precioBase: 18,
      precioEspecial: 10,
      luzPrecio: 0,
      luzIncluida: true,
      disponible: true,
    },
  ];

  for (const pista of pistas) {
    const created = await prisma.space.upsert({
      where: { nombre: pista.nombre },
      update: {},
      create: pista,
    });
    console.log('✅ Pista creada:', created.nombre);
  }

  console.log('🎉 Seed completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

