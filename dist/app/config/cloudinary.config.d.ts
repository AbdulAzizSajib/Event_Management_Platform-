import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
export declare const uploadFileToCloudinary: (buffer: Buffer, fileName: string) => Promise<UploadApiResponse>;
export declare const deleteFileFromCloudinary: (url: string) => Promise<void>;
export declare const cloudinaryUpload: typeof cloudinary;
//# sourceMappingURL=cloudinary.config.d.ts.map