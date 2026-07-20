import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Combined endpoint: returns all menu data in one request
export async function GET() {
  try {
    const [categories, items, restaurant] = await Promise.all([
      db.category.findMany({
        orderBy: { sortOrder: "asc" },
      }),
      db.menuItem.findMany({
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
      db.restaurant.findFirst(),
    ]);

    // Parse images JSON strings
    const parsedItems = items.map((item) => {
      let images: string[] = [];
      try {
        images = JSON.parse(item.images || "[]");
      } catch {
        images = [];
      }
      return { ...item, images };
    });

    // Remove password from restaurant
    const safeRestaurant = restaurant
      ? (({ password: _, ...rest }) => rest)(restaurant)
      : null;

    return NextResponse.json({
      categories,
      items: parsedItems,
      restaurant: safeRestaurant,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu data" }, { status: 500 });
  }
}
