"use client";

import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import {
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";

export default function SignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      // Simple, direct redirection logic based on user role and onboarding status
      let redirectPath;
      
      if (session.user.role === 'seller') {
        redirectPath = session.user.isOnboarded ? '/seller/dashboard' : '/seller/onboarding';
      } else if (session.user.role === 'admin') {
        redirectPath = '/admin/dashboard';
      } else {
        redirectPath = '/';
      }
      
      console.log('User already authenticated, redirecting to:', redirectPath);
      
      // Use window.location for a hard redirect to avoid Next.js data fetching issues
      window.location.href = redirectPath;
    }
  }, [session, status, router]);

  const isPasswordValid =
    form.password.length >= 6 && form.password === form.confirmPassword;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // Register the new user
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }
      
      // Now sign in the user with the same credentials
      const signInResult = await signIn('credentials', {
        redirect: false,
        email: form.email,
        password: form.password
      });
      
      if (signInResult.error) {
        throw new Error(signInResult.error || 'Login after signup failed');
      }
      
      // Use window.location for a hard redirect
      // Specific redirect for each role
      if (form.role === 'seller') {
        window.location.href = '/seller/onboarding';
      } else {
        window.location.href = '/';
      }
      
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while checking auth status
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign Up | Buyzaar</title>
      </Head>

      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-5xl">
          <Link href="/">
            <h1 className="text-3xl font-bold text-center mb-3">Buyzaar</h1>
          </Link>

          <div className="flex w-full shadow-lg rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            {/* Signup Form */}
            <div className="w-full md:w-1/2 p-10">
              <h2 className="text-3xl font-bold mb-2">Create an account</h2>
              <p className="text-sm mb-6 text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>
                .
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block mb-1 text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>

                {/* Role Dropdown */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Register As</label>
                  <select
                    value={form.role}
                    onChange={(e) => handleChange("role", e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block mb-1 text-sm font-medium">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                    className="w-full px-4 py-2 pr-10 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-0 bottom-0 flex items-center text-gray-500"
                  >
                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <label className="block mb-1 text-sm font-medium">Confirm Password</label>
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    required
                    className="w-full px-4 py-2 pr-10 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((prev) => !prev)}
                    className="absolute right-3 top-0 bottom-0 flex items-center text-gray-500"
                  >
                    {showConfirm ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                  </button>

                  {form.confirmPassword && (
                    form.password === form.confirmPassword ? (
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

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={!isPasswordValid || submitting}
                  className={`w-full py-2 rounded-lg transition ${
                    isPasswordValid
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {submitting ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-2 text-gray-500 text-sm">
                <hr className="flex-grow border-gray-300" />
                or
                <hr className="flex-grow border-gray-300" />
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => signIn('google')}
                  className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 rounded-lg hover:bg-gray-50"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Sign up with Google
                </button>
              </div>
            </div>

            {/* Illustration */}
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
