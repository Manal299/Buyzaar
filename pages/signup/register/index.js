"use client";

import Head from "next/head";
import { useRouter } from "next/router";

export default function RoleSelectionPage() {
  const router = useRouter();

  const handleSelect = (role) => {
    router.push(`/signup/register?role=${role}`);
  };

  return (
    <>
      <Head>
        <title>Select Role | Buyzaar</title>
      </Head>

      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-xl p-10 max-w-md w-full text-center space-y-6">
          <h1 className="text-3xl font-bold">Join Buyzaar</h1>
          <p className="text-gray-600">Are you signing up as a buyer or a seller?</p>

          <div className="space-y-4">
            <button
              onClick={() => handleSelect("buyer")}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium"
            >
              Sign up as Buyer
            </button>
            <button
              onClick={() => handleSelect("seller")}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-medium"
            >
              Register as Seller
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
