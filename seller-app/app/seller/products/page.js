"use client";
import Link from 'next/link';
import useSWR from 'swr';

const fetcher = url =>
  fetch(url, { headers: { 'x-seller-id': 'demo-seller' } }).then(res => res.json());

export default function ProductsPage() {
  const { data: products, error, mutate } = useSWR('/api/seller/products', fetcher);

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/seller/products/${id}`, {
      method: 'DELETE',
      headers: { 'x-seller-id': 'demo-seller' },
    });
    mutate();
  }

  if (error) return <p className="p-6 text-red-500">Failed to load products.</p>;
  if (!products) return <p className="p-6">Loading products…</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Products</h1>
        <Link href="/seller/products/create">
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:bg-indigo-700">
            + New Product
          </button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-8 text-center text-gray-500">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col">
              <img
                src={p.imageUrl}
                alt={p.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
                  <p className="text-gray-600 mb-4">${p.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Stock: {p.stock}</span>
                  <div className="space-x-2">
                    <Link href={`/seller/products/${p.id}`}>
                      <button className="text-indigo-600 hover:underline">Edit</button>
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
