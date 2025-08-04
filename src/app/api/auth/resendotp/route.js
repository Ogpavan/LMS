import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { sendOTPEmail } from "@/lib/nodemailer";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Verify user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  // Store OTP in DB (upsert for repeat signup)
  await prisma.otp.upsert({
    where: { email },
    update: { otpHash, createdAt: new Date() },
    create: { email, otpHash },
  });

  // Send OTP via email
  await sendOTPEmail(email, otp);

  return NextResponse.json({ success: true });
}
