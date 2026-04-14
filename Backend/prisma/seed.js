require('dotenv/config');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env before running db:seed.');
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('Password123!', 10);

  const client = await prisma.user.upsert({
    where: { email: 'cliente.demo@fivalia.com' },
    update: {},
    create: {
      name: 'Cliente Demo',
      email: 'cliente.demo@fivalia.com',
      passwordHash: password,
      role: 'CLIENT',
      profile: {
        create: {
          bio: 'Publico vacantes y busco talento local.',
          category: 'Servicios',
          location: 'Merida',
          contact: 'cliente.demo@fivalia.com',
        },
      },
    },
  });

  const worker = await prisma.user.upsert({
    where: { email: 'trabajador.demo@fivalia.com' },
    update: {},
    create: {
      name: 'Trabajador Demo',
      email: 'trabajador.demo@fivalia.com',
      passwordHash: password,
      role: 'WORKER',
      profile: {
        create: {
          bio: 'Ayudo con mantenimiento y reparaciones.',
          category: 'Mantenimiento',
          location: 'Merida',
          contact: 'trabajador.demo@fivalia.com',
        },
      },
    },
  });

  await prisma.post.upsert({
    where: { id: 'seed_post_offer_01' },
    update: {},
    create: {
      id: 'seed_post_offer_01',
      userId: worker.id,
      type: 'OFFER',
      title: 'Servicio de plomeria a domicilio',
      description: 'Instalaciones, fugas y mantenimiento general.',
      category: 'Plomeria',
      status: 'ACTIVE',
    },
  });

  await prisma.post.upsert({
    where: { id: 'seed_post_need_01' },
    update: {},
    create: {
      id: 'seed_post_need_01',
      userId: client.id,
      type: 'NEED',
      title: 'Necesito electricista para casa',
      description: 'Revisar corto en sala y actualizar contactos.',
      category: 'Electricidad',
      status: 'ACTIVE',
    },
  });

  console.log('Seed completed.');
  console.log('Demo users:');
  console.log('- cliente.demo@fivalia.com / Password123!');
  console.log('- trabajador.demo@fivalia.com / Password123!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
