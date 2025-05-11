"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";

const OrderSummary = () => {
  const { currency, getCartCount, getCartAmount, router } = useAppContext();

  const taxAmount = Math.floor(getCartAmount() * 0.02);
  const total = getCartAmount() + taxAmount;

  return (
    <div className="w-full md:w-96 bg-gray-100 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Items ({getCartCount()})</span>
          <span className="font-medium">{currency}{getCartAmount()}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="font-medium text-green-600">Free</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (2%)</span>
          <span className="font-medium">{currency}{taxAmount}</span>
        </div>
        <div className="border-t border-gray-300 pt-3 flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{currency}{total}</span>
        </div>
      </div>

      <button
        onClick={() => router.push("/checkout/shipping")}
        className="w-full mt-6 py-3 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
      >
        Proceed to Shipping
      </button>
    </div>
  );
};

export default OrderSummary;
