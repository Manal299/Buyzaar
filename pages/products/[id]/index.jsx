"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";

const Product = () => {
  const { id } = useParams();
  const { products, router, addToCart } = useAppContext();

  const [mainImage, setMainImage] = useState(null);
  const [productData, setProductData] = useState(null);
  const [selectedColor, setSelectedColor] = useState("#111827");
  const [selectedSize, setSelectedSize] = useState(null);
  const [openTab, setOpenTab] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);

  const fetchProductData = async () => {
    const product = products.find(product => product._id === id);
    setProductData(product);
  }

  useEffect(() => {
    fetchProductData();
  }, [id, products.length])

  const maxStock = productData?.stock || 10;
  const isOutOfStock = maxStock === 0;
  const availableSizes = productData?.sizes || ["S", "M", "L", "XL"];

  const details = {
    Features: [
      "Multiple strap configurations",
      "Spacious interior with top zip",
      "Leather handle and tabs",
      "Interior dividers",
      "Stainless strap loops",
      "Double stitched construction",
      "Water-resistant",
    ],
    Care: [
      "Spot clean as needed",
      "Hand wash with mild soap",
      "Machine wash interior dividers",
      "Treat handle and tabs with leather conditioner"
    ],
    Shipping: [
      "Free shipping on orders over $300",
      "International shipping available",
      "Expedited shipping options",
      "Signature required upon delivery"
    ],
    Returns: [
      "Easy return requests",
      "Pre-paid shipping label included",
      "10% restocking fee for returns",
      "60 day return window"
    ]
  }

  return productData ? (<>
    <Navbar />
    <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
      <div className="flex flex-col lg:flex-row bg-white">
        <div className="flex-1 p-6 flex flex-col items-center">
          <Image
            src={mainImage || productData.image[0]}
            alt={productData.name}
            width={500}
            height={500}
            className="rounded-lg mb-6"
          />
          <div className="flex space-x-3">
            {productData.image.map((img, idx) => (
              <Image
                key={idx}
                src={img}
                alt={`thumb-${idx}`}
                width={70}
                height={70}
                className={`rounded-md cursor-pointer ring-2 ${mainImage === img ? "ring-indigo-500" : "ring-transparent"}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{productData.name}</h1>
          <p className="text-2xl text-gray-800 font-semibold mb-2">
            ${productData.offerPrice} <span className="text-base font-normal text-gray-600 line-through ml-2">${productData.price}</span>
          </p>
          {isOutOfStock && <p className="text-red-500 font-semibold mb-2">Out of Stock</p>}
          <div className="flex items-center mb-4 text-indigo-500 text-xl">
            <span>★★★★☆</span>
          </div>
          <p className="text-gray-600 mb-6">
            The Zip Tote Basket is the perfect midpoint between shopping tote and comfy backpack. With convertible straps, you can hand carry, shoulder sling, or backpack this convenient and spacious bag. The zip top and durable canvas construction keeps your goods protected for all-day use.
          </p>
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Color</p>
            <div className="flex space-x-3">
              {["#111827", "#e5e7eb", "#4b5563"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedColor === color ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
            <div className="flex space-x-3">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3 py-1 border rounded-md text-sm ${selectedSize === size ? "bg-blue-600 text-white border-blue-600" : "text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                >{size}</button>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-gray-700">Quantity</label>
            <div className="flex items-center border rounded-md w-fit overflow-hidden">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className={`px-3 py-1 text-lg ${quantity <= 1 ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
              >−</button>
              <div className="px-4 py-1 text-sm w-10 text-center">{quantity}</div>
              <button
                onClick={() => setQuantity(prev => Math.min(maxStock, prev + 1))}
                disabled={quantity >= maxStock}
                className={`px-3 py-1 text-lg ${quantity >= maxStock ? 'text-gray-300 bg-gray-50 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
              >+</button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Available: {maxStock} in stock</p>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => addToCart(productData._id, quantity)} disabled={isOutOfStock} className={`px-6 py-2 rounded-md ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white'}`}>Add to bag</button>
            <button onClick={() => { addToCart(productData._id, quantity); router.push('/checkout/review'); }} disabled={isOutOfStock} className={`px-6 py-2 rounded-md ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white'}`}>Buy now</button>
            <button
              onClick={() => setWishlisted(prev => !prev)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition ${wishlisted ? "text-red-500" : "text-gray-400 hover:text-gray-600"}`}
              aria-label="Toggle Wishlist"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill={wishlisted ? "currentColor" : "none"} className="w-6 h-6 stroke-[1.5] text-current">
                <path strokeLinecap="round" strokeLinejoin="round" d={wishlisted ? "M3 8.25c0-2.071 1.679-3.75 3.75-3.75 1.35 0 2.573.69 3.25 1.75a4.153 4.153 0 013.25-1.75c2.07 0 3.75 1.679 3.75 3.75 0 3.186-3.01 5.625-7 8.25-3.99-2.625-7-5.064-7-8.25z" : "M21 8.25c0-1.519-1.231-2.75-2.75-2.75-1.012 0-1.906.546-2.406 1.375-.5-.829-1.394-1.375-2.406-1.375C11.23 5.5 10 6.731 10 8.25c0 2.264 2.5 4.25 6 6.5 3.5-2.25 6-4.236 6-6.5z"} />
              </svg>
            </button>
          </div>
          <div className="mt-8 divide-y divide-gray-200">
            {Object.entries(details).map(([title, items], idx) => (
              <div key={title}>
                <button
                  onClick={() => setOpenTab(openTab === idx ? null : idx)}
                  className="w-full flex items-center justify-between py-4 text-left text-gray-900 font-medium hover:text-blue-600"
                >
                  {title}
                  <span className="text-2xl">{openTab === idx ? "−" : "+"}</span>
                </button>
                {openTab === idx && (
                  <ul className="pl-4 pb-4 space-y-1 text-sm text-gray-700">
                    {items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center mb-4 mt-16">
          <p className="text-3xl font-medium">Featured <span className="font-medium text-black">Products</span></p>
          <div className="w-28 h-0.5 bg-black mt-2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
          {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
        </div>
        <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
          See more
        </button>
      </div>
    </div>
    <Footer />
  </>
  ) : <Loading />
};

export default Product;
