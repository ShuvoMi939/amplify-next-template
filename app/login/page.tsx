"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // or "next/router" if using Pages Router
import { signIn, getCurrentUser } from "aws-amplify/auth";
import {
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          router.push("/dashboard");
        }
      } catch {
        // Not signed in
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
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      const message = err.message || "An error occurred during login.";
      setError(message);

      if (
        message.includes("User is not confirmed") ||
        message.includes("not confirmed")
      ) {
        localStorage.setItem("pendingEmail", email);
        localStorage.setItem("otpTimerExpire", (Date.now() + 60000).toString());
        setTimeout(() => {
          router.push("/register");
        }, 1500);
      }

      if (message.includes("User does not exist")) {
        setTimeout(() => {
          router.push("/register");
        }, 1500);
      }
    }
  };

  return (
    <div className="min-h-fit flex items-center justify-center bg-gray-50 px-4 py-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-2">Welcome back 👋</h2>
        <p className="text-sm text-center text-gray-500 mb-6">Login to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        {success && <p className="text-sm text-green-600 mt-4">{success}</p>}

        <div className="pt-6 mt-6 -mx-8 border-t border-gray-300 text-center text-sm space-y-1">
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
      </div>
    </div>
  );
}
