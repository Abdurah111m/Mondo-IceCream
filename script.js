// script.js
const tg = window.Telegram.WebApp;
tg.expand();
tg.MainButton.setParams({ color: '#FF6B6B', text_color: '#ffffff' });

const products = [
    { id: 1, name: "Mondo Classic", price: "15,000", img: "https://via.placeholder.com/150" },
    { id: 2, name: "Mondo Choco", price: "18,000", img: "https://via.placeholder.com/150" },
    { id: 3, name: "Mondo Berry", price: "17,000", img: "https://via.placeholder.com/150" },
    { id: 4, name: "Mondo Nut", price: "20,000", img: "https://via.placeholder.com/150" }
];

const container = document.getElementById('product-container');

products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3 style="font-size: 14px; margin: 10px 0 5px;">${product.name}</h3>
        <p class="price">${product.price} so'm</p>
        <button class="add-btn" onclick="addToCart('${product.name}', '${product.price}')">Savatga</button>
    `;
    container.appendChild(card);
});

function addToCart(name, price) {
    tg.MainButton.setText(`Sotib olish: ${name} (${price} so'm)`);
    tg.MainButton.show();
    
    tg.MainButton.onClick(() => {
        tg.sendData(JSON.stringify({product: name, price: price}));
        tg.close();
    });
}
GROUP_ID = -1003728902443 # O'zingizning guruh ID-ingizni yozing

@dp.message_handler(content_types=['web_app_data'])
async def get_order(message: types.Message):
    data = json.loads(message.web_app_data.data)
    
    # Mini App'dan keladigan ma'lumotlar
    product = data.get('product')
    price = data.get('price')
    location = data.get('location', 'Ko\'rsatilmagan') # Agar lokatsiya yuborilsa
    
    # Guruhga yuboriladigan xabar formati (Cono uslubida)
    report = (
        f"🍦 **YANGI BUYURTMA!**\n\n"
        f"👤 Mijoz: {message.from_user.first_name}\n"
        f"🍨 Mahsulot: {product}\n"
        f"💰 Narxi: {price} so'm\n"
        f"📍 Lokatsiya: {location}\n\n"
        f"Keep it cooooool! ❄️"
    )
    
    await bot.send_message(GROUP_ID, report)
    await message.answer("Rahmat! Buyurtmangiz qabul qilindi. 🍦")
