import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  try {
    const id = params.id; // <-- Correct way to get id
    const body = await req.json();
    const { isActive } = body;
    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "isActive required" },
        { status: 400 }
      );
    }
    await prisma.course.update({
      where: { id: Number(id) },
      data: { isActive },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
