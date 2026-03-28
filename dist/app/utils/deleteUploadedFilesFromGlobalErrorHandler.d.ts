import { Request } from "express";
/**
 * Cleans up uploaded files from Cloudinary when an error occurs.
 *
 * Works with two upload strategies:
 * 1. CloudinaryStorage (multer-storage-cloudinary) — files have `file.path` (Cloudinary URL)
 * 2. memoryStorage — files are uploaded manually in service layer,
 *    and the Cloudinary URL is stored in `req.cloudinaryUrls` by the service if needed.
 */
export declare const deleteUploadedFilesFromGlobalErrorHandler: (req: Request) => Promise<void>;
//# sourceMappingURL=deleteUploadedFilesFromGlobalErrorHandler.d.ts.map