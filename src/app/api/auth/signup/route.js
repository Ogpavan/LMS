import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/nodemailer";

const prisma = new PrismaClient();

export async function POST(req) {
  const { username, email, password, role, mobile, gender } = await req.json();
  if (!username || !email || !password || !mobile || !gender) {
    return NextResponse.json(
      { success: false, error: "Missing fields" },
      { status: 400 }
    );
  }
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existingUser) {
    return NextResponse.json(
      { success: false, error: "User already exists" },
      { status: 409 }
    );
  }
  // Check if OTP signup already exists
  const existingOtp = await prisma.otp.findUnique({ where: { email } });
  if (existingOtp) {
    // Optionally, you can allow resending OTP here
  }
  // Hash password and OTP
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  // Store OTP and signup info in Otp table
  await prisma.otp.upsert({
    where: { email },
    update: {
      username,
      password: hashedPassword,
      role: role || "user",
      mobile,
      gender,
      otpHash,
      createdAt: new Date(),
    },
    create: {
      email,
      username,
      password: hashedPassword,
      role: role || "user",
      mobile,
      gender,
      otpHash,
    },
  });

  await sendOTPEmail(email, otp);

  return NextResponse.json({ success: true });
}
