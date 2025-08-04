import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { id } = params;
  await prisma.user.update({
    where: { id: Number(id) },
    data: { status: "active" },
  });
  return NextResponse.json({ success: true });
}
