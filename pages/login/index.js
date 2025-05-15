"use client";

import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user.role === 'seller' && session.user.status === 'pending') {
        alert('Your request is pending. Please wait for approval.');
        return;
      }
      if (session.user.role === 'seller') {
        fetchSellerIdAndRedirect();
      } else if (session.user.role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/';
      }
    }
  }, [session, status]);

  const fetchSellerIdAndRedirect = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.success && data.user.id) {
        window.location.href = `/seller/${data.user.id}/dashboard`;
      } else {
        window.location.href = '/';
      }
    } catch {
      window.location.href = '/';
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (result.error) {
        const msg = result.error.toLowerCase();
        if (msg.includes('password')) {
          setError("Incorrect password.");
        } else if (msg.includes('no user')) {
          setError("No account found with this email.");
        } else {
          setError("Invalid email or password.");
        }
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

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
        <title>Login | Buyzaar</title>
      </Head>

      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-5xl">
          <Link href="/">
            <h1 className="text-3xl font-bold text-center mb-3">Buyzaar</h1>
          </Link>

          <div className="flex w-full shadow-lg rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <div className="w-full md:w-1/2 p-10">
              <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
              <p className="text-sm mb-6 text-gray-600">
                Start your website in seconds. Don't have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:underline">Signup</Link>
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-1 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                    required
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Signing in…' : 'Sign in to your account'}
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
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </button>
              </div>
            </div>

            <div className="hidden md:flex w-1/2 bg-white items-center justify-center p-10">
              <img
                src="/login-illustration.png"
                alt="Login Illustration"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
