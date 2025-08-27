"use client";

import { useState } from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function SigninForm() {
  const [phone, setPhone] = useState<string | undefined>();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !isValidPhoneNumber(phone)) {
      setError("Invalid phone number");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      const data = await res.json();
      setToken(data.token);
      setError("");
      console.log("Logged in with token:", data.token);
    } catch {
      setError("Invalid phone number or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Sign In to Your Account
          </h2>
          <p className="text-center text-gray-600">
            Enter your phone number and password to continue.
          </p>

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <PhoneInput
                international
                defaultCountry="US"
                value={phone}
                onChange={setPhone}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pharma-green"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your phone number with country code
              </p>
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pharma-green"
              />
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}

            <div>
              <button type="submit" className="w-full pharma-button-green py-3">
                Continue
              </button>
            </div>
          </form>

          {token && (
            <p className="text-xs text-green-600 text-center">
              Success! Token: {token}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
