import Head from "next/head";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login | QuickCart</title>
      </Head>

      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-5xl">
          {/* Buyzaar Heading */}
          <Link href="/">
          <h1 className="text-3xl font-bold text-center mb-3">Buyzaar</h1>
            </Link>
          {/* Login Card */}
          <div className="flex w-full shadow-lg rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            {/* Left: Login Form */}
            <div className="w-full md:w-1/2 p-10">
              <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
              <p className="text-sm mb-6 text-gray-600">
                Start your website in seconds. Don’t have an account?{" "}
                <Link href="/signup" className="text-blue-600 hover:underline">Signup</Link>
              </p>

              <form className="space-y-5">
                <div>
                  <label className="block mb-1 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    Remember me
                  </label>
                  <a href="#" className="text-blue-600 hover:underline">Forgot password?</a>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition"
                >
                  Sign in to your account
                </button>
              </form>

              <div className="my-6 flex items-center gap-2 text-gray-500 text-sm">
                <hr className="flex-grow border-gray-300" />
                or
                <hr className="flex-grow border-gray-300" />
              </div>

              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 rounded-lg hover:bg-gray-50">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                  Sign in with Google
                </button>
              </div>
            </div>

            {/* Right: Illustration */}
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
