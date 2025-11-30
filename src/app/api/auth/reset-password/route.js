import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, otp, newPassword } = await req.json();
  const otpRecord = await prisma.passwordResetOtp.findUnique({
    where: { email },
  });
  if (!otpRecord) {
    return NextResponse.json(
      { success: false, error: "OTP not found" },
      { status: 404 }
    );
  }
  const valid = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!valid) {
    return NextResponse.json(
      { success: false, error: "Invalid OTP" },
      { status: 401 }
    );
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });
  await prisma.passwordResetOtp.delete({ where: { email } });

  return NextResponse.json({ success: true });
}
