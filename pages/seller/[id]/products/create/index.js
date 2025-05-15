"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import SellerSidebar from "@/components/seller/SellerSidebar";

export default function AddProductPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.id;


  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    inventory: 0,
    category: "",
    sizes: [],
    colors: [],
    isActive: true,
    images: [],
  });

  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const cloudName = "dyng9mtex";
  const uploadPreset = "Buyzaar";

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setForm((prev) => ({ ...prev, images: [...prev.images, data.secure_url] }));
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== url),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/seller/${userId}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock, 10),
          inventory: parseInt(form.inventory, 10),
        }),
      });

      if (!res.ok) throw new Error("Failed to add product");
      router.push(`/seller/${userId}/products`);
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") return <p className="p-6">Checking session…</p>;
  if (!session) return <p className="p-6 text-red-500">You must be logged in.</p>;

  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <div className="flex-1 bg-gray-100 p-6 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Add Product</h1>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-xl p-6">
            <div>
              <label className="block font-medium mb-1">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border px-4 py-2 rounded"
                required
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Price (USD)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full border px-4 py-2 rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-medium mb-1">Inventory</label>
              <input
                type="number"
                value={form.inventory}
                onChange={(e) => setForm({ ...form, inventory: e.target.value })}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Sizes (comma-separated)</label>
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => {
                  const input = e.target.value;
                  setSizeInput(input);
                  setForm({ ...form, sizes: input.split(",").map(s => s.trim()).filter(Boolean) });
                }}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Colors (comma-separated)</label>
              <input
                type="text"
                value={colorInput}
                onChange={(e) => {
                  const input = e.target.value;
                  setColorInput(input);
                  setForm({ ...form, colors: input.split(",").map(c => c.trim()).filter(Boolean) });
                }}
                className="w-full border px-4 py-2 rounded"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="font-medium">Active?</label>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Upload New Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border px-4 py-2 rounded bg-white"
              />
              {uploading && <p className="text-sm text-gray-500">Uploading…</p>}
            </div>

            {form.images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {form.images.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="preview" className="h-32 w-full object-cover rounded-lg border" />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Adding…" : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
