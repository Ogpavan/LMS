import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  const { email, password } = await req.json();

  // Find user by email OR username
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: email }, { username: email }],
    },
  });

  // Check if user exists
  if (!user || !user.password) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // Check if email is verified
  if (!user.emailVerified) {
    return NextResponse.json(
      {
        success: false,
        error:
          "Email not verified. Please verify your email before signing in.",
        needsVerification: true,
        email: user.email,
      },
      { status: 403 }
    );
  }

  if (user.role === "instructor" && user.status === "pending") {
    return NextResponse.json(
      {
        success: false,
        error: "Request pending from admin. Please wait for approval.",
        pendingApproval: true,
      },
      { status: 403 }
    );
  }

  // Verify password
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    );
  }

  // If email verified and password valid, create token
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });

  const response = NextResponse.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });

  response.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  response.cookies.set(
    "user",
    JSON.stringify({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }),
    {
      httpOnly: false,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    }
  );

  return response;
}
