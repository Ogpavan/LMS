"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  PasswordInput, // <-- import from input-otp
} from "@/components/ui/input-otp";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: email, 2: otp+new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setStep(2);
      setSuccessMsg("OTP sent to your email!");
    } else {
      setError(data.error || "Failed to send OTP");
    }
  };

  // Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setSuccessMsg("Password reset successful! You can now sign in.");
      setStep(3);
    } else {
      setError(data.error || "Failed to reset password");
    }
  };

  return (
    <div className="min-h-screen inset-0 absolute flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
      <form
        className="w-full max-w-sm space-y-6 bg-white rounded-2xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] p-8"
        onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
      >
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">
            Forgot Password
          </h1>
          <p className="text-gray-500 text-sm">
            {step === 1
              ? "Enter your email to receive a password reset OTP"
              : "Enter the OTP and your new password"}
          </p>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-lg text-xs text-center">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-100 text-green-600 px-3 py-2 rounded-lg text-xs text-center">
            {successMsg}
          </div>
        )}
        {step === 1 && (
          <>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 rounded-full transition disabled:cursor-not-allowed shadow-sm"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </>
        )}
        {step === 2 && (
          <>
            <div className="space-y-1 w-full">
              <label className="text-xs font-medium text-gray-700 text-center w-full">
                Enter OTP
              </label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={loading}
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) =>
                      i === 2 ? (
                        <React.Fragment key={`slot-${i}`}>
                          <InputOTPSlot index={i} />
                          <span className="mx-2 text-xl font-bold text-gray-400 select-none">
                            -
                          </span>
                        </React.Fragment>
                      ) : (
                        <InputOTPSlot key={`slot-${i}`} index={i} />
                      )
                    )}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                New Password
              </label>
              <PasswordInput
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                show={showPassword}
                setShow={setShowPassword}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Confirm Password
              </label>
              <PasswordInput
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                show={showConfirm}
                setShow={setShowConfirm}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 rounded-full transition disabled:cursor-not-allowed shadow-sm"
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </>
        )}
        {step === 3 && (
          <Button
            type="button"
            className="w-full bg-blue-500 text-white font-medium py-2 rounded-full"
            onClick={() => (window.location.href = "/signin")}
          >
            Go to Sign In
          </Button>
        )}
        <p className="text-center text-xs text-gray-500 mt-2">
          Remembered your password?{" "}
          <a
            href="/signin"
            className="text-blue-500 hover:underline font-medium"
          >
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
