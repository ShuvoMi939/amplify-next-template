"use client";

import { useState } from "react";
import { confirmResetPassword } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function ConfirmResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      setMessage("Password updated! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setMessage(err.message || "Reset confirmation failed.");
    }
  };

  return (
    <section className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Set New Password</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 w-full rounded border"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Verification Code"
          className="p-2 w-full rounded border"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          className="p-2 w-full rounded border"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button className="w-full py-2 bg-blue-500 text-white rounded">Set Password</button>
      </form>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </section>
  );
}
