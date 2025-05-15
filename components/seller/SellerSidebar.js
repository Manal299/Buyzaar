
import Link from "next/link";
import { useRouter } from "next/router";
import { FiUser, FiGrid, FiShoppingBag, FiPackage, FiBell, FiLogOut } from "react-icons/fi";

export default function SellerSidebar({ user, isOpen }) {
  const router = useRouter();

  const links = [
  { name: "Dashboard", href: `/seller/${user?.id}/dashboard`, icon: <FiGrid /> },
  { name: "Products", href: `/seller/${user?.id}/products`, icon: <FiPackage /> },
  { name: "Orders", href: `/seller/${user?.id}/orders`, icon: <FiShoppingBag /> },
  { name: "Profile", href: `/seller/${user?.id}/profile`, icon: <FiUser /> },
];


  const handleLogout = () => {
    router.push("/logout");
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-50 flex flex-col justify-between
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64 p-6" : "w-0 p-0 overflow-hidden"}`}
    >
      <div className={`${isOpen ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}>
        <h2 className="text-2xl font-bold text-purple-700 mb-10">Buyzaar</h2>
        <nav className="space-y-6">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-3 text-gray-700 hover:text-purple-700 whitespace-nowrap"
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {isOpen && (
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-gray-600 hover:text-red-600 mt-6"
        >
          <FiLogOut />
          Logout
        </button>
      )}
    </aside>
  );
}
