export interface Category {
  id: string;
  name: string;
  image: string;
  sortOrder: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  likes: number;
  isFeatured: boolean;
  categoryId: string;
}

export const storeInfo = {
  name: "Pura Esencia",
  phone: "+573001234567",
  whatsapp: "+573001234567",
  logo: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&h=200&fit=crop",
};

/**
 * Pura Esencia — Catálogo de productos artesanales
 * Categorías alineadas al brief: jabones, velas, skincare, aceites, infusiones, sets de regalo
 * Precios en USD (segmento medio-accesible: entry $8-15, core $18-35, premium $40-70)
 */
export const categories: Category[] = [
  {
    id: "jabones",
    name: "Jabones Artesanales",
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=200&h=200&fit=crop",
    sortOrder: 1,
  },
  {
    id: "velas",
    name: "Velas Aromáticas",
    image: "https://images.unsplash.com/photo-1602874801006-094b8a3b3c6f?w=200&h=200&fit=crop",
    sortOrder: 2,
  },
  {
    id: "skincare",
    name: "Cuidado Facial",
    image: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=200&h=200&fit=crop",
    sortOrder: 3,
  },
  {
    id: "aceites",
    name: "Aceites Corporales",
    image: "https://images.unsplash.com/photo-1608580083606-1dadeec3d1a9?w=200&h=200&fit=crop",
    sortOrder: 4,
  },
  {
    id: "infusiones",
    name: "Infusiones y Tés",
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&h=200&fit=crop",
    sortOrder: 5,
  },
  {
    id: "bano",
    name: "Sales y Baños",
    image: "https://images.unsplash.com/photo-1599751449628-9d4a93b8b0a4?w=200&h=200&fit=crop",
    sortOrder: 6,
  },
  {
    id: "aromaterapia",
    name: "Aromaterapia",
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&h=200&fit=crop",
    sortOrder: 7,
  },
  {
    id: "sets",
    name: "Sets de Regalo",
    image: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=200&h=200&fit=crop",
    sortOrder: 8,
  },
];

export const menuItems: MenuItem[] = [
  // Jabones Artesanales
  {
    id: "item-1",
    name: "Jabón de Lavanda y Avena",
    price: 12,
    description:
      "Jabón artesanal de lavanda y avena, 100g. Hecho a mano en lotes de 30 unidades, con aceites esenciales de lavanda orgánica y avena coloidal. Sin fragancias sintéticas, sin colorantes artificiales. Para piel sensible y reactiva. Cada barra es única.",
    images: [
      "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1599751449708-9d4a93b8b0a4?w=800&h=800&fit=crop",
    ],
    likes: 142,
    isFeatured: true,
    categoryId: "jabones",
  },
  {
    id: "item-2",
    name: "Jabón de Carbón Activado",
    price: 14,
    description:
      "Jabón purificante con carbón activado, arcilla bentonita y aceite de árbol de té. Ideal para piel mixta o grasa. Profundiza la limpieza sin resecar, dejando la piel fresca y equilibrada. Hecho a mano en pequeños lotes.",
    images: [
      "https://images.unsplash.com/photo-1599751449708-9d4a93b8b0a4?w=800&h=800&fit=crop",
    ],
    likes: 89,
    isFeatured: false,
    categoryId: "jabones",
  },
  {
    id: "item-3",
    name: "Jabón de Miel y Leche de Cabra",
    price: 13,
    description:
      "Jabón nutritivo con miel cruda de apiario local y leche de cabra fresca. Rico en vitaminas y enzimas naturales. Hidrata mientras limpia, ideal para piel seca o madura. Con un toque de aceite de almendras dulces.",
    images: [
      "https://images.unsplash.com/photo-1606922293935-bb1e22e8d3a7?w=800&h=800&fit=crop",
    ],
    likes: 67,
    isFeatured: false,
    categoryId: "jabones",
  },

  // Velas Aromáticas
  {
    id: "item-4",
    name: "Vela de Soya - Aura Citrus",
    price: 22,
    description:
      "Vela artesanal de cera de soya 100% natural, con mecha de algodón. Aroma cítrico de toronja, naranja y un toque de hierbabuena. Duración aproximada 40 horas. Hecha a mano en frasco de vidrio reutilizable. Sin parafina, sin negrillo.",
    images: [
      "https://images.unsplash.com/photo-1602874801006-094b8a3b3c6f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop",
    ],
    likes: 218,
    isFeatured: true,
    categoryId: "velas",
  },
  {
    id: "item-5",
    name: "Vela de Cera de Abeja - Equilibrio",
    price: 28,
    description:
      "Vela de cera de abeja pura con aceites esenciales de lavanda, geranio y vetiver. Para momentos de calma y equilibrio. La cera de abeja purifica el aire de forma natural al quemarse. 50 horas de duración. Frasco de vidrio soplado.",
    images: [
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=800&fit=crop",
    ],
    likes: 156,
    isFeatured: false,
    categoryId: "velas",
  },
  {
    id: "item-6",
    name: "Vela Mini - Nectar Vainilla",
    price: 14,
    description:
      "Vela pequeña de cera de soya con vainilla bourbon de Madagascar y un toque de cacao. Perfecta para espacios pequeños o como regalo. 18 horas de duración. Hecha a mano con mecha de madera que crepita suavemente.",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop",
    ],
    likes: 94,
    isFeatured: false,
    categoryId: "velas",
  },

  // Cuidado Facial
  {
    id: "item-7",
    name: "Crema Facial de Rosa Mosqueta",
    price: 32,
    description:
      "Crema facial hidratante con aceite de rosa mosqueta prensado en frío, ácido hialurónico vegetal y extracto de manzanilla. Para piel sensible, con tendencia a irritaciones o cicatrices. Recipiente de vidrio oscuro 50ml. Hecha en lotes pequeños.",
    images: [
      "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&h=800&fit=crop",
    ],
    likes: 178,
    isFeatured: true,
    categoryId: "skincare",
  },
  {
    id: "item-8",
    name: "Tónico Facial de Hamamelis y Rosas",
    price: 19,
    description:
      "Tónico facial a base de hidrosol de rosas, hamamelis orgánico y un toque de glicerina vegetal. Equilibra el pH, refresca y prepara la piel para la hidratación. Apto para todo tipo de piel. Frasco de vidrio 100ml con atomizador.",
    images: [
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=800&h=800&fit=crop",
    ],
    likes: 113,
    isFeatured: false,
    categoryId: "skincare",
  },
  {
    id: "item-9",
    name: "Mascarilla de Arcilla Rosa",
    price: 24,
    description:
      "Mascarcilla facial purificante con arcilla rosa, polvo de rosa de Damasco y extracto de manzanilla. Para piel sensible o con rojeces. Suaviza, calma y aporta luminosidad. Frasco de vidrio 60g. Rinde aproximadamente 10 aplicaciones.",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
    ],
    likes: 87,
    isFeatured: false,
    categoryId: "skincare",
  },

  // Aceites Corporales
  {
    id: "item-10",
    name: "Aceite Corporal Nourishing",
    price: 28,
    description:
      "Aceite corporal nutritivo con aceites de almendras dulces, jojoba y vitamina E. Absorción rápida, no grasoso. Hidrata profundamente dejando la piel suave y luminosa. Con un toque de aceite esencial de geranio. Frasco de vidrio 120ml.",
    images: [
      "https://images.unsplash.com/photo-1608580083606-1dadeec3d1a9?w=800&h=800&fit=crop",
    ],
    likes: 134,
    isFeatured: false,
    categoryId: "aceites",
  },
  {
    id: "item-11",
    name: "Aceite Seco Bruma Citrus",
    price: 26,
    description:
      "Aceite seco en bruma con aceites de coco fraccionado, argán y bergamota. Toque cítrico y energizante. Se absorbe al instante sin dejar sensación grasosa, ideal para usar después del baño. Frasco atomizador 100ml.",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop",
    ],
    likes: 92,
    isFeatured: true,
    categoryId: "aceites",
  },
  {
    id: "item-12",
    name: "Aceite de Masaje Relajante",
    price: 30,
    description:
      "Aceite de masaje con base de almendras dulces y aceites esenciales de lavanda, mejorana y romero. Relaja músculos tensionados, ideal para uso nocturno. Textura sedosa que se desliza suavemente. Frasco de vidrio 150ml.",
    images: [
      "https://images.unsplash.com/photo-1606922293935-bb1e22e8d3a7?w=800&h=800&fit=crop",
    ],
    likes: 76,
    isFeatured: false,
    categoryId: "aceites",
  },

  // Infusiones y Tés
  {
    id: "item-13",
    name: "Infusión Noche Serena",
    price: 15,
    description:
      "Mezcla de hierbas relajantes: manzanilla, pasiflora, melisa y un toque de lavanda. Cosechadas en seco y envasadas a mano. Caja de 20 bolsitas biodegradables. Ideal para la hora del té nocturna. Sin cafeína, sin aromatizantes.",
    images: [
      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&h=800&fit=crop",
    ],
    likes: 145,
    isFeatured: false,
    categoryId: "infusiones",
  },
  {
    id: "item-14",
    name: "Té Verde con Menta y Jengibre",
    price: 17,
    description:
      "Té verde sencha con menta piperita fresca y jengibre deshidratado. Energizante sin ser estimulante en exceso. Antioxidante y digestivo. Lata de 50g, aproximadamente 25 tazas. Hierbas secas seleccionadas a mano.",
    images: [
      "https://images.unsplash.com/photo-1597318236338-d4c14c1ee9b9?w=800&h=800&fit=crop",
    ],
    likes: 98,
    isFeatured: true,
    categoryId: "infusiones",
  },
  {
    id: "item-15",
    name: "Infusión Cítrica Matinal",
    price: 14,
    description:
      "Mezcla de cáscara de naranja, limón, manzanilla y un toque de hibisco. Energía suave sin cafeína, perfecta para empezar el día. Caja de 20 bolsitas biodegradables. Hecha con frutas deshidratadas a mano.",
    images: [
      "https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=800&h=800&fit=crop",
    ],
    likes: 71,
    isFeatured: false,
    categoryId: "infusiones",
  },

  // Sales y Baños
  {
    id: "item-16",
    name: "Sal de Baño Lavanda y Romero",
    price: 18,
    description:
      "Sal marina gruesa con sales de Epsom, flores de lavanda secas, romero y aceite esencial de lavanda. Relaja músculos y calma la mente. Frasco de vidrio 400g. Suficiente para 8-10 baños. Hecha a mano en lotes pequeños.",
    images: [
      "https://images.unsplash.com/photo-1599751449628-9d4a93b8b0a4?w=800&h=800&fit=crop",
    ],
    likes: 121,
    isFeatured: false,
    categoryId: "bano",
  },
  {
    id: "item-17",
    name: "Sales Detox de Carbón y Eucalipto",
    price: 21,
    description:
      "Sal de baño detoxificante con carbón activado, sal de Epsom, arcilla negra y eucalipto. Para una limpieza profunda después de un día largo. Frasco de vidrio 400g. Aproximadamente 8 baños. Sin colorantes artificiales.",
    images: [
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=800&fit=crop",
    ],
    likes: 84,
    isFeatured: false,
    categoryId: "bano",
  },

  // Aromaterapia
  {
    id: "item-18",
    name: "Roll-on Relajante Pulse",
    price: 16,
    description:
      "Roll-on de aromaterapia con aceites esenciales de lavanda, manzanilla y vetiver en aceite de jojoba. Aplicar en sienes, muñecas y cuello para momentos de calma. Frasco de vidrio 10ml con roller de piedra natural. Pequeño y portátil.",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&h=800&fit=crop",
    ],
    likes: 187,
    isFeatured: true,
    categoryId: "aromaterapia",
  },
  {
    id: "item-19",
    name: "Difusor de Aroma Esencial",
    price: 35,
    description:
      "Difusor de cerámica porosa con aceite esencial de lavanda, bergamota y sándalo. Libera aroma suave durante 6-8 semanas. Recargable. Para espacios pequeños, escritorio o mesa de noche. Hecho a mano, cada pieza es única.",
    images: [
      "https://images.unsplash.com/photo-1602874801006-094b8a3b3c6f?w=800&h=800&fit=crop",
    ],
    likes: 132,
    isFeatured: false,
    categoryId: "aromaterapia",
  },
  {
    id: "item-20",
    name: "Spray de Almohada Sueños",
    price: 18,
    description:
      "Spray de aromaterapia para almohada con lavanda, manzanilla y un toque de vainilla. Pulveriza sobre la almohada antes de dormir para crear un ritual de descanso. Frasco atomizador 100ml. Sin alcohol, sin conservantes agresivos.",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
    ],
    likes: 109,
    isFeatured: false,
    categoryId: "aromaterapia",
  },

  // Sets de Regalo
  {
    id: "item-21",
    name: "Set Ritual Noche Serena",
    price: 58,
    description:
      "Set de regalo con vela Aura Citrus (mediana), infusión Noche Serena, spray de almohada Sueños y roll-on Relajante. Empacado en caja kraft con papel tisú y nota manuscrita. Edición limitada, lotes de 15 unidades.",
    images: [
      "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&h=800&fit=crop",
    ],
    likes: 245,
    isFeatured: true,
    categoryId: "sets",
  },
  {
    id: "item-22",
    name: "Set Cuidado Facial Esencial",
    price: 65,
    description:
      "Set completo de skincare: crema facial de rosa mosqueta, tónico de hamamelis y mascarilla de arcilla rosa. Para piel sensible. Empacado en bolsa de tela orgánica con tarjeta de instrucciones. La rutina completa en una caja.",
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=800&fit=crop",
    ],
    likes: 168,
    isFeatured: false,
    categoryId: "sets",
  },
  {
    id: "item-23",
    name: "Mini Set Descubre Pura Esencia",
    price: 42,
    description:
      "Set de descubrimiento con jabón de lavanda, vela mini Nectar, aceite seco mini y roll-on Relajante. Empacado en caja kraft pequeña con notas a mano. La manera perfecta de conocer nuestras esencias. Edición de bienvenida.",
    images: [
      "https://images.unsplash.com/photo-1599751449708-9d4a93b8b0a4?w=800&h=800&fit=crop",
    ],
    likes: 142,
    isFeatured: false,
    categoryId: "sets",
  },
];

export const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "pt", name: "Português", flag: "🇧🇷" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
