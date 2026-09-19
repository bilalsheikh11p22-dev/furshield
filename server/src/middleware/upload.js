import multer from "multer";
import path from "path";
import os from "os";

// Purane imports na toot jayein, is liye export rakha hai. Ab isme files save nahi hoti.
export const UPLOAD_ROOT = process.env.VERCEL
  ? path.join(os.tmpdir(), "uploads")
  : path.join(process.cwd(), "src", "uploads");

const IMAGE_TYPES = [".jpg", ".jpeg", ".jfif", ".png", ".webp"];
const VIDEO_TYPES = [".mp4", ".webm", ".mov"];
// Documents: vet certificates, X-rays, lab reports, insurance policies.
const DOCUMENT_TYPES = [".pdf", ".jpg", ".jpeg", ".jfif", ".png", ".webp"];

function fileFilterFor(allowedExts) {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExts.includes(ext)) {
      return cb(
        new Error(`Unsupported file type: ${ext}. Allowed: ${allowedExts.join(", ")}`)
      );
    }

    cb(null, true);
  };
}

// File disk par nahi, memory (req.file.buffer) mein aayegi
const storage = multer.memoryStorage();

// Vercel ki request limit 4.5 MB hai, is liye limits 4 MB rakhi hain
export const uploadImageMiddleware = multer({
  storage,
  fileFilter: fileFilterFor(IMAGE_TYPES),
  limits: { fileSize: 4 * 1024 * 1024 },
}).single("image");

export const uploadVideoMiddleware = multer({
  storage,
  fileFilter: fileFilterFor(VIDEO_TYPES),
  limits: { fileSize: 4 * 1024 * 1024 },
}).single("video");

export const uploadDocumentMiddleware = multer({
  storage,
  fileFilter: fileFilterFor(DOCUMENT_TYPES),
  limits: { fileSize: 4 * 1024 * 1024 },
}).single("document");