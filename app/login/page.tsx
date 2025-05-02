"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  signIn,
  signUp,
  confirmSignUp,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
} from "aws-amplify/auth";

export default function SmartAuth() {
  const router = useRouter();

  const [step, setStep] = useState<
    | "emailCheck"
    | "verifyEmailOtp"
    | "loginPassword"
    | "setPassword"
    | "forgotPasswordEmail"
    | "forgotPasswordOtp"
    | "loading"
  >("emailCheck");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setStep("loading");

    try {
      await signIn({ username: email, password: "dummy" });
    } catch (err: any) {
      if (err.name === "NotAuthorizedException") {
        setStep("loginPassword");
      } else if (err.name === "UserNotConfirmedException") {
        setMessage("Please confirm your email. OTP resent.");
        await resendSignUpCode({ username: email });
        setStep("verifyEmailOtp");
        setResendTimer(60);
      } else if (err.name === "UserNotFoundException") {
        await signUp({
          username: email,
          password: "TempPassword123!",
          options: { userAttributes: { email } },
        });
        setMessage("New account detected. OTP sent to your email.");
        setIsNewUser(true);
        setStep("verifyEmailOtp");
        setResendTimer(60);
      } else {
        setError("Something went wrong.");
        setStep("emailCheck");
      }
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await confirmSignUp({ username: email, confirmationCode: otp });
      setMessage("Email verified. Please set a password.");
      setStep("setPassword");
    } catch (err: any) {
      setError("OTP is incorrect or expired.");
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: otp,
        newPassword: password,
      });
      setMessage("Password set. Logging in...");
      await signIn({ username: email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Password setup failed.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signIn({ username: email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError("Login failed. Wrong password?");
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({ username: email });
      setMessage("OTP resent.");
      setResendTimer(60);
    } catch {
      setError("Resend failed.");
    }
  };

  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await resetPassword({ username: email });
      setMessage("OTP sent. Check your email.");
      setStep("forgotPasswordOtp");
      setResendTimer(60);
    } catch (err: any) {
      setError(err.message || "Failed to send reset code.");
    }
  };

  const handleForgotOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: otp,
        newPassword: password,
      });
      setMessage("Password reset. Logging in...");
      await signIn({ username: email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Reset failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          {{
            emailCheck: "Welcome",
            verifyEmailOtp: "Verify Email",
            loginPassword: "Login",
            setPassword: "Set Password",
            forgotPasswordEmail: "Reset Password",
            forgotPasswordOtp: "Reset with OTP",
            loading: "Loading...",
          }[step]}
        </h2>

        {/* Email Entry */}
        {step === "emailCheck" && (
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Continue
            </button>
            <button
              type="button"
              onClick={() => setStep("forgotPasswordEmail")}
              className="text-sm text-blue-600 hover:underline w-full text-right"
            >
              Forgot password?
            </button>
          </form>
        )}

        {/* Verify Email OTP */}
        {step === "verifyEmailOtp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <input
              type="text"
              placeholder="OTP"
              className="w-full px-4 py-2 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Verify
            </button>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendTimer > 0}
              className="w-full text-sm text-gray-600 hover:underline"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
            </button>
          </form>
        )}

        {/* Password Login */}
        {step === "loginPassword" && (
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Login
            </button>
            <button
              type="button"
              onClick={() => setStep("forgotPasswordEmail")}
              className="text-sm text-blue-600 hover:underline w-full text-right"
            >
              Forgot password?
            </button>
          </form>
        )}

        {/* Set Password */}
        {step === "setPassword" && (
          <form onSubmit={handleSetPassword} className="space-y-3">
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Save Password
            </button>
          </form>
        )}

        {/* Forgot Password Email */}
        {step === "forgotPasswordEmail" && (
          <form onSubmit={handleForgotEmailSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Send Reset Code
            </button>
            <button
              type="button"
              onClick={() => setStep("emailCheck")}
              className="w-full text-sm text-gray-600 hover:underline text-center"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* Forgot Password OTP */}
        {step === "forgotPasswordOtp" && (
          <form onSubmit={handleForgotOtpSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="OTP"
              className="w-full px-4 py-2 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-2 border rounded"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Reset Password
            </button>
          </form>
        )}

        {/* Error & Message */}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
}
