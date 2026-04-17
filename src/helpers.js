import { nanoid } from "nanoid";

//fetcher
export const fetcher = (url) => fetch(url).then((r) => r.json());

export const getFormValidations = () => {
  return {
    name: {
      required: {
        value: true,
        message: "Ім'я та прізвище обов'язкові",
      },
      maxLength: {
        value: 30,
        message: "Максимальна довжина 30 символів",
      },
      minLength: {
        value: 5,
        message: "Мінімальна довжина 5 символів",
      },
      pattern: {
        value: /^[A-Za-zА-Яа-яІіЇїЄєҐґ']{2,}(?:\s+[A-Za-zА-Яа-яІіЇїЄєҐґ']{2,})+$/,
        message: "Введіть ім'я та прізвище через пробіл",
      },
    },
    phone: {
      required: {
        value: true,
        message: "Номер телефону обов'язковий",
      },
      maxLength: {
        value: 13,
        message: "Максимальна довжина 13 символів",
      },
      minLength: {
        value: 13,
        message: "Мінімальна довжина 13 символів",
      },
      phone: {
        required: { value: true, message: "Номер телефону обов'язковий" },
        pattern: {
          value: /^\+380\d{9}$/,
          message: "Номер має бути у форматі +38XXXXXXXXXX",
        },
      },
    },
    kiev: {
      required: {
        value: true,
        message: "Адреса у Києві обов'язкова",
      },
      maxLength: {
        value: 100,
        message: "Максимальна довжина 100 символів",
      },
      minLength: {
        value: 4,
        message: "Мінімальна довжина 4 символ",
      },
      pattern: {
        value: /^[0-9a-zA-ZА-Яа-яІіЇїЄєҐґ.,' ]{4,100}$/,
        message: "Неправильна адреса у Києві",
      },
    },
    address: {
      required: {
        value: true,
        message: "Нова Пошта обов'язкова",
      },
      maxLength: {
        value: 20,
        message: "Максимальна довжина 20 символів",
      },
      minLength: {
        value: 1,
        message: "Мінімальна довжина 1 символ",
      },
      pattern: {
        value: /^[0-9a-zA-ZА-Яа-яІіЇїЄє ]{1,20}$/,
        message: "Неправильний склад Нової Пошти",
      },
    },
    city: {
      required: {
        value: true,
        message: "Місто або селище обов'язкове",
      },
      maxLength: {
        value: 20,
        message: "Максимальна довжина 20 символів",
      },
      minLength: {
        value: 3,
        message: "Мінімальна довжина 3 символи",
      },
      pattern: {
        value: /^[A-Za-zА-Яа-яІіЇїЄєҐґ.,' ]{3,20}$/,
        message: "Неправильне місто або селище",
      },
    },
    schedule: {
      // required: {
      //   value: true,
      //   message: "Schedule is required",
      // },
      maxLength: {
        value: 20,
        message: "Максимальна довжина 20 символів",
      },
      pattern: {
        value: /^[0-9a-zA-ZА-Яа-яІіЇїЄєҐґ.,' ]{0,20}$/,
        message: "Неправильна область, район",
      },
    },
    comment: {
      maxLength: {
        value: 30,
        message: "Максимальна довжина 30 символів",
      },
    },
  };
};


//wsp url creator
export function getWspUrl(orderData) {
  const N = process.env.NEXT_PUBLIC_MY_PHONE_NUMBER;
  const ID = nanoid(8);
  const { cartItems, subTotal, withDelivery, shippingCost, packingCost, total, formData } = orderData;
  const { name, phone, kiev, address, city, schedule, comment } = formData;

  // Поточна дата у форматі "09.04.2025, 14:10"
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes}`;

  let cartListforUrl = "";
  Object.values(cartItems).forEach((item) => {
    const itemTotal = (item.offerPrice ? item.offerPrice * item.qty : item.price * item.qty).toFixed(2);
    cartListforUrl += `%0A%0A - *(${item.qty})* ${item.title} --> _*${itemTotal} грн.*_`;
  });

  let deliveryInfo = "";
  if (!withDelivery) {
    // Доставка по Києву
    deliveryInfo = `%0A%0A%2AМісто%3A%2A%20Київ%0A%0A%2AАдреса%3A%2A%20${kiev}`;
  } else {
    // Доставка Новою Поштою
    deliveryInfo = `%0A%0A%2AНова Пошта%3A%2A%20${address} склад%0A%0A%2AМісто%3A%2A%20${city}%0A%0A%2AОбласть, район%3A%2A%20${schedule}`;
  }

  const packingText = withDelivery ? `%0A%0A%2AПакування%3A%2A%20${packingCost} грн.` : "";
  const commentText = comment ? `%0A%0A%2AКоментар%3A%2A%20${comment}` : "";

  const WSP_URL = `https://web.whatsapp.com/send/?phone=${N}&text=%2AДата%3A%2A%20${formattedDate}%0A%0A%2AЗамовлення%3A%2A%20${ID}%0A%0A%2AКлієнт%3A%2A%20${name}%0A%0A%2AТелефон%3A%2A%20${phone}${deliveryInfo}${commentText}%0A%0A%2AСписок замовлення%3A%2A${cartListforUrl}%0A%0A%2AПідсумок%3A%2A%20${subTotal} грн.%0A%0A%2AВартість доставки%3A%2A%20від ${shippingCost} грн.${packingText}%0A%0A%2AЗагальна сума%3A%2A%20${total} грн.`;

  return WSP_URL;
}


// send order in telegram
export async function sendTelegramOrder(orderData) {
  const BOT_TOKEN = process.env.NEXT_PUBLIC_MY_TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.NEXT_PUBLIC_MY_TELEGRAM_CHAT_ID;
  const ID = nanoid(8);
  const { cartItems, subTotal, withDelivery, shippingCost, packingCost, total, formData } = orderData;
  const { name, phone, kiev, address, city, schedule, comment } = formData;

  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const formattedDate = `${day}.${month}.${year}, ${hours}:${minutes}`;

  let cartList = '';
  Object.values(cartItems).forEach((item) => {
    const itemTotal = (item.offerPrice ? item.offerPrice * item.qty : item.price * item.qty).toFixed(0);
    cartList += `\n- ${item.title} --> ${itemTotal} грн. *(${item.qty} шт.)*`;
  });

  const message = `
📅 *Дата:* ${formattedDate}
🛒 *Замовлення:* ${ID}
👤 *Клієнт:* ${name}
📞 *Телефон:* ${phone}
${!withDelivery ? `🏙 *Місто:* Київ\n🏠 *Адреса:* ${kiev}` : ''}
${withDelivery ? `🏠 *Нова Пошта:* ${address} склад\n🏙 *Місто:* ${city}\n⚓ *Область, район:* ${schedule}` : ''}
${comment ? `💬 *Коментар:* ${comment}` : ''}

🧾 *Список замовлення:* ${cartList}

💰 *Підсумок:* ${subTotal} грн.
${withDelivery ? `📦 *Пакування:* ${packingCost} грн.\n` : ''}🚚 *Вартість доставки:* від ${shippingCost} грн.
💵 *Загальна сума:* ${total} грн.
  `;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    })
  });
}
