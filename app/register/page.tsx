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

  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingEmail");
    if (storedEmail) {
      setEmail(storedEmail);
      setStep("confirm");
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
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
      setStep("confirm");
      setMessage("OTP sent! Please check your email.");
      setTimer(60);
    } catch (err: any) {
      if (err.name === "UsernameExistsException") {
        try {
          // Try to sign in: if successful, means user already confirmed
          await signIn({ username: email, password });
          localStorage.removeItem("pendingEmail");
          router.push("/login");
        } catch (signInErr: any) {
          // If sign-in fails, assume unconfirmed
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
    try {
      await resendSignUpCode({ username: email });
      setMessage("A new code has been sent to your email.");
      setTimer(60);
    } catch (err: any) {
      setError(err.message || "Failed to resend code.");
    }
  };

  const handleBackToRegister = () => {
    localStorage.removeItem("pendingEmail");
    setStep("register");
    setMessage("");
    setError("");
    setCode("");
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
              placeholder="Email"
              className="w-full px-4 py-2 border rounded"
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
