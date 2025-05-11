"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutProgress from "@/components/CheckoutProgress";

export default function ShippingPage() {
  const router = useRouter();
  const { getCartAmount, currency } = useAppContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "card",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePaymentSelect = (method) => {
    setFormData({ ...formData, paymentMethod: method });
  };

  const handleNext = () => {
    // TODO: Save address to context if needed
    router.push("/checkout/payment");
  };

  return (
    <>
      <Navbar />
       <div className="mt-6 md:mt-10">
        <CheckoutProgress  />
      </div>
      <div className="px-4 sm:px-8 py-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-6">Delivery Details</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input name="firstName" value={formData.firstName} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" placeholder="Enter First Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input name="lastName" value={formData.lastName} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" placeholder="Enter Last Name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input name="email" value={formData.email} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" placeholder="Enter Email" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone No.</label>
                <input name="phone" value={formData.phone} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" placeholder="Enter Phone No." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address Line</label>
                <input name="address" value={formData.address} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" placeholder="Enter Address Line" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input name="city" value={formData.city} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" placeholder="Enter City" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input name="state" value={formData.state} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" placeholder="Enter State" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Zip Code</label>
                <input name="zip" value={formData.zip} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm" placeholder="Enter Zip Code" />
              </div>
            </div>

            <h2 className="text-2xl font-semibold mt-10 mb-6">Payment</h2>
            <div className="flex flex-col md:flex-row gap-4">
              <div
                onClick={() => handlePaymentSelect("card")}
                className={`cursor-pointer border rounded-md p-4 w-full md:w-1/2 ${formData.paymentMethod === "card" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
              >
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="radio" name="payment" checked={formData.paymentMethod === "card"} className="w-5 h-5" readOnly />
                  <span className="font-medium">Pay with Debit/Credit Card</span>
                </label>
              </div>

              <div
                onClick={() => handlePaymentSelect("cash")}
                className={`cursor-pointer border rounded-md p-4 w-full md:w-1/2 ${formData.paymentMethod === "cash" ? "border-blue-600 bg-blue-50" : "border-gray-300"}`}
              >
                <label className="flex items-center gap-4 cursor-pointer">
                  <input type="radio" name="payment" checked={formData.paymentMethod === "cash"} className="w-5 h-5" readOnly />
                  <span className="font-medium">Pay with Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border rounded-md p-6 h-fit">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex justify-between"><span>Subtotal</span><span>{currency}{getCartAmount()}</span></li>
              <li className="flex justify-between"><span>Shipping</span><span>Free</span></li>
              <li className="flex justify-between"><span>Tax</span><span>{currency}{Math.floor(getCartAmount() * 0.05)}</span></li>
              <li className="border-t pt-3 flex justify-between font-medium text-gray-800 text-base">
                <span>Total</span><span>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.05)}</span>
              </li>
            </ul>

            <div className="mt-6 space-y-3">
              <button onClick={handleNext} className="w-full bg-blue-600 text-white py-2.5 rounded hover:bg-blue-700">
                Continue to Payment
              </button>

              <button onClick={() => router.push("/cart")} className="w-full border py-2.5 rounded text-sm hover:bg-gray-50">
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
