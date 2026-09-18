import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

import os from "os";

export const UPLOAD_ROOT = process.env.VERCEL
  ? path.join(os.tmpdir(), "uploads")            // Vercel par /tmp
  : path.join(process.cwd(), "src", "uploads");  // local par purana path

const IMAGE_TYPES = [
  ".jpg",
  ".jpeg",
  ".jfif",
  ".png",
  ".webp",
];

const VIDEO_TYPES = [".mp4", ".webm", ".mov"];

// Documents: vet certificates, X-rays, lab reports, insurance policies.
const DOCUMENT_TYPES = [".pdf", ".jpg", ".jpeg", ".jfif", ".png", ".webp"];

function makeStorage(subfolder) {
  const dest = path.join(UPLOAD_ROOT, subfolder);

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, dest);
    },

    filename: (req, file, cb) => {
      const unique = crypto.randomBytes(8).toString("hex");
      const ext = path.extname(file.originalname).toLowerCase();

      cb(
        null,
        `${Date.now()}-${unique}${ext}`
      );
    },
  });
}

function fileFilterFor(allowedExts) {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowedExts.includes(ext)) {
      return cb(
        new Error(
          `Unsupported file type: ${ext}. Allowed: ${allowedExts.join(", ")}`
        )
      );
    }

    cb(null, true);
  };
}

export const uploadImageMiddleware = multer({
  storage: makeStorage("images"),

  fileFilter: fileFilterFor(IMAGE_TYPES),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("image");

export const uploadVideoMiddleware = multer({
  storage: makeStorage("videos"),

  fileFilter: fileFilterFor(VIDEO_TYPES),

  limits: {
    fileSize: 30 * 1024 * 1024,
  },
}).single("video");

export const uploadDocumentMiddleware = multer({
  storage: makeStorage("documents"),

  fileFilter: fileFilterFor(DOCUMENT_TYPES),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).single("document");