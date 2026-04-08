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
