import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import { ValidationError } from "@packages/backend/errors";

// Ensure Cloudinary is configured
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const createImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileName } = req.body;

    if (!fileName) {
      return next(new ValidationError("Missing 'fileName' in request body."));
    }

    const result = await cloudinary.uploader.upload(fileName);

    return res.status(201).json({
      public_Id: result.public_id,
      url: result.secure_url,
    });

  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return res.status(500).json({ error: "Image upload failed." });
  }
};

export const removeImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { public_Id } = req.body;

    if (!public_Id) {
      return next( new ValidationError("Missing 'public_Id' in request body."));
    }

    const result = await cloudinary.uploader.destroy(public_Id);

    if(!result){
      return next(new ValidationError("Image dose not found"))
    }

    if (result.result === "ok") {
      return res.status(201).json({ message: "Image deleted successfully." });
    } else {
      return next( new ValidationError( "Failed to delete image."));
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return res.status(500).json({ error: "Image deletion failed." });
  }
};