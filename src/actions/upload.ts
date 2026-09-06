'use server';

import cloudinary from '@/lib/cloudinary';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;

  if (!file || file.size === 0) {
    throw new Error('No se recibió ningún archivo');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'app' },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        },
      );
      uploadStream.end(buffer);
    },
  );

  return {
    publicId: result.public_id,
    url: result.secure_url,
  };
}
