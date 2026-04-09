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
function sendOrder(name, price) {
    // Lokatsiyani olish (ixtiyoriy)
    navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const locationLink = `https://www.google.com/maps?q=${lat},${lon}`;

        const orderData = {
            product: name,
            price: price,
            location: locationLink
        };

        tg.sendData(JSON.stringify(orderData));
    });
}
tg.MainButton.onClick(() => {
    tg.sendData(JSON.stringify({product: name, price: price})); // Ma'lumot yuborish
    tg.close(); // Ilovani yopish (Aynan shu buyruq ilovadan chiqarib yuboradi)
});
let cart = []; // Savatni saqlash uchun massiv

function addToCart(name, price) {
    cart.push({ name, price });
    updateMainButton();
}

function updateMainButton() {
    const tg = window.Telegram.WebApp;
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        tg.MainButton.setText(`BUYURTMA BERISH: ${total.toLocaleString()} so'm`);
        tg.MainButton.show();
        // Cono Guideline bo'yicha rang: Living Coral (#ff6d70)
        tg.MainButton.setParams({ color: '#ff6d70', text_color: '#ffffff' }); 
    }
}

// Telegram tugmasi bosilganda
window.Telegram.WebApp.MainButton.onClick(() => {
    const tg = window.Telegram.WebApp;
    
    // Lokatsiyani so'rash
    navigator.geolocation.getCurrentPosition((pos) => {
        const orderData = {
            products: cart,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
        };
        tg.sendData(JSON.stringify(orderData)); // Ma'lumotni Python botga yuboradi
    }, (err) => {
        // Agar lokatsiyaga ruxsat bermasa, faqat mahsulotlarni yuboradi
        tg.sendData(JSON.stringify({ products: cart, lat: null, lon: null }));
    });
});
