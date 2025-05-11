// components/Navbar.jsx
"use client";
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categories = {
    "Electronic Accessories": ["Mobile Accessories", "Wearable", "Computer Accessories"],
    "TV & Home Appliances": ["Smart TVs", "Refrigerators", "Washing Machines"],
    "Health & Beauty": ["Makeup", "Skincare", "Hair Care", "Personal Care Devices"],
    "Mother & Baby": ["Diapers", "Baby Gear", "Feeding", "Toys"],
    "Electronic Devices": ["Smartphones", "Tablets", "Laptops"],
    "Groceries & Pets": ["Dry Food", "Wet Food", "Treats"],
    "Home & Lifestyle": ["Furniture", "Lighting", "Tools & Home Improvement"],
    "Women's Fashion": ["Dresses", "Tops", "Shoes", "Handbags"],
    "Men's Fashion": ["Shirts", "Jackets", "Shoes", "Watches"],
    "Watches, Bags & Jewellery": ["Watches", "Bags", "Necklaces", "Bracelets"],
    "Sports & Outdoor": ["Exercise & Fitness", "Cycling", "Outdoor Recreation"],
    "Automotive & Motorbike": ["Motorcycle Parts", "Car Accessories", "Oils & Fluids"]
  };

  return (
    <nav className="relative z-50 bg-white text-gray-700 border-b border-gray-300">
      <div className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 w-full">
        <Image
          className="cursor-pointer w-28 md:w-32"
          onClick={() => router.push("/")}
          src={assets.logo}
          alt="logo"
        />

        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <Link href="/" className="hover:text-gray-900 transition">Home</Link>

          <div
            className="relative group"
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <Link href="/products">
              <button className="flex items-center gap-1 hover:text-gray-900 transition">
                Shop <ChevronDownIcon className={`w-4 h-4 transition-transform ${menuOpen ? "rotate-180" : "rotate-0"}`} />
              </button>
            </Link>

            <div
              className={`fixed left-1/2 -translate-x-1/2 top-[72px] w-[90vw] bg-white shadow-2xl border-t border-gray-200 transition-all duration-300 ease-in-out ${
                menuOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"
              } px-12 py-10 grid grid-cols-4 gap-x-10 gap-y-6 z-50`}
            >
              {Object.entries(categories).map(([main, subs]) => (
                <div key={main}>
                  <h3 className="font-semibold text-gray-800 mb-2 text-base whitespace-nowrap">{main}</h3>
                  <ul className="space-y-1">
                    {subs.map((sub) => (
                      <li key={sub}>
                        <Link
                          href={`/category/${main.toLowerCase().replace(/\s+/g, "-")}/${sub.toLowerCase().replace(/\s+/g, "-")}`}
                          className="text-sm text-gray-600 hover:text-blue-600 transition whitespace-nowrap"
                        >
                          {sub}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <Link href="/about" className="hover:text-gray-900 transition">About Us</Link>
          <Link href="/contact" className="hover:text-gray-900 transition">Contact</Link>
        </div>

        <ul className="hidden md:flex items-center gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
            }}
            className="flex items-center border rounded px-2 py-1"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-sm focus:outline-none"
            />
            <button type="submit">
              <Image className="w-4 h-4 ml-2" src={assets.search_icon} alt="search icon" />
            </button>
          </form>

          <Link href="/wishlist" className="hover:text-gray-900 transition">
            <Image src={assets.heart_icon} alt="wishlist" className="w-5 h-5" />
          </Link>

          <Link href="/checkout/review" className="hover:text-gray-900 transition">
            <Image src={assets.cart_icon} alt="cart" className="w-5 h-5" />
          </Link>

          <Link href="/login" className="hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" className="w-5 h-5" />
          </Link>
        </ul>

        <div className="flex items-center md:hidden gap-3">
          <Link href="/login" className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Account
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
