"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AdminHeader from "@/components/admin/AdminHeader";
import UserManagement from "@/components/admin/UserManagement";
import ProductModeration from "@/components/admin/ProductModeration";
import AdminAnalytics from "@/components/admin/AdminAnalytics";

export default function AdminHomePage() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [tab, setTab] = useState("users");

  useEffect(() => {
    if (session?.user?.role !== "admin") {
      router.replace("/admin");
    }
  }, [session]);

  if (status === "loading") return <p className="p-6">Checking session...</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />
      <main className="p-6 flex-1 overflow-y-auto bg-gray-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Control Panel</h1>

        <div className="flex gap-3 mb-6">
          <button onClick={() => setTab("users")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "users" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}>👤 Users</button>
          <button onClick={() => setTab("products")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "products" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}>📦 Products</button>
          <button onClick={() => setTab("analytics")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "analytics" ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}>📊 Analytics</button>
        </div>

        {tab === "users" && <UserManagement />}
        {tab === "products" && <ProductModeration />}
        {tab === "analytics" && <AdminAnalytics />}
      </main>
    </div>
  );
}
