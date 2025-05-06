"use client";

import { useState, useEffect } from "react";
import { signUp, confirmSignUp, resendSignUpCode, signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "confirm">("register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [code, setCode] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  const [passwordVisible, setPasswordVisible] = useState(false);

  // Restore step and countdown timer from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingEmail");
    const expire = localStorage.getItem("otpTimerExpire");

    if (storedEmail) {
      setEmail(storedEmail);
      setStep("confirm");

      const expiry = expire ? parseInt(expire) : 0;
      const remaining = Math.floor((expiry - Date.now()) / 1000);
      if (remaining > 0) setTimer(remaining);
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          const newVal = prev - 1;
          if (newVal <= 0) {
            localStorage.removeItem("otpTimerExpire");
            clearInterval(interval);
          }
          return newVal;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name: fullName, // Use fullName as the attribute for the full name
          },
        },
      });

      localStorage.setItem("pendingEmail", email);
      localStorage.setItem("otpTimerExpire", (Date.now() + 60000).toString());
      setTimer(60);
      setStep("confirm");
      setMessage("OTP sent! Please check your email.");
    } catch (err: any) {
      if (err.name === "UsernameExistsException") {
        try {
          // Try to sign in: if successful, skip confirmation
          const user = await signIn({ username: email, password });
          localStorage.removeItem("pendingEmail");
          localStorage.removeItem("otpTimerExpire");
          router.push("/dashboard");
        } catch (signInErr: any) {
          localStorage.setItem("pendingEmail", email);
          setStep("confirm");
          setMessage("Account exists but not confirmed. Please enter the code.");
        }
      } else {
        setError(err.message || "Registration failed.");
      }
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("otpTimerExpire");

      const user = await signIn({ username: email, password });
      if (user?.isSignedIn) {
        setMessage("Email confirmed and logged in! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 2000);
      }
    } catch (err: any) {
      setError(err.message || "Confirmation failed.");
    }
  };

  const handleResend = async () => {
    if (timer > 0) return; // prevent resend if timer active
    try {
      await resendSignUpCode({ username: email });
      localStorage.setItem("otpTimerExpire", (Date.now() + 60000).toString());
      setTimer(60);
      setMessage("A new code has been sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    }
  };

  const handleBackToRegister = () => {
    localStorage.removeItem("pendingEmail");
    localStorage.removeItem("otpTimerExpire");
    setStep("register");
    setMessage("");
    setError("");
    setCode("");
    setPassword("");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="min-h-fit flex items-center justify-center bg-gray-50 px-4 py-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-2">
          {step === "register" ? "Create an Account 📝" : "Confirm Your Email"}
        </h2>
        <p className="text-sm text-center text-gray-500 mb-6">{step === "register" ? "Register to get started!" : "Enter the code sent to your email"}</p>

        {step === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
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
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-600"
                tabIndex={-1}
              >
                {passwordVisible ? (
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
              Register
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4">
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-600"
              value={email}
              disabled
            />
            <input
              type="text"
              placeholder="Verification Code"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
              Confirm Email
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="w-full bg-gray-200 text-sm py-2 rounded-lg mt-2"
              disabled={timer > 0}
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
            </button>
            <button
              type="button"
              onClick={handleBackToRegister}
              className="text-sm text-blue-500 underline mt-2 block text-center"
            >
              Back to Registration
            </button>
          </form>
        )}

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
        {message && <p className="text-sm text-green-600 mt-4">{message}</p>}

        <div className="pt-6 mt-6 -mx-8 border-t border-gray-300 text-center text-sm space-y-1">
          <button
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline"
          >
            Already have an account? Login
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
