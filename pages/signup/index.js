import Head from "next/head";
import { useState } from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/20/solid";

export default function SignupPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isPasswordValid =
    password.length >= 6 && password === confirmPassword;

  return (
    <>
      <Head>
        <title>Sign Up | QuickCart</title>
      </Head>

      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-5xl">
          {/* Buyzaar Heading */}
          <h1 className="text-3xl font-bold text-center mb-3">Buyzaar</h1>

          {/* Signup Card */}
          <div className="flex w-full shadow-lg rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            {/* Left: Signup Form */}
            <div className="w-full md:w-1/2 p-10">
              <h2 className="text-3xl font-bold mb-2">Create an account</h2>
              <p className="text-sm mb-6 text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline">
                  Login
                </a>
                .
              </p>

              <form className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <label className="block mb-1 text-sm font-medium">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-0 bottom-0 flex items-center text-gray-500"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block mb-1 text-sm font-medium">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 pr-10 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-0 bottom-0 flex items-center text-gray-500"
                  >
                    {showConfirm ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>

                  {/* Match Indicator */}
                  {confirmPassword && (
                    password === confirmPassword ? (
                      <div className="absolute right-10 top-0 bottom-0 flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                      </div>
                    ) : (
                      <div className="absolute right-10 top-0 bottom-0 flex items-center">
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                      </div>
                    )
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isPasswordValid}
                  className={`w-full py-2 rounded-lg transition ${
                    isPasswordValid
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Create Account
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-2 text-gray-500 text-sm">
                <hr className="flex-grow border-gray-300" />
                or
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Google Signup */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Sign up with Google
                </button>
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="hidden md:flex w-1/2 bg-white items-center justify-center p-10">
              <img
                src="/login-illustration.png"
                alt="Signup Illustration"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
