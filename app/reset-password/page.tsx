"use client";

import { useState } from "react";
import { resetPassword } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await resetPassword({ username: email });
      setSuccess("Check your email for the verification code.");
      setTimeout(() => router.push("/confirm-reset-password"), 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password 🔐</h2>
        <p className="text-sm text-gray-500 mb-6">We'll send you a code to reset your password</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send Reset Code
          </button>
        </form>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        {success && <p className="text-sm text-green-600 mt-4">{success}</p>}

        <div className="mt-6 text-center text-sm space-y-1">
          <button onClick={() => router.push("/login")} className="text-blue-500 hover:underline">
            Back to Login
          </button>
          <br />
          <button onClick={() => router.push("/register")} className="text-blue-500 hover:underline">
            Create a new account
          </button>
        </div>
      </div>
    </div>
  );
}
