import { db } from "../src/lib/db";
import { hash } from "bcryptjs";

/**
 * Seed script for Pura Esencia catalog.
 * Run with: bun run db:push && bun prisma/seed.ts
 * On Render: this runs as part of the build/release command.
 */
async function seed() {
  console.log("🌱 Seeding Pura Esencia database...");

  // Create store with hashed password
  const hashedPassword = await hash("admin123", 10);

  // Clear existing data (safe re-seed)
  await db.menuItem.deleteMany();
  await db.category.deleteMany();
  await db.restaurant.deleteMany();

  const store = await db.restaurant.create({
    data: {
      name: "Pura Esencia",
      phone: "+573001234567",
      whatsapp: "+573001234567",
      logo: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
      password: hashedPassword,
    },
  });
  console.log(`✅ Store created: ${store.name}`);

  const categoriesData = [
    { name: "Jabones Artesanales", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=200&h=200&fit=crop", sortOrder: 1 },
    { name: "Velas Aromáticas", image: "https://images.unsplash.com/photo-1602874801006-094b8a3b3c6f?w=200&h=200&fit=crop", sortOrder: 2 },
    { name: "Cuidado Facial", image: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=200&h=200&fit=crop", sortOrder: 3 },
    { name: "Aceites Corporales", image: "https://images.unsplash.com/photo-1608580083606-1dadeec3d1a9?w=200&h=200&fit=crop", sortOrder: 4 },
    { name: "Infusiones y Tés", image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop", sortOrder: 5 },
    { name: "Sales y Baños", image: "https://images.unsplash.com/photo-1599751449628-9d4a93b8b0a4?w=200&h=200&fit=crop", sortOrder: 6 },
    { name: "Aromaterapia", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&h=200&fit=crop", sortOrder: 7 },
    { name: "Sets de Regalo", image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=200&h=200&fit=crop", sortOrder: 8 },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const created = await db.category.create({ data: cat });
    categories.push(created);
    console.log(`✅ Category created: ${cat.name}`);
  }

  const menuItemsData = [
    // Jabones Artesanales
    { name: "Jabón de Lavanda y Avena", price: 12, description: "Jabón artesanal de lavanda y avena, 100g. Hecho a mano en lotes de 30 unidades, con aceites esenciales de lavanda orgánica y avena coloidal. Sin fragancias sintéticas, sin colorantes artificiales. Para piel sensible y reactiva. Cada barra es única.", images: JSON.stringify(["https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1599751449708-9d4a93b8b0a4?w=800&h=800&fit=crop"]), likes: 142, isFeatured: true, categoryId: categories[0].id },
    { name: "Jabón de Carbón Activado", price: 14, description: "Jabón purificante con carbón activado, arcilla bentonita y aceite de árbol de té. Ideal para piel mixta o grasa. Profundiza la limpieza sin resecar.", images: JSON.stringify(["https://images.unsplash.com/photo-1599751449708-9d4a93b8b0a4?w=800&h=800&fit=crop"]), likes: 89, isFeatured: false, categoryId: categories[0].id },
    { name: "Jabón de Miel y Leche de Cabra", price: 13, description: "Jabón nutritivo con miel cruda de apiario local y leche de cabra fresca. Rico en vitaminas y enzimas naturales. Hidrata mientras limpia.", images: JSON.stringify(["https://images.unsplash.com/photo-1606922293935-bb1e22e8d3a7?w=800&h=800&fit=crop"]), likes: 67, isFeatured: false, categoryId: categories[0].id },
    // Velas Aromáticas
    { name: "Vela de Soya - Aura Citrus", price: 22, description: "Vela artesanal de cera de soya 100% natural, con mecha de algodón. Aroma cítrico de toronja, naranja y hierbabuena. 40 horas de duración. Hecha a mano en frasco de vidrio reutilizable. Sin parafina.", images: JSON.stringify(["https://images.unsplash.com/photo-1602874801006-094b8a3b3c6f?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop"]), likes: 218, isFeatured: true, categoryId: categories[1].id },
    { name: "Vela de Cera de Abeja - Equilibrio", price: 28, description: "Vela de cera de abeja pura con aceites esenciales de lavanda, geranio y vetiver. La cera de abeja purifica el aire de forma natural. 50 horas de duración.", images: JSON.stringify(["https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=800&fit=crop"]), likes: 156, isFeatured: false, categoryId: categories[1].id },
    { name: "Vela Mini - Nectar Vainilla", price: 14, description: "Vela pequeña de cera de soya con vainilla bourbon de Madagascar y un toque de cacao. 18 horas de duración. Mecha de madera que crepita suavemente.", images: JSON.stringify(["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop"]), likes: 94, isFeatured: false, categoryId: categories[1].id },
    // Cuidado Facial
    { name: "Crema Facial de Rosa Mosqueta", price: 32, description: "Crema facial hidratante con aceite de rosa mosqueta prensado en frío, ácido hialurónico vegetal y extracto de manzanilla. Para piel sensible. Recipiente de vidrio 50ml.", images: JSON.stringify(["https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&h=800&fit=crop"]), likes: 178, isFeatured: true, categoryId: categories[2].id },
    { name: "Tónico Facial de Hamamelis y Rosas", price: 19, description: "Tónico facial a base de hidrosol de rosas, hamamelis orgánico y glicerina vegetal. Equilibra el pH y refresca. Frasco de vidrio 100ml.", images: JSON.stringify(["https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&h=800&fit=crop"]), likes: 113, isFeatured: false, categoryId: categories[2].id },
    { name: "Mascarilla de Arcilla Rosa", price: 24, description: "Mascarilla facial purificante con arcilla rosa, polvo de rosa de Damasco y extracto de manzanilla. Para piel sensible o con rojeces. Frasco de vidrio 60g.", images: JSON.stringify(["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop"]), likes: 87, isFeatured: false, categoryId: categories[2].id },
    // Aceites Corporales
    { name: "Aceite Corporal Nourishing", price: 28, description: "Aceite corporal nutritivo con aceites de almendras dulces, jojoba y vitamina E. Absorción rápida. Con aceite esencial de geranio. Frasco de vidrio 120ml.", images: JSON.stringify(["https://images.unsplash.com/photo-1608580083606-1dadeec3d1a9?w=800&h=800&fit=crop"]), likes: 134, isFeatured: false, categoryId: categories[3].id },
    { name: "Aceite Seco Bruma Citrus", price: 26, description: "Aceite seco en bruma con aceites de coco fraccionado, argán y bergamota. Toque cítrico y energizante. Frasco atomizador 100ml.", images: JSON.stringify(["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop"]), likes: 92, isFeatured: true, categoryId: categories[3].id },
    { name: "Aceite de Masaje Relajante", price: 30, description: "Aceite de masaje con base de almendras dulces y aceites esenciales de lavanda, mejorana y romero. Relaja músculos tensionados. Frasco de vidrio 150ml.", images: JSON.stringify(["https://images.unsplash.com/photo-1606922293935-bb1e22e8d3a7?w=800&h=800&fit=crop"]), likes: 76, isFeatured: false, categoryId: categories[3].id },
    // Infusiones y Tés
    { name: "Infusión Noche Serena", price: 15, description: "Mezcla de hierbas relajantes: manzanilla, pasiflora, melisa y un toque de lavanda. Cosechadas en seco y envasadas a mano. Caja de 20 bolsitas biodegradables.", images: JSON.stringify(["https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=800&fit=crop"]), likes: 145, isFeatured: false, categoryId: categories[4].id },
    { name: "Té Verde con Menta y Jengibre", price: 17, description: "Té verde sencha con menta piperita fresca y jengibre deshidratado. Energizante sin ser estimulante en exceso. Lata de 50g, 25 tazas.", images: JSON.stringify(["https://images.unsplash.com/photo-1597318236338-d4c14c1ee9b9?w=800&h=800&fit=crop"]), likes: 98, isFeatured: true, categoryId: categories[4].id },
    { name: "Infusión Cítrica Matinal", price: 14, description: "Mezcla de cáscara de naranja, limón, manzanilla y un toque de hibisco. Energía suave sin cafeína. Caja de 20 bolsitas biodegradables.", images: JSON.stringify(["https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=800&h=800&fit=crop"]), likes: 71, isFeatured: false, categoryId: categories[4].id },
    // Sales y Baños
    { name: "Sal de Baño Lavanda y Romero", price: 18, description: "Sal marina gruesa con sales de Epsom, flores de lavanda secas, romero y aceite esencial de lavanda. Relaja músculos. Frasco de vidrio 400g.", images: JSON.stringify(["https://images.unsplash.com/photo-1599751449628-9d4a93b8b0a4?w=800&h=800&fit=crop"]), likes: 121, isFeatured: false, categoryId: categories[5].id },
    { name: "Sales Detox de Carbón y Eucalipto", price: 21, description: "Sal de baño detoxificante con carbón activado, sal de Epsom, arcilla negra y eucalipto. Para limpieza profunda. Frasco de vidrio 400g.", images: JSON.stringify(["https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=800&fit=crop"]), likes: 84, isFeatured: false, categoryId: categories[5].id },
    // Aromaterapia
    { name: "Roll-on Relajante Pulse", price: 16, description: "Roll-on de aromaterapia con aceites esenciales de lavanda, manzanilla y vetiver en aceite de jojoba. Frasco de vidrio 10ml con roller de piedra natural.", images: JSON.stringify(["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop"]), likes: 187, isFeatured: true, categoryId: categories[6].id },
    { name: "Difusor de Aroma Esencial", price: 35, description: "Difusor de cerámica porosa con aceite esencial de lavanda, bergamota y sándalo. Libera aroma suave durante 6-8 semanas. Recargable.", images: JSON.stringify(["https://images.unsplash.com/photo-1602874801006-094b8a3b3c6f?w=800&h=800&fit=crop"]), likes: 132, isFeatured: false, categoryId: categories[6].id },
    { name: "Spray de Almohada Sueños", price: 18, description: "Spray de aromaterapia para almohada con lavanda, manzanilla y vainilla. Pulveriza sobre la almohada antes de dormir. Frasco atomizador 100ml.", images: JSON.stringify(["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop"]), likes: 109, isFeatured: false, categoryId: categories[6].id },
    // Sets de Regalo
    { name: "Set Ritual Noche Serena", price: 58, description: "Set de regalo con vela Aura Citrus, infusión Noche Serena, spray de almohada Sueños y roll-on Relajante. Empacado en caja kraft con papel tisú y nota manuscrita. Edición limitada, lotes de 15 unidades.", images: JSON.stringify(["https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&h=800&fit=crop", "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=800&fit=crop"]), likes: 245, isFeatured: true, categoryId: categories[7].id },
    { name: "Set Cuidado Facial Esencial", price: 65, description: "Set completo de skincare: crema facial de rosa mosqueta, tónico de hamamelis y mascarilla de arcilla rosa. Para piel sensible. Empacado en bolsa de tela orgánica.", images: JSON.stringify(["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop"]), likes: 168, isFeatured: false, categoryId: categories[7].id },
    { name: "Mini Set Descubre Pura Esencia", price: 42, description: "Set de descubrimiento con jabón de lavanda, vela mini Nectar, aceite seco mini y roll-on Relajante. Empacado en caja kraft pequeña con notas a mano.", images: JSON.stringify(["https://images.unsplash.com/photo-1599751449708-9d4a93b8b0a4?w=800&h=800&fit=crop"]), likes: 142, isFeatured: false, categoryId: categories[7].id },
  ];

  for (const item of menuItemsData) {
    await db.menuItem.create({ data: item });
  }
  console.log(`✅ ${menuItemsData.length} products created`);

  console.log("🎉 Pura Esencia seed completed!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
