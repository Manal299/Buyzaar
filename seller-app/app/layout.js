// app/layout.jsx
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Seller Portal",
  description: "Dashboard for e-commerce sellers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <header className="bg-white shadow mb-8">
          <div className="container mx-auto p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">My E-Commerce</h1>
            <nav>
              <Link href="/seller/dashboard" className="mr-4 hover:underline">Dashboard</Link>
              <Link href="/seller/products" className="mr-4 hover:underline">Products</Link>
              <Link href="/seller/orders" className="mr-4 hover:underline">Orders</Link>
              <Link href="/seller/analytics" className="mr-4 hover:underline">Analytics & Reprts</Link>
              <Link href="/seller/returns" className="mr-4 hover:underline">Returns & Refunds</Link>
              <Link href="/seller/profile" className="hover:underline">Profile</Link>
            </nav>
          </div>
        </header>
        <main className="container mx-auto">{children}</main>
      </body>
    </html>
  );
}
