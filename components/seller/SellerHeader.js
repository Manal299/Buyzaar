import { Menu, LogOut } from "lucide-react";
import Link from "next/link";

export default function SellerHeader({ onSidebarToggle, user }) {
  return (
    <header className="bg-white border-b shadow-sm px-6 md:px-10 py-3 flex items-center justify-between h-[64px] w-full">
      
      <div className="flex items-center gap-4">
       
        <button className="text-gray-700 md:hidden" onClick={onSidebarToggle}>
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-purple-700 whitespace-nowrap">Buyzaar</h1>
      </div>

    
      <div className="flex items-center gap-4 text-sm">
        <Link
          href="/logout"
          className="text-red-600 hover:text-red-800 flex items-center gap-1"
        >
          <LogOut size={16} />
          Logout
        </Link>
      </div>
    </header>
  );
}
