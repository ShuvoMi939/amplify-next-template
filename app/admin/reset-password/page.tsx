'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';

export default function AdminResetPassword() {
  const router = useRouter();
  const [step, setStep] = useState<'request' | 'confirm'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0); // Track time remaining for OTP resend
  const [canResend, setCanResend] = useState(false); // Flag to enable/disable resend
  const [otpSent, setOtpSent] = useState(false); // Flag to check if OTP was sent

  useEffect(() => {
    // Check if OTP sent time is stored
    const otpSentTime = localStorage.getItem('otpSentTime');
    if (otpSentTime) {
      const remainingTime = parseInt(otpSentTime) + 60000 - Date.now();
      if (remainingTime > 0) {
        setTimer(remainingTime);
        setCanResend(false);
        setOtpSent(true);
        const countdown = setInterval(() => {
          setTimer((prev) => prev - 1000);
        }, 1000);
        return () => clearInterval(countdown); // Cleanup on unmount
      }
    }
  }, []);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpSent) {
      setError('OTP has already been sent. Please wait before requesting another.');
      return;
    }
    try {
      await resetPassword({ username: email });
      localStorage.setItem('otpSentTime', Date.now().toString());
      setMessage('Verification code sent to your email.');
      setStep('confirm');
      setOtpSent(true);
      setCanResend(false);
      setTimer(60000); // Reset timer to 1 minute
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1000);
      }, 1000);
      return () => clearInterval(countdown); // Cleanup on unmount
    } catch (err: any) {
      setError(err.message || 'Failed to send code.');
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmResetPassword({ username: email, confirmationCode: code, newPassword });
      setMessage('Password reset successful. Redirecting to login...');
      setTimeout(() => router.push('/admin/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Reset failed.');
    }
  };

  const handleResendOtp = () => {
    setTimer(60000); // Reset the timer
    setCanResend(false);
    localStorage.setItem('otpSentTime', Date.now().toString());
    setMessage('Verification code sent again. Check your email.');
    setOtpSent(true); // OTP sent again
    setTimeout(() => {
      setCanResend(true);
    }, 60000); // Allow resend after 1 minute
  };

  return (
    <div className="min-h-fit flex items-center justify-center bg-gray-50 px-4 py-6">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Admin Password</h2>

        {step === 'request' ? (
          <form onSubmit={handleRequest} className="space-y-4">
            <input
              type="email"
              placeholder="Admin Email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            {otpSent && timer > 0 ? (
              <p className="text-sm text-gray-500 mt-2">
                Resend in {Math.floor(timer / 1000)} seconds
              </p>
            ) : (
              otpSent && (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-blue-500 hover:underline mt-2"
                  disabled={!canResend}
                >
                  Resend OTP
                </button>
              )
            )}
          </form>
        ) : (
          <form onSubmit={handleConfirm} className="space-y-4">
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
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Confirm Reset
            </button>
          </form>
        )}

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mt-4">{message}</p>}

        <div className="text-center mt-4">
          <button
            onClick={() => router.push('/admin/login')}
            className="text-blue-500 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
