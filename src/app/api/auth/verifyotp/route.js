import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req) {
  const { email, otp } = await req.json();
  const otpRecord = await prisma.otp.findUnique({ where: { email } });
  if (!otpRecord) {
    return NextResponse.json({ error: "OTP not found" }, { status: 404 });
  }
  const valid = await bcrypt.compare(otp, otpRecord.otpHash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
  }
  // Create user now
  const user = await prisma.user.create({
    data: {
      username: otpRecord.username,
      email: otpRecord.email,
      password: otpRecord.password,
      role: otpRecord.role,
      mobile: otpRecord.mobile,
      gender: otpRecord.gender,
      status: otpRecord.role === "instructor" ? "pending" : "active",
      emailVerified: true,
    },
  });
  // Delete OTP record
  await prisma.otp.delete({ where: { email } });

  return NextResponse.json({ message: "Verified", user });
}
