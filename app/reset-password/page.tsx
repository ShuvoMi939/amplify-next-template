"use client";

import { useState } from "react";
import { resetPassword } from "aws-amplify/auth";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await resetPassword({ username: email });
      setSuccess("Password reset link sent to your email.");
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(err.message || "An error occurred");
    }
  };

  return (
    <section className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 w-full rounded border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">
          Reset Password
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </section>
  );
}
