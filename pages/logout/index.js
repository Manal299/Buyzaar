"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear local/session storage or cookies
    localStorage.removeItem("user");       // if using localStorage
    sessionStorage.removeItem("user");     // if using sessionStorage
    document.cookie = "token=; Max-Age=0; path=/"; // if using cookies

    // Optional: call backend logout endpoint if needed

    // Redirect to home or login
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg text-gray-600">Logging you out...</p>
    </div>
  );
}
