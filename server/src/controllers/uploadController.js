import { ok, fail } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBuffer } from "../config/cloudinary.js";

const cloudinaryReady = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) return fail(res, "No image file received", 400);
  if (!cloudinaryReady()) return fail(res, "Cloudinary is not configured on the server", 500);

  const result = await uploadBuffer(req.file.buffer, "images", "image");
  return ok(res, { url: result.secure_url }, "Image uploaded successfully", 201);
});

export const uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) return fail(res, "No video file received", 400);
  if (!cloudinaryReady()) return fail(res, "Cloudinary is not configured on the server", 500);

  const result = await uploadBuffer(req.file.buffer, "videos", "video");
  return ok(res, { url: result.secure_url }, "Video uploaded successfully", 201);
});

export const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) return fail(res, "No document file received", 400);
  if (!cloudinaryReady()) return fail(res, "Cloudinary is not configured on the server", 500);

  const result = await uploadBuffer(req.file.buffer, "documents", "auto");
  return ok(res, { url: result.secure_url, fileType: req.file.mimetype }, "Document uploaded successfully", 201);
});