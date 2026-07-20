import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcryptjs";

export async function GET() {
  try {
    const restaurant = await db.restaurant.findFirst();
    if (!restaurant) {
      return NextResponse.json({ error: "No restaurant found" }, { status: 404 });
    }
    const { password: _, ...safe } = restaurant;
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: "Failed to fetch restaurant" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const restaurant = await db.restaurant.findFirst();
    if (!restaurant) {
      return NextResponse.json({ error: "No restaurant found" }, { status: 404 });
    }

    const updateData: Record<string, string> = {};

    // Validate and sanitize inputs
    if (body.name && typeof body.name === "string" && body.name.length <= 100) {
      updateData.name = body.name.trim();
    }
    if (body.phone && typeof body.phone === "string" && body.phone.length <= 20) {
      updateData.phone = body.phone.trim();
    }
    if (body.whatsapp && typeof body.whatsapp === "string" && body.whatsapp.length <= 20) {
      updateData.whatsapp = body.whatsapp.trim();
    }
    if (body.logo && typeof body.logo === "string" && body.logo.length <= 500) {
      updateData.logo = body.logo.trim();
    }

    // Handle password change separately
    if (body.newPassword && typeof body.newPassword === "string") {
      if (body.newPassword.length < 4) {
        return NextResponse.json(
          { error: "La contraseña debe tener al menos 4 caracteres" },
          { status: 400 }
        );
      }
      const hashedPassword = await hash(body.newPassword, 10);
      updateData.password = hashedPassword;
    }

    const updated = await db.restaurant.update({
      where: { id: restaurant.id },
      data: updateData,
    });

    const { password: _, ...safe } = updated;
    return NextResponse.json(safe);
  } catch {
    return NextResponse.json({ error: "Failed to update restaurant" }, { status: 500 });
  }
}
