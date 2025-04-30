"use client";

import { useState, useEffect } from "react";
import { signUp, confirmSignUp, resendSignUpCode, signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState<"register" | "confirm">("register");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [code, setCode] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

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
            given_name: firstName,
            family_name: lastName,
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {step === "register" ? "Create an Account 📝" : "Confirm Your Email"}
        </h2>

        {step === "register" ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full px-4 py-2 border rounded"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full px-4 py-2 border rounded"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Register
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4">
            <input
              type="email"
              className="w-full px-4 py-2 border rounded bg-gray-100 text-gray-600"
              value={email}
              disabled
            />
            <input
              type="text"
              placeholder="Verification Code"
              className="w-full px-4 py-2 border rounded"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Confirm Email
            </button>
            <button
              type="button"
              onClick={handleResend}
              className="w-full bg-gray-200 text-sm py-2 rounded mt-2"
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

        <div className="mt-6 text-center text-sm space-y-1">
          <button
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline block"
          >
            Already have an account? Login
          </button>
          <button
            onClick={() => router.push("/reset-password")}
            className="text-blue-500 hover:underline block"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
