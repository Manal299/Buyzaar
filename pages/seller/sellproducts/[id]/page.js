"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [form, setForm] = useState({ title: '', price: '', stock: '', imageUrl: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/seller/products/${id}`, { headers: { 'x-seller-id': 'demo-seller' } })
      .then(res => res.json())
      .then(prod => {
        setForm({
          title: prod.title,
          price: prod.price,
          stock: prod.stock,
          imageUrl: prod.imageUrl,
        });
        setLoading(false);
      });
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await fetch(`/api/seller/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-seller-id': 'demo-seller' },
      body: JSON.stringify(form),
    });
    router.push('/seller/products');
  }

  if (loading) return <p className="p-6">Loading product…</p>;

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
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
            className="w-full bg-indigo-600 text-white py-3 rounded-xl shadow hover:bg-indigo-700 disabled:opacity-50"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
