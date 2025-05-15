"use client";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import SellerHeader from "@/components/seller/SellerHeader";
import SellerSidebar from "@/components/seller/SellerSidebar";
import SellerFooter from "@/components/seller/SellerFooter";
import OrderMain from "@/components/seller/OrderMain";

export default function OrdersPage() {
  const { data: session, status } = useSession({ required: true });
  const router = useRouter();

  const [userId, setUserId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      setUserId(router.query.id);
    }
  }, [router.isReady, router.query.id]);


  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (status === "loading" || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-4 border-b-4 border-indigo-600 rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <SellerSidebar user={session?.user} isOpen={sidebarOpen} />
      <div
        className={`flex flex-col w-full min-h-screen transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <SellerHeader
          user={session?.user}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <OrderMain userId={userId} />
        <SellerFooter />
      </div>
    </div>
  );
}
