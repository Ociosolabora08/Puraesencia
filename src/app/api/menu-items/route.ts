import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const menuItemCreateSchema = z.object({
  name: z.string().min(1).max(200),
  price: z.number().int().min(0),
  description: z.string().max(1000).optional().default(""),
  images: z.array(z.string().max(500)).max(5).optional().default([]),
  likes: z.number().int().min(0).optional().default(0),
  isFeatured: z.boolean().optional().default(false),
  categoryId: z.string().min(1),
});

const menuItemUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200).optional(),
  price: z.number().int().min(0).optional(),
  description: z.string().max(1000).optional(),
  images: z.array(z.string().max(500)).max(5).optional(),
  likes: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isHidden: z.boolean().optional(),
  categoryId: z.string().min(1).optional(),
});

export async function GET() {
  try {
    const items = await db.menuItem.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    const parsed = items.map((item) => {
      let images: string[] = [];
      try {
        images = JSON.parse(item.images || "[]");
      } catch {
        images = [];
      }
      return { ...item, images };
    });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu items" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = menuItemCreateSchema.parse(body);
    const item = await db.menuItem.create({
      data: {
        name: validated.name,
        price: validated.price,
        description: validated.description,
        images: JSON.stringify(validated.images),
        likes: validated.likes,
        isFeatured: validated.isFeatured,
        categoryId: validated.categoryId,
      },
      include: { category: true },
    });
    return NextResponse.json(
      { ...item, images: JSON.parse(item.images || "[]") },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = menuItemUpdateSchema.parse(body);
    const { id, ...data } = validated;

    const updateData: Record<string, unknown> = { ...data };
    if (data.images) {
      updateData.images = JSON.stringify(data.images);
    }

    const item = await db.menuItem.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });
    return NextResponse.json({ ...item, images: JSON.parse(item.images || "[]") });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || id.length > 50) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    await db.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}
