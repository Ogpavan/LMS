"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SignupPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    mobile: "",
    gender: "Male",
    role: "user",
  });
  const [error, setError] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [signupEmail, setSignupEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30); // 30 seconds timer for resend
  const timerRef = useRef();
  const router = useRouter();

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validateMobile = (mobile) => /^\d{10,}$/.test(mobile);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const validateForm = () => {
    if (!form.username) {
      setError("Username is required.");
      return false;
    }
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!validatePassword(form.password)) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (!validateMobile(form.mobile)) {
      setError("Enter a valid mobile number.");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError("");
    setLoading(true); // Show loading
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    let data;
    try {
      data = await res.json();
    } catch {
      setError("Server error. Please try again.");
      setLoading(false);
      return;
    }
    setLoading(false); // Hide loading
    if (data.success) {
      setSignupEmail(form.email);
      setShowOtp(true);
    } else {
      setError(data.error || "Signup failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setVerifying(true);
    const res = await fetch("/api/auth/verifyotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: signupEmail, otp }),
    });
    const data = await res.json();
    setVerifying(false);
    if (data.message) {
      router.push("/signin");
    } else {
      setError(data.error || "Verification failed");
    }
  };

  useEffect(() => {
    if (showOtp && timer > 0) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [showOtp, timer]);

  const handleResendOtp = async () => {
    if (timer > 0) return;
    setResending(true);
    setResendSuccess(false);
    setError("");
    const res = await fetch("/api/auth/resendotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: signupEmail }),
    });
    const data = await res.json();
    setResending(false);
    if (data.success) {
      setResendSuccess(true);
      setTimer(30); // Reset timer
      setTimeout(() => setResendSuccess(false), 3000);
    } else {
      setError(data.error || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-200 absolute inset-0">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        {!showOtp ? (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-3 bg-white rounded-2xl p-8 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]  "
            noValidate
          >
            {/* Header */}
            <div className="mb-4  ">
              <h1 className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">
                Signup
              </h1>
              <p className="text-gray-500 text-sm">
                Create your account to get started
              </p>
            </div>
            {/* Error message */}
            {error && (
              <div className="mb-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            {/* Role selection at the top as centered radio buttons */}
            <div className="flex flex-col items-center">
              <RadioGroup
                name="role"
                value={form.role}
                onValueChange={(value) => setForm({ ...form, role: value })}
                className="flex gap-6 justify-center"
              >
                <label
                  className="flex items-center text-sm"
                  htmlFor="role-user"
                >
                  <RadioGroupItem
                    value="user"
                    id="role-user"
                    className="accent-blue-500 mr-1"
                  />
                  Student
                </label>
                <label
                  className="flex items-center text-sm"
                  htmlFor="role-instructor"
                >
                  <RadioGroupItem
                    value="instructor"
                    id="role-instructor"
                    className="accent-blue-500 mr-1"
                  />
                  Teacher
                </label>
              </RadioGroup>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Username
              </label>
              <Input
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                className="  "
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Email</label>
              <Input
                name="email"
                type="email"
                placeholder="example@gmail.com"
                value={form.email}
                onChange={handleChange}
                className="  "
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Password
              </label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="  "
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Mobile
              </label>
              <Input
                name="mobile"
                type="tel"
                placeholder="+91 9876543210"
                value={form.mobile}
                onChange={handleChange}
                className=" "
                required
                pattern="^\+\d{1,3}\s?\d{10,}$"
                title="Please enter mobile number with country code, e.g. +91 XXXXXXXXX"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 rounded-full transition disabled:cursor-not-allowed shadow-sm"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            <p className="text-center text-xs text-gray-500">
              Already have an account?{" "}
              <a
                href="/signin"
                className="text-blue-500 hover:underline font-medium"
              >
                Sign In
              </a>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyOtp}
            className="w-full max-w-sm space-y-6 bg-white rounded-2xl shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]   p-8"
          >
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">
                Verify OTP
              </h1>
              <p className="text-gray-500 text-sm">
                Enter the OTP sent to your email
              </p>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-lg text-xs">
                {error}
              </div>
            )}
            {resendSuccess && (
              <div className="bg-green-50 border border-green-100 text-green-600 px-3 py-2 rounded-lg text-xs">
                OTP sent successfully!
              </div>
            )}
            <div className="space-y-1 w-full">
              <p className="text-xs font-medium text-gray-700 text-center w-full">
                Enter OTP
              </p>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  disabled={verifying}
                >
                  <InputOTPGroup>
                    {[...Array(6)].map((_, i) =>
                      i === 2 ? (
                        <React.Fragment key={`slot-${i}`}>
                          <InputOTPSlot index={i} />
                          <span
                            key="hyphen"
                            className="mx-2 text-xl font-bold text-gray-400 select-none"
                          >
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
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 rounded-full transition disabled:cursor-not-allowed shadow-sm"
              disabled={verifying || otp.length !== 6}
            >
              {verifying ? "Verifying..." : "Verify"}
            </Button>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending || timer > 0}
              className={`w-full   text-gray-800 py-2 rounded-full   transition ${
                timer > 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {resending
                ? "Sending..."
                : timer > 0
                ? `Resend OTP (${timer}s)`
                : "Resend OTP"}
            </button>
            <div className="text-center text-xs text-gray-500 mt-2">
              Didn't get the OTP? Check your spam folder.
            </div>
          </form>
        )}
      </div>
      {/* Right Side - Dashboard Preview (minimal for Apple style) */}
    </div>
  );
}
