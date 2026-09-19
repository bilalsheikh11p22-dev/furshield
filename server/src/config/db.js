import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

// Vercel par warm function dobara chale to purana connection reuse ho
const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not set");
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("Connecting to MongoDB Atlas...");

    cached.promise = mongoose
      .connect(uri, {
        family: 4,
        tls: true,
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 30000,
        maxPoolSize: 5,
        retryWrites: true,
        retryReads: true,
        bufferCommands: false,
      })
      .then(async (m) => {
        await m.connection.db.admin().command({ ping: 1 });
        console.log("MongoDB Atlas connected and ping successful");
        return m;
      })
      .catch((err) => {
        cached.promise = null; // agli request dobara try kare
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}