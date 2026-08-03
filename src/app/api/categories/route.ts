import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const categoryCreateSchema = z.object({
  name: z.string().min(1).max(100),
  image: z.string().max(500).optional().default(""),
  sortOrder: z.number().int().min(0).optional().default(0),
});

const categoryUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  image: z.string().max(500).optional().default(""),
  sortOrder: z.number().int().min(0).optional().default(0),
  isHidden: z.boolean().optional(),
});

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { menuItems: true } },
      },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = categoryCreateSchema.parse(body);
    const category = await db.category.create({
      data: validated,
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const validated = categoryUpdateSchema.parse(body);
    const { id, ...data } = validated;
    const category = await db.category.update({
      where: { id },
      data,
    });
    return NextResponse.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || id.length > 50) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    await db.menuItem.deleteMany({ where: { categoryId: id } });
    await db.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
