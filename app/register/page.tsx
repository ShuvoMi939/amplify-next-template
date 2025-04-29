"use client";

import { useState } from "react";
import { signUp } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: { email },
        },
      });
      setSuccess("Registration successful! Please confirm your email.");
      setTimeout(() => router.push("/confirm-signup"), 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <section className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" className="p-2 w-full rounded border" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="p-2 w-full rounded border" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded">Register</button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </section>
  );
}
