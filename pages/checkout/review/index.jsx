"use client"
import React from "react";
import { assets } from "@/assets/assets";
import OrderSummary from "@/components/OrderSummary";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { useAppContext } from "@/context/AppContext";
import CheckoutProgress from "@/components/CheckoutProgress";
import Footer from "@/components/Footer";

const Cart = () => {
  const { products, router, cartItems, addToCart, updateCartQuantity, getCartCount } = useAppContext();

  const getTotalAmount = () => {
    return Object.keys(cartItems).reduce((acc, id) => {
      const product = products.find(p => p._id === id);
      return product ? acc + product.offerPrice * cartItems[id] : acc;
    }, 0).toFixed(2);
  };

  return (
    <>
      <Navbar />
      <div className="mt-6 md:mt-10">
  <CheckoutProgress step={1} />
</div>
      <div className="flex flex-col md:flex-row gap-10 px-6 md:px-16 lg:px-32 pt-14 mb-20">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b border-gray-500/30 pb-6">
            <p className="text-2xl md:text-3xl text-gray-500">
              Your <span className="font-medium text-black">Cart</span>
            </p>
            <p className="text-lg md:text-xl text-gray-500/80">{getCartCount()} Items</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead className="text-left border-b border-gray-200">
                <tr className="text-gray-700 text-sm">
                  <th className="text-nowrap pb-4 md:px-4 px-1 font-semibold">Product</th>
                  <th className="pb-4 md:px-4 px-1 font-semibold">Price</th>
                  <th className="pb-4 md:px-4 px-1 font-semibold">Quantity</th>
                  <th className="pb-4 md:px-4 px-1 font-semibold">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cartItems).map((itemId) => {
                  const product = products.find(product => product._id === itemId);
                  if (!product || cartItems[itemId] <= 0) return null;

                  const quantity = cartItems[itemId];

                  return (
                    <tr key={itemId} className="border-b border-gray-100 transition-transform duration-300 hover:bg-gray-50">
                      <td className="flex items-center gap-4 py-4 md:px-4 px-1">
                        <div className="rounded-lg overflow-hidden bg-gray-100 p-2">
                          <Image
                            src={product.image[0]}
                            alt={product.name}
                            className="w-16 h-auto object-cover"
                            width={1280}
                            height={720}
                          />
                        </div>
                        <div className="text-sm text-gray-800">
                          <p className="font-medium leading-5 mb-1">{product.name}</p>
                          <button
                            className="text-xs text-red-500 hover:underline"
                            onClick={() => updateCartQuantity(product._id, 0)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-700 text-sm font-medium">${product.offerPrice.toFixed(2)}</td>
                      <td className="py-4 md:px-4 px-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(product._id, quantity - 1)}
                            disabled={quantity <= 1}
                            className={`p-1 border rounded ${quantity <= 1 ? 'cursor-not-allowed opacity-40' : 'hover:bg-gray-100'}`}
                          >
                            <Image src={assets.decrease_arrow} alt="decrease" className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={e => updateCartQuantity(product._id, Number(e.target.value))}
                            className="w-12 text-center border rounded-md text-sm py-1"
                            min={1}
                          />
                          <button onClick={() => addToCart(product._id)} className="p-1 border rounded hover:bg-gray-100">
                            <Image src={assets.increase_arrow} alt="increase" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 md:px-4 px-1 text-gray-700 text-sm font-medium">${(product.offerPrice * quantity).toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-right mt-6 text-lg text-gray-700 font-medium">
            Total: <span className="text-black font-semibold">${getTotalAmount()}</span>
          </div>

          <button
            onClick={() => router.push('/products')}
            className="group flex items-center mt-6 gap-2 text-black hover:underline text-sm font-medium"
          >
            <Image
              className="group-hover:-translate-x-1 transition-transform"
              src={assets.arrow_right_icon_black}
              alt="arrow"
            />
            Continue Shopping
          </button>
        </div>
        <OrderSummary />
      </div>
      <Footer />
    </>
  );
};

export default Cart;
