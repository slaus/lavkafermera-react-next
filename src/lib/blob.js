import { put, list, del, head } from '@vercel/blob';

const DATA_FILE_KEY = 'json/data.json';
const IMAGES_PREFIX = 'images/';

const getDataFileUrl = async () => {
  if (process.env.NEXT_PUBLIC_BLOB_DATA_URL) {
    return process.env.NEXT_PUBLIC_BLOB_DATA_URL;
  }

  try {
    const { url } = await head(DATA_FILE_KEY);
    return url;
  } catch (error) {
    console.error('Failed to get data file URL from Blob', error);
    throw new Error('BLOB_DATA_URL not configured and head failed');
  }
};

export async function getProducts() {
  try {
    const url = await getDataFileUrl();
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Помилка читання data.json з Blob:', error);
    return [];
  }
}

export async function saveProducts(products) {
  const blob = await put(DATA_FILE_KEY, JSON.stringify(products, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob;
}

export async function uploadImage(file) {
  const uniqueName = `${IMAGES_PREFIX}${Date.now()}-${file.name}`;
  const blob = await put(uniqueName, file, { access: 'public' });
  return blob.url;
}

export async function deleteImageByUrl(imageUrl) {
  if (!imageUrl) return;
  const urlObj = new URL(imageUrl);
  const key = urlObj.pathname.slice(1);
  await del(key);
}

export async function listAllImages() {
  const blobs = await list({ prefix: IMAGES_PREFIX });
  return blobs.blobs;
}