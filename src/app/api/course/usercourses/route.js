import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST: Get all courses for a specific userId
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing userId in request body." },
        { status: 400 }
      );
    }

    const courses = await prisma.course.findMany({
      where: {
        userId: userId,
        isActive: true,
      },
      include: {
        chapters: { orderBy: { position: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, courses });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
