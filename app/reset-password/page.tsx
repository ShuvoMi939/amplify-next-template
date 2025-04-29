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
    <section className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" className="p-2 w-full rounded border" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">Send Reset Code</button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </section>
  );
}
