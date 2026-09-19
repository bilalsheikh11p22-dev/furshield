import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadBuffer(buffer, folder, resourceType = "auto") {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `furshield/${folder}`, resource_type: resourceType },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });
}