"use client";

import Link from 'next/link';
import useSWR from 'swr';
import { useState } from 'react';
import SellerSidebar from '@/components/seller/SellerSidebar';
import { Search, Eye, FileDown, FileText } from 'lucide-react';

const fetcher = url => fetch(url, { headers: { 'x-seller-id': 'demo-seller' } }).then(res => res.json());

export default function ProductsPage() {
  const { data: products, error, mutate } = useSWR('/api/seller/products', fetcher);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [view, setView] = useState('grid');
  const [selected, setSelected] = useState([]);

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/seller/products/${id}`, {
      method: 'DELETE',
      headers: { 'x-seller-id': 'demo-seller' },
    });
    mutate();
  }

  function toggleSelect(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }

  async function handleBulkDelete() {
    if (!confirm('Delete selected products?')) return;
    await Promise.all(selected.map(id => fetch(`/api/seller/products/${id}`, {
      method: 'DELETE', headers: { 'x-seller-id': 'demo-seller' },
    })));
    mutate();
    setSelected([]);
  }

  function handleExportCSV() {
    const headers = ['Title', 'Price', 'Stock', 'Category'];
    const rows = products.map(p => [p.title, p.price, p.stock, p.category || 'N/A']);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  const filteredProducts = products?.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesStock =
      filter === 'all' || (filter === 'low' && p.stock < 5) || (filter === 'out' && p.stock === 0);
    const matchesCategory = category === 'all' || p.category === category;
    return matchesSearch && matchesStock && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'priceHigh') return b.price - a.price;
    if (sortBy === 'priceLow') return a.price - b.price;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  if (error) return <p className="p-6 text-red-500">Failed to load products.</p>;
  if (!products) return <p className="p-6">Loading products…</p>;

  const total = products.length;
  const lowStock = products.filter(p => p.stock < 5).length;
  const outOfStock = products.filter(p => p.stock === 0).length;

  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <div className="flex-1 bg-gray-100 p-6 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Products</h1>
          <div className="flex gap-3">
            <button onClick={handleExportCSV} className="flex items-center bg-gray-200 px-3 py-2 text-sm rounded-lg hover:bg-gray-300">
              <FileDown className="w-4 h-4 mr-2" /> Export CSV
            </button>
            <Link href="/seller/products/create">
              <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:bg-indigo-700">
                + New Product
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-64"
            />
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border px-3 py-2 rounded-lg text-sm">
              <option value="all">All Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border px-3 py-2 rounded-lg text-sm">
              <option value="all">All Categories</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Home">Home</option>
              <option value="Accessories">Accessories</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-3 py-2 rounded-lg text-sm">
              <option value="latest">Latest</option>
              <option value="priceHigh">Price High to Low</option>
              <option value="priceLow">Price Low to High</option>
            </select>
            <select value={view} onChange={(e) => setView(e.target.value)} className="border px-3 py-2 rounded-lg text-sm">
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
            </select>
          </div>

          <p className="text-gray-600 text-sm">
            {total} total • {lowStock} low • {outOfStock} out of stock
          </p>
        </div>

        {selected.length > 0 && (
          <div className="flex justify-end">
            <button onClick={handleBulkDelete} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Delete Selected ({selected.length})
            </button>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="bg-white shadow rounded-xl p-8 text-center text-gray-500">
            No matching products found.
          </div>
        ) : (
          view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col">
                  <img
                    src={p.imageUrl || '/placeholder.png'}
                    alt={p.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">{p.title}</h2>
                      <p className="text-gray-600 mb-2 text-sm">${p.price.toFixed(2)}</p>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        p.stock === 0 ? 'bg-red-100 text-red-800' :
                        p.stock < 5 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'}`}> {p.stock} in stock </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="space-x-2">
                        <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                        <Link href={`/seller/products/${p.id}`}>
                          <button className="text-indigo-600 hover:underline text-sm">Edit</button>
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      <span className="text-xs text-gray-400">Updated: {new Date(p.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map(p => (
                <div key={p.id} className="bg-white shadow rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} />
                    <img src={p.imageUrl || '/placeholder.png'} alt={p.title} className="w-16 h-16 rounded object-cover" />
                    <div>
                      <h2 className="text-lg font-semibold">{p.title}</h2>
                      <p className="text-sm text-gray-600">${p.price.toFixed(2)} • {p.stock} in stock</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/seller/products/${p.id}`}>
                      <button className="text-indigo-600 hover:underline text-sm">Edit</button>
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-sm">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
