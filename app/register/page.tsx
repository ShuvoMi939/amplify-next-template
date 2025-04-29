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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create an Account 📝</h2>
        <p className="text-sm text-gray-500 mb-6">Register to start using the app</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        {success && <p className="text-sm text-green-600 mt-4">{success}</p>}

        <div className="mt-6 text-center text-sm space-y-1">
          <button onClick={() => router.push("/login")} className="text-blue-500 hover:underline">
            Already have an account? Login
          </button>
          <br />
          <button onClick={() => router.push("/reset-password")} className="text-blue-500 hover:underline">
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
