import type {
  CloudinaryDestroyResponse,
  CloudinaryUploadResponse,
} from '@/data/types/services';

const CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'nome-cloud-ficticio';
const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'preset-upload-ficticio';
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
const API_SECRET = import.meta.env.VITE_CLOUDINARY_API_SECRET;

const sha1 = async (value: string) => {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-1', data);
  return [...new Uint8Array(hash)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
};

export const publicIdFromUrl = (url: string) => {
  try {
    const { pathname } = new URL(url);
    const marker = '/upload/';
    const start = pathname.indexOf(marker);
    if (start < 0) return null;

    const parts = pathname
      .slice(start + marker.length)
      .split('/')
      .filter(Boolean)
      .filter((part) => !part.includes(',') && !/^[a-z]+_/.test(part));
    const withoutVersion = parts[0]?.match(/^v\d+$/) ? parts.slice(1) : parts;
    if (withoutVersion.length === 0) return null;

    const last = withoutVersion.at(-1)?.replace(/\.[a-zA-Z0-9]+$/, '');
    if (!last) return null;

    return [...withoutVersion.slice(0, -1), last].join('/');
  } catch {
    return null;
  }
};

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const payload = (await response
    .json()
    .catch(() => ({}))) as CloudinaryUploadResponse;

  if (!response.ok || !payload.secure_url) {
    throw new Error(payload.error?.message ?? 'Falha ao enviar a imagem');
  }

  return payload.secure_url;
};

export const deleteImage = async (imageUrl?: string | null) => {
  if (!imageUrl?.includes(`res.cloudinary.com/${CLOUD_NAME}`)) {
    return;
  }

  const publicId = publicIdFromUrl(imageUrl);
  if (!publicId) {
    return;
  }

  if (!API_KEY || !API_SECRET) {
    console.warn(
      'Cloudinary: sem API_KEY/API_SECRET, a imagem não foi excluída'
    );
    return;
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = await sha1(
    `invalidate=true&public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`
  );

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: API_KEY,
    signature,
    invalidate: 'true',
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
    {
      method: 'POST',
      body,
    }
  );

  const payload = (await response
    .json()
    .catch(() => ({}))) as CloudinaryDestroyResponse;

  if (
    !response.ok ||
    (payload.result !== 'ok' && payload.result !== 'not found')
  ) {
    throw new Error(payload.error?.message ?? 'Falha ao excluir a imagem');
  }
};
