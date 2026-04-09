const tg = window.Telegram.WebApp;
tg.expand();

// Cono Guideline: Living Coral rangini asosiy tugmaga o'rnatamiz 
tg.MainButton.setParams({ 
    color: '#ff6d70', 
    text_color: '#ffffff' 
});

// Mahsulotlar ro'yxati (Narxlar son formatida bo'lishi shart)
const products = [
    { id: 1, name: "Mondo Classic", price: 15000, img: "https://via.placeholder.com/150" },
    { id: 2, name: "Mondo Choco", price: 18000, img: "https://via.placeholder.com/150" },
    { id: 3, name: "Mondo Berry", price: 17000, img: "https://via.placeholder.com/150" },
    { id: 4, name: "Mondo Nut", price: 20000, img: "https://via.placeholder.com/150" }
];

let cart = [];
const container = document.getElementById('product-container');

// Kartochkalarni generatsiya qilish
products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${product.img}" alt="${product.name}">
        <h3 style="font-family: 'Geologica', sans-serif; font-size: 14px; margin: 10px 0 5px;">${product.name}</h3>
        <p class="price" style="color: #c8102e; font-weight: bold;">${product.price.toLocaleString()} so'm</p>
        <button class="add-btn" 
                style="background-color: #ff6d70; color: white; border: none; padding: 8px; border-radius: 10px; cursor: pointer;"
                onclick="addToCart('${product.name}', ${product.price})">
            Savatga 🍦
        </button>
    `;
    container.appendChild(card);
});

// Savatga qo'shish funksiyasi
function addToCart(name, price) {
    cart.push({ name, price });
    updateMainButton();
}

// Asosiy tugmani yangilash
function updateMainButton() {
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        tg.MainButton.setText(`BUYURTMA BERISH: ${total.toLocaleString()} so'm`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// Telegram MainButton bosilganda ma'lumot yuborish
tg.MainButton.onClick(() => {
    // Lokatsiyani olishga harakat qilamiz
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const orderData = {
                products: cart,
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            tg.sendData(JSON.stringify(orderData));
        },
        (error) => {
            // Lokatsiyaga ruxsat bermasa ham buyurtmani yuboramiz
            const orderData = {
                products: cart,
                lat: null,
                lon: null
            };
            tg.sendData(JSON.stringify(orderData));
        },
        { timeout: 5000 } // 5 soniya kutish
    );
});
