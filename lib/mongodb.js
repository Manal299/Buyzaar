import { MongoClient } from 'mongodb';  // Step 1: Driver se MongoClient uthao

const uri = process.env.MONGODB_URI;    // Step 2: MongoDB ka URI .env.local se lo
const options = {};                     // Step 3: Extra options (optional)

let client;                             // Step 4: Client declare karo
let clientPromise;                      // Step 5: Promise banayenge to share

// Step 6: Agar .env.local mai URI na ho to error
if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

// Step 7: Dev mode mai connection cache hota hai to baar baar create na ho
if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Prod mode: har request pe fresh promise
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise; // Step 8: Export for reuse
