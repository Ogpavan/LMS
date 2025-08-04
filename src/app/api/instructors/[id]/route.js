import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(req, { params }) {
  const { id } = params;
  const { username, name, email, mobile, gender } = await req.json();
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { username, name, email, mobile, gender },
  });
  return NextResponse.json({ success: true, instructor: user });
}
