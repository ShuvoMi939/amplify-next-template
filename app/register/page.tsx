"use client";

import { useEffect, useState } from "react";
import { signUp, confirmSignUp, signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { auth, RecaptchaVerifier } from "@/src/firebase";
import { signInWithPhoneNumber } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export default function Register() {
  const router = useRouter();

  const [mode, setMode] = useState<"email" | "phone">("email");
  const [step, setStep] = useState<"register" | "confirm">("register");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [resendTimer, setResendTimer] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const initRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (resendTimer > 0) {
      setError(`Please wait ${resendTimer}s before trying again.`);
      return;
    }

    try {
      if (mode === "email") {
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
          setResendTimer(60);
          setStep("confirm");
          setMessage("OTP sent to email.");
        } catch (err: any) {
          if (err.name === "UsernameExistsException") {
            try {
              await signIn({ username: email, password });
              router.push("/dashboard");
            } catch {
              setResendTimer(60);
              setStep("confirm");
              setMessage("Account exists but not confirmed. OTP sent again.");
            }
          } else {
            setError(err.message || "Registration failed.");
          }
        }
      } else {
        initRecaptcha();
        const appVerifier = window.recaptchaVerifier;
        const result = await signInWithPhoneNumber(auth, phone, appVerifier);
        setConfirmationResult(result);
        setResendTimer(60);
        setStep("confirm");
        setMessage("OTP sent to phone number.");
      }
    } catch (err: any) {
      setError(err.message || "OTP sending failed.");
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (mode === "email") {
        await confirmSignUp({ username: email, confirmationCode: code });
        const { isSignedIn } = await signIn({ username: email, password });
        if (isSignedIn) {
          router.push("/dashboard");
        }
      } else if (confirmationResult) {
        await confirmationResult.confirm(code);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("Incorrect OTP or already confirmed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Register</h2>
          <button
            onClick={() => {
              setMode(mode === "email" ? "phone" : "email");
              setError("");
              setMessage("");
              setStep("register");
            }}
            className="text-sm text-blue-500 hover:underline"
          >
            Use {mode === "email" ? "Phone" : "Email"} Instead
          </button>
        </div>

        {step === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            {mode === "email" ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            ) : (
              <>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880123456789"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
                <div id="recaptcha-container"></div>
              </>
            )}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              type="submit"
              disabled={resendTimer > 0}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {resendTimer > 0 ? `Wait ${resendTimer}s` : "Register"}
            </button>
          </form>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Confirm OTP
            </button>
          </div>
        )}

        {message && <p className="text-sm text-green-600 mt-4">{message}</p>}
        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        <div className="mt-6 text-center text-sm space-y-1">
          <button
            onClick={() => router.push("/login")}
            className="text-blue-500 hover:underline"
          >
            Already have an account? Login
          </button>
          <br />
          <button
            onClick={() => router.push("/reset")}
            className="text-blue-500 hover:underline"
          >
            Forgot password?
          </button>
        </div>
      </div>
    </div>
  );
}
