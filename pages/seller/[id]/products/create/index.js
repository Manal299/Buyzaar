"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SellerSidebar from '@/components/seller/SellerSidebar';

export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    category: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // replace with your Cloudinary preset

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setForm(prev => ({ ...prev, imageUrl: data.secure_url }));
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/seller/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-seller-id': 'demo-seller'
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10)
        })
      });

      if (!res.ok) throw new Error('Failed to create product');
      router.push('/seller/products');
    } catch (err) {
      console.error(err);
      setError('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <div className="flex-1 bg-gray-100 p-6  flex items-center justify-center">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Add New Product</h1>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-xl p-6">
            <div>
              <label className="block font-medium mb-1">Product Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Category</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg"
                required
              >
                <option value="">Select category</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Home">Home</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg bg-white"
              />
              {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
              {form.imageUrl && (
                <img src={form.imageUrl} alt="Preview" className="mt-3 h-40 rounded-lg object-cover border" />
              )}
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Save Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
