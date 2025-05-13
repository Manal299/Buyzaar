// components/SellerNavbar.jsx
"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

const SellerNavbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear tokens, session, etc. Here just redirecting.
    router.push("/login");
  };

  return (
    <nav className="relative z-50 bg-white text-gray-700 border-b border-gray-300">
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 w-full">
        <Image
          className="cursor-pointer w-28 md:w-32"
          onClick={() => router.push("/seller/dashboard")}
          src={assets.logo}
          alt="logo"
        />

        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <Link href="/seller/dashboard" className="hover:text-gray-900 transition">Dashboard</Link>
          <Link href="/seller/inventory" className="hover:text-gray-900 transition">Inventory</Link>
          <Link href="/seller/orders" className="hover:text-gray-900 transition">Orders</Link>
          <Link href="/seller/notifications" className="hover:text-gray-900 transition">Notifications</Link>
          <Link href="/about" className="hover:text-gray-900 transition">About</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-red-600 transition"
          >
            <Image src={assets.user_icon} alt="Logout" className="w-5 h-5" />
            Logout
          </button>
        </div>

        <div className="flex items-center md:hidden gap-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-red-600 transition"
          >
            <Image src={assets.user_icon} alt="Logout" />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default SellerNavbar;
