import { get, put, list, del } from '@vercel/blob';

const DATA_FILE_KEY = 'json/data.json';
const IMAGES_PREFIX = 'images/';

export async function getProducts() {
  try {
    const blobResult = await get(DATA_FILE_KEY, { access: 'public' });
    if (!blobResult || blobResult.statusCode !== 200) {
      throw new Error(`HTTP ${blobResult?.statusCode || 'unknown'}`);
    }

    const text = await streamToString(blobResult.stream);
    const products = JSON.parse(text);
    console.log(`✅ Завантажено ${products.length} товарів`);
    return products;
  } catch (error) {
    console.error('Помилка читання data.json:', error);
    return [];
  }
}

async function streamToString(stream) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
  }
  return result;
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
  return await put(uniqueName, file, { access: 'public' });
}

export async function deleteImageByUrl(imageUrl) {
  if (!imageUrl) return;
  const key = new URL(imageUrl).pathname.slice(1);
  await del(key);
}

export async function listAllImages() {
  const { blobs } = await list({ prefix: IMAGES_PREFIX });
  return blobs;
}