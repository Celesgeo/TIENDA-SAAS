import { cloudinary, configureCloudinary } from '../config/cloudinary.js';

export async function uploadImage(req, res) {
  if (!configureCloudinary()) {
    return res.status(503).json({
      error: 'Image upload is not configured. Set CLOUDINARY_* environment variables.',
    });
  }
  if (!req.file?.buffer) {
    return res.status(400).json({ error: 'No file uploaded (field name: image)' });
  }

  return new Promise((resolve) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'tienda-saas/products', resource_type: 'image' },
      (err, result) => {
        if (err) {
          resolve(res.status(500).json({ error: err.message || 'Upload failed' }));
          return;
        }
        resolve(res.json({ url: result.secure_url, publicId: result.public_id }));
      }
    );
    stream.end(req.file.buffer);
  });
}
