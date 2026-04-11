import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data.json');
const imagesDir = path.join(process.cwd(), 'public', 'images');

// Вспомогательная функция удаления файла изображения
async function deleteImageFile(filename) {
  if (!filename) return;
  const filePath = path.join(imagesDir, filename);
  try {
    await fs.unlink(filePath);
    console.log(`Deleted image: ${filename}`);
  } catch (err) {
    // Файл может не существовать – игнорируем ошибку
    if (err.code !== 'ENOENT') {
      console.error(`Error deleting image ${filename}:`, err);
    }
  }
}

function checkToken(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  return token === process.env.ADMIN_SECRET_TOKEN;
}

export async function GET(req) {
  if (!checkToken(req)) return new Response('Неавторизовано', { status: 401 });
  const data = await fs.readFile(dataFilePath, 'utf8');
  return new Response(data, { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req) {
  if (!checkToken(req)) return new Response('Неавторизовано', { status: 401 });
  const newProduct = await req.json();
  const current = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
  if (!newProduct.id) newProduct.id = Date.now().toString();
  current.push(newProduct);
  await fs.writeFile(dataFilePath, JSON.stringify(current, null, 2));
  return new Response(JSON.stringify(newProduct), { status: 201 });
}

export async function PUT(req) {
  if (!checkToken(req)) return new Response('Неавторизовано', { status: 401 });

  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  if (action === 'reorder') {
    const { products } = await req.json();
    if (!products || !Array.isArray(products)) {
      return new Response('Відсутній або недійсний масив продуктів', { status: 400 });
    }
    await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  const updatedProduct = await req.json();
  const { id } = updatedProduct;
  if (!id) return new Response('Відсутній id', { status: 400 });

  let products = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
  const index = products.findIndex(p => p.id === id);
  if (index === -1) return new Response('Не знайдено', { status: 404 });

  const oldProduct = products[index];
  const oldImg = oldProduct.img;
  const newImg = updatedProduct.img;

  // Якщо зображення змінилося (видалене або замінене) – видаляємо старий файл
  if (oldImg && (newImg === undefined || newImg === "" || newImg !== oldImg)) {
    await deleteImageFile(oldImg);
  }

  // Зливаємо старий і новий об'єкти
  const merged = { ...oldProduct, ...updatedProduct };

  // Якщо offerPrice === null – видаляємо поле
  if (merged.offerPrice === null) delete merged.offerPrice;

  products[index] = merged;
  await fs.writeFile(dataFilePath, JSON.stringify(products, null, 2));
  return new Response(JSON.stringify(products[index]), { status: 200 });
}

export async function DELETE(req) {
  if (!checkToken(req)) return new Response('Неавторизовано', { status: 401 });
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!id) return new Response('Відсутній id', { status: 400 });
  
  let products = JSON.parse(await fs.readFile(dataFilePath, 'utf8'));
  const productToDelete = products.find(p => p.id === id);
  if (!productToDelete) return new Response('Не знайдено', { status: 404 });

  // Видаляємо файл зображення, якщо воно є
  if (productToDelete.img) {
    await deleteImageFile(productToDelete.img);
  }

  const newProducts = products.filter(p => p.id !== id);
  await fs.writeFile(dataFilePath, JSON.stringify(newProducts, null, 2));
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}