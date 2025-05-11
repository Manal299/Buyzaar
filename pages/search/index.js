import { useRouter } from "next/router";
import { productsDummyData } from "@/assets/assets"; // Adjust if you're fetching via API

export default function SearchPage() {
  const router = useRouter();
  const { query } = router.query;

  const filtered = productsDummyData.filter((item) =>
    item.name.toLowerCase().includes((query || "").toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search results for “{query}”
      </h1>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-500">${item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
