// /app/checkout/shipping/page.js
"use client";
import React, { useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import CheckoutProgress from "@/components/CheckoutProgress";

const ShippingPage = () => {
  const router = useRouter();
  const { cartItems, products, getCartCount, getCartAmount, currency } = useAppContext();

  const [selectedPayment, setSelectedPayment] = useState("");

  const total = getCartAmount();
  const tax = Math.floor(total * 0.02);
  const shipping = 0;

  const isCOD = selectedPayment === "cod";

  return (
    <>
      <Navbar />
      <div className="mt-6 md:mt-10">
              <CheckoutProgress />
        </div>
      <div className="px-6 md:px-16 lg:px-32 pt-14 pb-20 grid lg:grid-cols-3 gap-12">
  {/* Cart Items List */}
  <div className="lg:col-span-2 space-y-10">
    <div>
      <h2 className="text-2xl font-semibold mb-4">Your Items</h2>
      <div className="space-y-4">
        {Object.keys(cartItems).map((itemId) => {
          const product = products.find(p => p._id === itemId);
          if (!product || cartItems[itemId] <= 0) return null;
          return (
            <div key={itemId} className="flex items-center gap-4 border-b pb-4">
              <Image src={product.image[0]} alt="product" width={60} height={60} className="rounded-md" />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-500">Qty: {cartItems[itemId]}</p>
              </div>
              <p className="font-semibold text-gray-700">{currency}{(product.offerPrice * cartItems[itemId]).toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </div>

    {/* Payment Method */}
    <div>
      <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
      <div className="flex flex-col sm:flex-row gap-4">
        <label className={`flex-1 border p-4 rounded-md cursor-pointer ${selectedPayment === "card" ? "ring-2 ring-blue-600" : ""}`}>
          <input type="radio" className="hidden" value="card" name="payment" onChange={(e) => setSelectedPayment(e.target.value)} />
          <div className="flex items-center gap-4">
            <Image src="https://readymadeui.com/images/visa.webp" alt="visa" width={40} height={24} />
            <Image src="https://readymadeui.com/images/master.webp" alt="master" width={40} height={24} />
            <span className="ml-4 text-gray-700 font-medium">Pay with Card</span>
          </div>
        </label>

        <label className={`flex-1 border p-4 rounded-md cursor-pointer ${selectedPayment === "cod" ? "ring-2 ring-blue-600" : ""}`}>
          <input type="radio" className="hidden" value="cod" name="payment" onChange={(e) => setSelectedPayment(e.target.value)} />
          <div className="flex items-center gap-4">
            <span className="text-xl">💵</span>
            <span className="text-gray-700 font-medium">Cash on Delivery</span>
          </div>
        </label>
      </div>
    </div>
  </div>

  {/* Order Summary */}
  <div className="border rounded-lg p-6 bg-gray-50 h-fit sticky top-24">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
    <div className="space-y-2 text-sm text-gray-600">
      <div className="flex justify-between">
        <span>Items ({getCartCount()})</span>
        <span>{currency}{total}</span>
      </div>
      <div className="flex justify-between">
        <span>Shipping</span>
        <span>Free</span>
      </div>
      <div className="flex justify-between">
        <span>Tax (2%)</span>
        <span>{currency}{tax}</span>
      </div>
    </div>
    <hr className="my-4" />
    <div className="flex justify-between text-lg font-semibold text-gray-900">
      <span>Total</span>
      <span>{currency}{total + tax}</span>
    </div>
    <button
      disabled={!isCOD}
      onClick={() => router.push("/checkout/payment")}
      className={`w-full mt-6 py-3 rounded-md font-medium transition ${
        isCOD ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
      }`}
    >
      Proceed to Checkout
    </button>
  </div>
</div>

      <Footer />
    </>
  );
};

export default ShippingPage;
