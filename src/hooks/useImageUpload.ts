import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { uploadImage } from '@/actions/upload';

interface UseImageUploadOptions {
  errorMessage: string;
  onPersist: (url: string) => Promise<{ error?: string }>;
  onUploaded?: (url: string) => void;
}

interface UseImageUploadResult {
  error: string | undefined;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  setUrl: (url: string | null) => void;
  uploading: boolean;
  url: string | null;
}

export function useImageUpload({
  errorMessage,
  onPersist,
  onUploaded,
}: UseImageUploadOptions): UseImageUploadResult {
  const [url, setUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(undefined);

    try {
      const formData = new FormData();
      formData.set('file', file);

      const { url: uploadedUrl } = await uploadImage(formData);
      const result = await onPersist(uploadedUrl);

      if (result.error) {
        setError(result.error);
        return;
      }

      setUrl(uploadedUrl);
      onUploaded?.(uploadedUrl);
    } catch {
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return { error, handleChange, setUrl, uploading, url };
}
