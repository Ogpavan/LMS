import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "@/lib/nodemailer";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  }
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  await prisma.passwordResetOtp.upsert({
    where: { email },
    update: { otpHash, createdAt: new Date() },
    create: { email, otpHash },
  });

  await sendOTPEmail(email, otp);

  return NextResponse.json({ success: true });
}
