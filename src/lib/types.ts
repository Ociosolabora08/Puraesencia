// Tipos compartidos catálogo (server → client props, serializables)
export interface CatalogCategory {
  id: string;
  name: string;
  image: string;
  sortOrder: number;
}

export interface CatalogItem {
  id: string;
  name: string;
  slug: string | null;
  price: number;
  description: string;
  images: string[];
  imageBlur: string;
  isFeatured: boolean;
  categoryId: string;
}

export interface CatalogStore {
  name: string;
  whatsapp: string;
  phone: string;
  logo: string;
}

// Enlaces de redes (placeholders — actualizar con las cuentas reales de la marca)
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/puraesencia",
  tiktok: "https://www.tiktok.com/@puraesencia",
  whatsapp: "https://wa.me/573023087321",
};
