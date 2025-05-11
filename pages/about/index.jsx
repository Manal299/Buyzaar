"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="px-6 md:px-16 lg:px-32 pt-16 pb-24 space-y-24 bg-white text-gray-800">

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-[500px] bg-cover bg-center bg-no-repeat flex items-center justify-center"
          style={{ backgroundImage: "url('/packaging.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center px-6 md:px-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Empowering the Future of Online Commerce
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto">
              Buyzaar helps sellers ship smarter and buyers shop easier — all from one full-stack e-commerce platform.
            </p>
          </div>
        </motion.section>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

        {/* Mission */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                Buyzaar was founded with a simple vision — to break the barriers between buyers and sellers by
                offering a seamless, reliable, and empowering digital commerce experience.
              </p>
              <p className="text-base text-gray-500">
                We believe technology should enable business owners to focus on what matters: building relationships,
                growing sustainably, and serving their customers with confidence — not wrestling with platforms.
              </p>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-900">44 million</h3>
                <p className="text-gray-500">Transactions every 24 hours</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">$119 trillion</h3>
                <p className="text-gray-500">Assets under holding</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-900">46,000</h3>
                <p className="text-gray-500">New users annually</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Helping Buyers */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gray-50 py-20"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 pl-6 md:pl-12 lg:pl-20">

              <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Helping Buyers</h3>
              <ul className="list-disc ml-5 text-gray-700 space-y-2">
                {["Quick product discovery with responsive search", "Streamlined checkout process with secure payments", "Track orders in real-time from dashboard", "Multi-device experience for mobile-first shoppers"].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >{item}</motion.li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2 flex justify-center"
            >
              <Image
                src="/buyer.jpg"
                alt="Buyer using Buyzaar"
                width={400}
                height={300}
                className="rounded-lg shadow-md object-cover w-full max-w-md"
              />
            </motion.div>
          </div>
        </motion.section>

        {/* Empowering Sellers */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white py-20"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2 flex justify-center order-2 md:order-1"
            >
              <Image
                src="/seller.jpg"
                alt="Seller using Buyzaar dashboard"
                width={400}
                height={300}
                className="rounded-lg shadow-md object-cover w-full max-w-md"
              />
            </motion.div>
            <div className="md:w-1/2 order-1 md:order-2">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Empowering Sellers</h3>
              <ul className="list-disc ml-5 text-gray-700 space-y-2">
                {["Product & order management via seller dashboard", "Sales analytics to optimize performance", "Manage inventory and pricing on the go", "Instant upload with image preview and editing"].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >{item}</motion.li>
                ))}
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Journey Timeline */}
<motion.section
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
  className="py-20 px-6 md:px-16 lg:px-32"
>
  <h2 className="text-2xl font-semibold text-gray-800 mb-12 text-center">Our Journey</h2>

  <div className="relative grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-gray-700 max-w-7xl mx-auto">
    {[
      {
        date: "2023",
        title: "Buyzaar Launched",
        desc: "Started with a goal to bridge buyer-seller gaps through modern tools.",
      },
      {
        date: "2024",
        title: "Seller Dashboard Released",
        desc: "Empowering sellers with tools to grow and manage efficiently.",
      },
      {
        date: "2024",
        title: "Mobile Optimization",
        desc: "Built for all screens, making commerce accessible anytime, anywhere.",
      },
      {
        date: "2025",
        title: "Next.js 14 Upgrade",
        desc: "Improved performance, stability, and development speed.",
      },
    ].map((item, index, arr) => (
      <div
        key={index}
        className="relative text-center px-4 flex flex-col items-center"
      >
        {/* Dot + Year + Line */}
        <div className="relative flex items-center justify-center mb-2">
          {/* Dot */}
          <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block mr-2"></span>

          {/* Year */}
          <span className="text-sm font-semibold text-indigo-600 z-10">
            {item.date}
          </span>

          {/* Line after Year */}
          {index !== arr.length - 1 && (
            <div className="absolute top-1/2 left-full w-10 md:w-16 h-px bg-gray-300 ml-2" />
          )}
        </div>

        {/* Title + Description */}
        <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
        <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
      </div>
    ))}
  </div>
</motion.section>


        {/* Testimonials */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-indigo-800 via-indigo-700 to-indigo-800 text-white px-6 md:px-16 lg:px-32 py-16 rounded-lg"
        >
          <h2 className="text-3xl font-bold text-center mb-10">What Our Users Say</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {["Buyzaar’s seller dashboard allowed me to manage inventory, track sales, and grow my store without needing technical help.",
              "The checkout experience was seamless, fast, and felt incredibly secure. I use Buyzaar regularly now.",
              "Managing multiple products and analyzing performance used to be tough — until I moved to Buyzaar."]
              .map((text, i) => (
                <div
                  key={i}
                  className="bg-white/5 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                >
                  <p className="text-sm leading-relaxed text-white">“{text}”</p>
                  <div className="mt-4 font-semibold text-white">
                    {i === 0 ? "Ayesha, Seller" : i === 1 ? "Hamza, Buyer" : "Zainab, Entrepreneur"}
                  </div>
                </div>
            ))}
          </div>
        </motion.section>

        {/* Closing Section */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-white px-6 md:px-16 lg:px-32 py-20"
        >
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Looking Ahead</h2>
            <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">The journey has just begun</p>
            <p className="text-base text-gray-600 leading-relaxed">
              At Buyzaar, we’re not just building a platform — we’re shaping a future where independent
              businesses thrive and buyers enjoy a truly personalized experience. We're here to evolve
              with you, every step of the way.
            </p>
          </div>
        </motion.section>
      </main>
      <Footer />
    </>
  );
}
