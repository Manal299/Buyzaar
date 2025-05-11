// components/CheckoutProgress.jsx
"use client"
import { usePathname } from "next/navigation";
import React from "react";

const steps = [
  { label: "Cart", path: "/checkout/review" },
  { label: "Shipping", path: "/checkout/shipping" },
  { label: "Payment", path: "/checkout/payment" },
];

export default function CheckoutProgress() {
  const pathname = usePathname();
  const activeIndex = steps.findIndex((step) => pathname.startsWith(step.path));

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isCompleted = index < activeIndex;

        return (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center ${
                isActive
                  ? "bg-blue-600 text-white"
                  : isCompleted
                  ? "bg-blue-200 text-blue-800"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <p
              className={`text-sm font-medium ${
                isActive
                  ? "text-black"
                  : isCompleted
                  ? "text-blue-800"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </p>
            {index !== steps.length - 1 && (
              <div className={`w-8 h-0.5 ${
                isCompleted ? "bg-blue-600" : "bg-gray-300"
              }`}></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
