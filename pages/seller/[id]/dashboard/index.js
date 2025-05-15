
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import SellerSidebar from "@/components/seller/SellerSidebar";
import SellerFooter from "@/components/seller/SellerFooter";
import DashboardMain from "@/components/seller/DashboardMain";
import SellerHeader from "@/components/seller/SellerHeader";

export default function SellerDashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const { id } = router.query;
  console.log("Seller ID:", id);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    if (status === "authenticated" && id) {
      fetchDashboardData();
    }
  }, [status, id]);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/seller/${id}/dashboard`);
      const data = await response.json();
      if (!data.success) throw new Error(data.error || "Failed to load dashboard");
      setDashboardData(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Dashboard loading failed");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        {error}
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Retry
        </button>
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

        
        <main className="flex-1 overflow-y-auto">
          <DashboardMain data={dashboardData} />
        </main>

        
        <SellerFooter />
      </div>
    </div>
  );
}
