"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import SellerSidebar from "@/components/seller/SellerSidebar";
import SellerFooter from "@/components/seller/SellerFooter";
import SellerHeader from "@/components/seller/SellerHeader";
import ProductMain from "@/components/seller/ProductMain";

export default function ProductsPage() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (status === "loading") return <p className="p-6">Checking session…</p>;
  if (!session) return <p className="p-6 text-red-500">Unauthorized access.</p>;

  return (
    <div className="flex min-h-screen">
      <SellerSidebar user={session?.user} isOpen={sidebarOpen} />
      <div className={`flex flex-col w-full min-h-screen transition-all duration-300 ${
        sidebarOpen ? "ml-64" : "ml-0"
      }`}>
        <SellerHeader
          user={session?.user}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="p-6 flex-1 overflow-y-auto">
          <ProductMain />
        </main>
        <SellerFooter />
      </div>
    </div>
  );
}
