import "@/styles/globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

function App({ Component, pageProps }) {
  return (
    <div className={`${outfit.className} antialiased text-gray-700`}>
      <Toaster />
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </div>
  );
}

export default App;
