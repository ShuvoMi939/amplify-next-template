"use client";

import { useState, useEffect } from "react";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"request" | "confirm">("request");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await resetPassword({ username: email });
      setStep("confirm");
      setMessage("Code sent! Please check your email.");
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || "Error sending reset code.");
    }
  };

  const handleResendCode = async () => {
    setMessage("");
    setError("");

    try {
      await resetPassword({ username: email });
      setMessage("Another code has been sent to your email.");
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
      setMessage("Password updated! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">
          {step === "request" ? "Reset Password 🔐" : "Set New Password"}
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          {step === "request"
            ? "We'll send a code to your email."
            : "Enter the code and your new password."}
        </p>

        {step === "request" && (
          <form onSubmit={handleResetRequest} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Send Reset Code
            </button>
          </form>
        )}

        {step === "confirm" && (
          <form onSubmit={handleConfirmReset} className="space-y-4">
            <input
              type="text"
              placeholder="Verification Code"
              className="w-full px-4 py-2 border rounded-lg"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-2 border rounded-lg"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Update Password
            </button>

            <button
              type="button"
              className="w-full py-1 mt-2 text-sm text-blue-600 underline"
              onClick={() => setStep("request")}
            >
              ← Back to request reset code
            </button>

            <button
              type="button"
              className="w-full text-sm mt-2 text-gray-600 disabled:text-gray-400"
              onClick={handleResendCode}
              disabled={resendTimer > 0}
            >
              {resendTimer > 0
                ? `Resend code in ${resendTimer}s`
                : "Resend Code"}
            </button>
          </form>
        )}

        {(message || error) && (
          <p
            className={`mt-4 text-sm text-center ${
              error ? "text-red-500" : "text-green-600"
            }`}
          >
            {error || message}
          </p>
        )}

        <div className="mt-6 text-center text-sm space-y-1">
          <button
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline"
          >
            Back to Login
          </button>
          <br />
          <button
            onClick={() => router.push("/register")}
            className="text-blue-500 hover:underline"
          >
            Create a new account
          </button>
        </div>
      </div>
    </div>
  );
}
