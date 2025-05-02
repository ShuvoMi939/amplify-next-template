"use client";

import { useState } from "react";
import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  fetchAuthSession,
} from "aws-amplify/auth";
import { useRouter } from "next/navigation";

type Step = "email" | "otp" | "set-password" | "login-password";

export default function SmartAuth() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const checkEmail = async () => {
    setError("");
    setMessage("");

    try {
      // Try to sign in with a dummy password to check existence
      await signIn({ username: email, password: "wrong-pass-123" });
    } catch (err: any) {
      if (err.name === "NotAuthorizedException") {
        setStep("login-password");
      } else if (err.name === "UserNotConfirmedException") {
        await resendSignUpCode({ username: email });
        setStep("otp");
        setMessage("Email found but not confirmed. OTP sent.");
      } else if (err.name === "UserNotFoundException") {
        await signUp({
          username: email,
          password: "Dummy#1234", // Dummy password to register user temporarily
          options: { userAttributes: { email } },
        });
        setMessage("OTP sent to new user.");
        setStep("otp");
      } else {
        setError(err.message || "Something went wrong.");
      }
    }
  };

  const verifyOtp = async () => {
    setError("");
    setMessage("");

    try {
      await confirmSignUp({ username: email, confirmationCode: otp });
      setStep("set-password");
      setMessage("OTP verified. Set your password.");
    } catch (err: any) {
      setError(err.message || "OTP verification failed.");
    }
  };

  const handleSetPassword = async () => {
    setError("");
    setMessage("");

    try {
      // Delete dummy user and recreate properly
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      await confirmSignUp({ username: email, confirmationCode: otp }); // reuse previous OTP
      await signIn({ username: email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    }
  };

  const handleLogin = async () => {
    setError("");
    setMessage("");

    try {
      await signIn({ username: email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {step === "email" && "Enter your email"}
          {step === "otp" && "Enter OTP sent to email"}
          {step === "login-password" && "Enter your password"}
          {step === "set-password" && "Set your password"}
        </h2>

        {step === "email" && (
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border px-4 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              onClick={checkEmail}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Submit
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border px-4 py-2 rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Submit OTP
            </button>
          </div>
        )}

        {step === "login-password" && (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              className="w-full border px-4 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Login
            </button>
          </div>
        )}

        {step === "set-password" && (
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Set Password"
              className="w-full border px-4 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              onClick={handleSetPassword}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Save Password & Login
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        {message && <p className="text-sm text-green-600 mt-4">{message}</p>}

        <div className="text-center text-sm mt-6">
          <button
            onClick={() => router.push("/reset-password")}
            className="text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}
