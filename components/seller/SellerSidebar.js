// components/seller/Sidebar.js
"use client";

import Link from "next/link";
import { LayoutDashboard, ShoppingCart, Tag, BellRing, LogOut } from "lucide-react";

export default function SellerSidebar() {
  return (
    <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
      <h2 className="text-2xl font-bold mb-10 tracking-tight text-indigo-700">Buyzaar Seller</h2>
      <nav className="flex flex-col gap-5">
        <Link href="/seller" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors duration-200">
          <LayoutDashboard size={20} /> <span>Dashboard</span>
        </Link>
        <Link href="/seller/orders" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors duration-200">
          <ShoppingCart size={20} /> <span>Orders</span>
        </Link>
        <Link href="/seller/products" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors duration-200">
          <Tag size={20} /> <span>Products</span>
        </Link>
        <Link href="/seller/notifications" className="flex items-center gap-3 text-gray-700 hover:text-indigo-600 transition-colors duration-200">
          <BellRing size={20} /> <span>Notifications</span>
        </Link>
        <Link href="/logout" className="flex items-center gap-3 text-gray-700 hover:text-red-500 transition-colors duration-200">
          <LogOut size={20} /> <span>Logout</span>
        </Link>
      </nav>
    </aside>
  );
}
