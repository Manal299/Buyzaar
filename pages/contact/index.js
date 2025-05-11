import React from "react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ContactUs() {
  return (
    <section className="bg-white w-screen min-h-screen">
    <Navbar />
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        {/* Left Info Panel */}
        <div className="bg-gray-50 p-10 lg:p-20 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Contact Buyzaar</h2>
          <p className="text-gray-600 mb-10">
            Have a question, suggestion, or need help with an order? Our team is here to assist you. 
            Reach out and we’ll get back to you as soon as possible.
          </p>
          <div className="space-y-5 text-gray-700 text-sm">
            <div className="flex items-center gap-3">
              <MapPinIcon className="h-5 w-5 text-gray-700" />
              <span>545 Mavis Island, Chicago, IL 99191</span>
            </div>
            <div className="flex items-center gap-3">
              <PhoneIcon className="h-5 w-5 text-gray-700" />
              <span>+1 (555) 234-5678</span>
            </div>
            <div className="flex items-center gap-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-700" />
              <span>support@buyzaar.com</span>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="p-10 lg:p-20 flex items-center justify-center">
          <form className="w-full max-w-lg space-y-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First name"
                className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Last name"
                className="w-1/2 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Phone number"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              rows="5"
              placeholder="Message"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Send message
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </section>
    
  );
}
