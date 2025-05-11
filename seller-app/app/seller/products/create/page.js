"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', price: '', stock: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/seller/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-seller-id': 'demo-seller' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    router.push('/seller/products');
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Create New Product</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: 'Title', name: 'title', type: 'text' },
            { label: 'Price', name: 'price', type: 'number' },
            { label: 'Stock', name: 'stock', type: 'number' },
            { label: 'Image URL', name: 'imageUrl', type: 'text' },
          ].map(({ label, name, type }) => (
            <div key={name}>
              <label className="block text-gray-700 mb-1">{label}</label>
              <input
                required
                type={type}
                value={form[name]}
                onChange={e => setForm({ ...form, [name]: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl shadow hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
