"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, getCurrentUser } from "aws-amplify/auth";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔒 Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          router.push("/dashboard");
        }
      } catch {
        // not logged in, stay on login page
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await signIn({ username: email, password });
      setSuccess("Login successful!");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <section className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="mb-4">Login to your account.</p>

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
          type="password"
          placeholder="Password"
          className="p-2 w-full rounded border"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded"
        >
          Login
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}

      <div className="mt-6 text-center space-y-2">
        <button
          onClick={() => router.push("/register")}
          className="text-blue-500 hover:underline"
        >
          Create an account
        </button>
        <br />
        <button
          onClick={() => router.push("/reset-password")}
          className="text-blue-500 hover:underline"
        >
          Forgot password?
        </button>
      </div>
    </section>
  );
}
