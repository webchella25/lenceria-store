import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Crear categorías
  const categorias = await Promise.all([
    prisma.categoria.upsert({
      where: { slug: 'conjuntos' },
      update: {},
      create: {
        nombre: 'Conjuntos',
        slug: 'conjuntos',
        descripcion: 'Conjuntos de lencería de 2 piezas',
        orden: 1,
      },
    }),
    prisma.categoria.upsert({
      where: { slug: 'bodies' },
      update: {},
      create: {
        nombre: 'Bodies',
        slug: 'bodies',
        descripcion: 'Bodies y monos sensuales',
        orden: 2,
      },
    }),
    prisma.categoria.upsert({
      where: { slug: 'babydolls' },
      update: {},
      create: {
        nombre: 'Babydolls',
        slug: 'babydolls',
        descripcion: 'Babydolls y camisones',
        orden: 3,
      },
    }),
    prisma.categoria.upsert({
      where: { slug: 'para-el' },
      update: {},
      create: {
        nombre: 'Para Él',
        slug: 'para-el',
        descripcion: 'Lencería masculina',
        orden: 4,
      },
    }),
    prisma.categoria.upsert({
      where: { slug: 'accesorios' },
      update: {},
      create: {
        nombre: 'Accesorios',
        slug: 'accesorios',
        descripcion: 'Accesorios y complementos',
        orden: 5,
      },
    }),
  ])

  // Crear usuario administrador
  const hashedPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lenceriastore.es' },
    update: {},
    create: {
      email: 'admin@lenceriastore.es',
      name: 'Administrador',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  // Crear algunos productos de ejemplo
  const productos = await Promise.all([
    prisma.producto.upsert({
      where: { slug: 'conjunto-rosa-elegante' },
      update: {},
      create: {
        nombre: 'Conjunto Rosa Elegante',
        slug: 'conjunto-rosa-elegante',
        descripcion: 'Conjunto de lencería en encaje rosa con detalles dorados',
        descripcionCorta: 'Conjunto elegante de 2 piezas',
        precio: 30.00,
        precioOferta: 22.00,
        sku: 'LEN001',
        stock: 15,
        destacado: true,
        nuevo: true,
        genero: 'MUJER',
        tallas: ['S', 'M', 'L', 'XL'],
        colores: ['Rosa', 'Negro', 'Blanco'],
        materiales: ['Encaje', 'Satén'],
        categoriaId: categorias[0].id,
      },
    }),
    prisma.producto.upsert({
      where: { slug: 'body-negro-sensual' },
      update: {},
      create: {
        nombre: 'Body Negro Sensual',
        slug: 'body-negro-sensual',
        descripcion: 'Body de encaje negro con transparencias estratégicas',
        descripcionCorta: 'Body sensual de encaje',
        precio: 25.00,
        precioOferta: 18.00,
        sku: 'LEN002',
        stock: 20,
        destacado: true,
        genero: 'MUJER',
        tallas: ['XS', 'S', 'M', 'L'],
        colores: ['Negro', 'Rojo'],
        materiales: ['Encaje', 'Elástico'],
        categoriaId: categorias[1].id,
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Created: ${categorias.length} categories, ${productos.length} products`)
  console.log(`👤 Admin user: ${adminUser.email} / password: admin123`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })