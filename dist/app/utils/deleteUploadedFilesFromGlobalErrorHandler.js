import { deleteFileFromCloudinary } from "../config/cloudinary.config.js";
/**
 * Cleans up uploaded files from Cloudinary when an error occurs.
 *
 * Works with two upload strategies:
 * 1. CloudinaryStorage (multer-storage-cloudinary) — files have `file.path` (Cloudinary URL)
 * 2. memoryStorage — files are uploaded manually in service layer,
 *    and the Cloudinary URL is stored in `req.cloudinaryUrls` by the service if needed.
 */
export const deleteUploadedFilesFromGlobalErrorHandler = async (req) => {
    try {
        const filesToDelete = [];
        // Strategy 1: CloudinaryStorage — file.path contains the Cloudinary URL
        if (req.file && req.file.path && req.file.path.startsWith("http")) {
            filesToDelete.push(req.file.path);
        }
        else if (req.files &&
            typeof req.files === "object" &&
            !Array.isArray(req.files)) {
            Object.values(req.files).forEach((fileArray) => {
                if (Array.isArray(fileArray)) {
                    fileArray.forEach((file) => {
                        if (file.path && file.path.startsWith("http")) {
                            filesToDelete.push(file.path);
                        }
                    });
                }
            });
        }
        else if (req.files && Array.isArray(req.files)) {
            req.files.forEach((file) => {
                if (file.path && file.path.startsWith("http")) {
                    filesToDelete.push(file.path);
                }
            });
        }
        if (filesToDelete.length > 0) {
            await Promise.all(filesToDelete.map((url) => deleteFileFromCloudinary(url)));
            console.log(`Deleted ${filesToDelete.length} uploaded file(s) from Cloudinary due to error.`);
        }
    }
    catch (error) {
        console.error("Error deleting uploaded files from Global Error Handler:", error.message);
    }
};
//# sourceMappingURL=deleteUploadedFilesFromGlobalErrorHandler.js.map