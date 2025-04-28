"use client";

import { Auth } from "aws-amplify";
import { useState } from "react";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    try {
      await Auth.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Error sending reset code");
    }
  }

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold">Reset Password</h1>
      <p>Send password reset instructions.</p>

      {error && <p className="text-red-500">{error}</p>}
      {sent ? (
        <p className="text-green-500">Reset code sent! Check your email.</p>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="p-2 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" className="w-full py-2 bg-yellow-500 text-white rounded">
            Send Reset Email
          </button>
        </form>
      )}
    </section>
  );
}
