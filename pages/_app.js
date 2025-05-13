// pages/_app.js
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AppContextProvider } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Loading spinner component
function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
    </div>
  );
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);
    const handleError = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleError);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleError);
    };
  }, [router]);

  return (
    <SessionProvider session={session}>
      <AppContextProvider>
        {loading && <LoadingScreen />}
          <Component {...pageProps} />
      </AppContextProvider>
    </SessionProvider>
  );
}
