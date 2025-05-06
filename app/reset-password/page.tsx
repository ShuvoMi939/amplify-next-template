"use client";

import { useState, useEffect } from "react";
import { resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import {
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="min-h-fit flex items-center justify-center bg-gray-50 px-4 py-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-2">
          {step === "request" ? "Reset Password 🔐" : "Set New Password"}
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">
          {step === "request"
            ? "We'll send a code to your email."
            : "Enter the code and your new password."}
        </p>

        {step === "request" && (
          <form onSubmit={handleResetRequest} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
                tabIndex={-1}
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
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

        <div className="text-center text-sm space-y-1 pt-6 mt-6 -mx-8 border-t border-gray-300">
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
