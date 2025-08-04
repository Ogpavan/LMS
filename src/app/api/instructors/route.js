import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function GET() {
  const instructors = await prisma.user.findMany({
    where: { role: "instructor" },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      mobile: true,
      gender: true,
      status: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ instructors });
}

export async function POST(req) {
  const { username, name, email, password, mobile, gender, role } =
    await req.json();
  if (!username || !name || !email || !password || !mobile || !gender) {
    return NextResponse.json(
      { success: false, error: "Missing fields" },
      { status: 400 }
    );
  }
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "User already exists" },
      { status: 409 }
    );
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      name,
      email,
      password: hashed,
      role: role || "instructor",
      mobile,
      gender,
      status: "pending",
    },
  });
  return NextResponse.json({
    success: true,
    instructor: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      gender: user.gender,
      status: user.status,
    },
  });
}
