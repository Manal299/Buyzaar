// components/seller/SellerFooter.js
export default function SellerFooter() {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 text-center">
      <p className="text-sm">&copy; {new Date().getFullYear()} Buyzaar. All rights reserved.</p>
    </footer>
  );
}
