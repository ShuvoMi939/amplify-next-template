"use client";

import { Auth } from "aws-amplify";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: { email },
      });
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Error signing up");
    }
  }

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold">Register</h1>
      <p>Create a new account.</p>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full py-2 bg-green-500 text-white rounded">
          Register
        </button>
      </form>
    </section>
  );
}
