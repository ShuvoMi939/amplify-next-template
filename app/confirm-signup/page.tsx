"use client";

import { useState } from "react";
import { confirmSignUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function ConfirmSignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      setMessage("Email confirmed! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setMessage(err.message || "Confirmation failed.");
    }
  };

  return (
    <section className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Confirm Email</h1>
      <p className="mb-4">Check your email for a verification code.</p>
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
        <button className="w-full py-2 bg-blue-500 text-white rounded">Confirm</button>
      </form>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </section>
  );
}
