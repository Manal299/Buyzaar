import clientPromise from "@/lib/mongodb";

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  if (method !== "PUT") {
    return res.status(405).json({ message: "Only PUT allowed" });
  }

  const client = await clientPromise;
  const db = client.db();

  const { action } = req.body;

  if (!["ban", "unban", "promote", "demote"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  const update = {};

  // Action logic
  if (action === "ban") update.status = "banned";
  if (action === "unban") update.status = "active";
  if (action === "promote") update.role = "seller";
  if (action === "demote") update.role = "buyer";

  const result = await db.collection("users").updateOne(
    { _id: new (require("mongodb")).ObjectId(id) },
    { $set: update }
  );

  if (result.modifiedCount === 1) {
    res.status(200).json({ message: `User ${action}d successfully.` });
  } else {
    res.status(404).json({ message: "User not found or already updated." });
  }
}
