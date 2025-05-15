"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import SellerSidebar from "@/components/seller/SellerSidebar";

export default function SellerProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id: userId } = router.query;

  const [form, setForm] = useState({
    storeName: "",
    storeDescription: "",
    storeAddress: "",
    storePhone: "",
    storeWebsite: "",
    storeLogo: "",
    businessType: "",
    taxId: "",
    establishedYear: "",
    categories: "",
    bankInfo: {
      bankName: "",
      accountNumber: "",
      routingNumber: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/seller/${userId}/profile`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const s = data.data;
          setForm({
            ...s,
            categories: s.categories?.join(", ") || "",
          });
        } else {
          setError("Failed to load profile");
        }
      });
  }, [userId]);

  function handleChange(e) {
    const { name, value } = e.target;
    if (name.includes("bankInfo.")) {
      const field = name.split(".")[1];
      setForm(prev => ({ ...prev, bankInfo: { ...prev.bankInfo, [field]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/seller/${userId}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categories: form.categories.split(",").map(c => c.trim()).filter(Boolean),
        }),
      });

      if (!res.ok) throw new Error("Update failed");
      router.push(`/seller/${userId}/dashboard`);
    } catch (err) {
      setError("Could not update profile.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") return <p className="p-6">Checking session…</p>;
  if (!session) return <p className="p-6 text-red-500">You must be logged in.</p>;

  return (
    <div className="flex min-h-screen">
      <SellerSidebar />
      <div className="flex-1 bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Edit Store Profile</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input name="storeName" value={form.storeName} onChange={handleChange} required placeholder="Store Name" className="border p-2 rounded" />
              <input name="storePhone" value={form.storePhone} onChange={handleChange} placeholder="Store Phone" className="border p-2 rounded" />
              <input name="storeWebsite" value={form.storeWebsite} onChange={handleChange} placeholder="Website URL" className="border p-2 rounded" />
              <input name="storeLogo" value={form.storeLogo} onChange={handleChange} placeholder="Logo Image URL" className="border p-2 rounded" />
              <input name="storeAddress" value={form.storeAddress} onChange={handleChange} required placeholder="Address" className="border p-2 rounded col-span-2" />
              <textarea name="storeDescription" value={form.storeDescription} onChange={handleChange} rows="3" placeholder="Description" className="border p-2 rounded col-span-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <select name="businessType" value={form.businessType} onChange={handleChange} required className="border p-2 rounded">
                <option value="">Select Business Type</option>
                <option value="individual">Individual</option>
                <option value="partnership">Partnership</option>
                <option value="llc">LLC</option>
                <option value="corporation">Corporation</option>
                <option value="nonprofit">Nonprofit</option>
              </select>
              <input name="establishedYear" value={form.establishedYear} onChange={handleChange} placeholder="Established Year" className="border p-2 rounded" />
              <input name="taxId" value={form.taxId} onChange={handleChange} placeholder="Tax ID" className="border p-2 rounded" />
              <input name="categories" value={form.categories} onChange={handleChange} placeholder="Categories (comma separated)" className="border p-2 rounded col-span-2" />
            </div>

            <h2 className="text-lg font-semibold mt-6">Bank Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <input name="bankInfo.bankName" value={form.bankInfo.bankName} onChange={handleChange} placeholder="Bank Name" className="border p-2 rounded" />
              <input name="bankInfo.accountNumber" value={form.bankInfo.accountNumber} onChange={handleChange} placeholder="Account Number" className="border p-2 rounded" />
              <input name="bankInfo.routingNumber" value={form.bankInfo.routingNumber} onChange={handleChange} placeholder="Routing Number" className="border p-2 rounded" />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={submitting} className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50 mt-4">
              {submitting ? "Saving…" : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
