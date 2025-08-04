"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setVerifying(true);
    const res = await fetch("/api/auth/verifyotp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    setVerifying(false);
    if (data.message) {
      router.push("/signin");
    } else {
      setError(data.error || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow w-80 space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">Verify OTP</h2>
        {error && <div className="text-red-500">{error}</div>}
        <input
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="otp"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
          disabled={verifying}
        >
          {verifying ? "Verifying..." : "Verify"}
        </button>
        <div className="text-sm mt-2">
          Didn't get the OTP? Check your spam folder.
        </div>
      </form>
    </div>
  );
}
