import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req, context) {
  const { id } = await context.params;
  await prisma.user.update({
    where: { id: Number(id) },
    data: { isActive: false },
  });
  return NextResponse.json({ success: true });
}
