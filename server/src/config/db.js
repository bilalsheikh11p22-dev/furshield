import dns from "node:dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not set. Check server/.env");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");

    await mongoose.connect(uri, {
      family: 4,
      tls: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      maxPoolSize: 5,
      retryWrites: true,
      retryReads: true
    });

    await mongoose.connection.db.admin().command({ ping: 1 });

    console.log("MongoDB Atlas connected and ping successful");
  } catch (error) {
    console.error("MongoDB connection error:");
    console.error(error);
    process.exit(1);
  }
}