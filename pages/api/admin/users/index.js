import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET allowed" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("Buyzaar");
    const users = await db.collection("users").find({}, {
      projection: { password: 0 }
    }).toArray();
    console.log("✅ Users fetched:", users);  // Add this

    res.status(200).json({ users });
  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
