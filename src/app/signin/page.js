"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SigninPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const router = useRouter();

  // Simple validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const validateForm = () => {
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!validatePassword(form.password)) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
      } else {
        setError(data.error || "Signin failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-200 absolute inset-0">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <form
          className="w-full max-w-sm space-y-6 bg-white rounded-2xl p-8"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Header */}
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900 font-sans tracking-tight">
              Sign In
            </h1>
            <p className="text-gray-500 text-sm">
              Enter your credentials to continue
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-lg text-xs">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={form.email}
              onChange={handleChange}
              className={
                touched.email && !validateEmail(form.email)
                  ? "border-red-400"
                  : ""
              }
              required
            />
            {touched.email && !validateEmail(form.email) && (
              <span className="text-xs text-red-500">
                Invalid email address.
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-700">
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-xs text-blue-500 hover:underline"
              >
                Forgot?
              </a>
            </div>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={
                  touched.password && !validatePassword(form.password)
                    ? "border-red-400"
                    : ""
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {touched.password && !validatePassword(form.password) && (
              <span className="text-xs text-red-500">
                Password must be at least 6 characters.
              </span>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-500 rounded focus:ring-blue-400 border-gray-300"
              required
            />
            <label className="text-xs text-gray-500">
              I agree to the{" "}
              <a href="/terms" className="text-blue-500 hover:underline">
                Terms & Privacy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-2 rounded-full transition disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-xs text-gray-500">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-blue-500 hover:underline font-medium"
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
      {/* Right Side - Dashboard Preview */}
      {/* You can reduce this section or keep it minimal for Apple style */}
    </div>
  );
}
