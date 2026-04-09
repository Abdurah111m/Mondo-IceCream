// 1. Telegram WebApp sozlamalari
const tg = window.Telegram.WebApp;
tg.expand();

// Savat massivi (Faqat bir marta e'lon qilinadi)
let cart = [];

// 2. Savatga qo'shish funksiyasi
function addToCart(name, price) {
    // Narxni songa aylantirish
    const numericPrice = parseInt(price.toString().replace(/\D/g, ''));
    
    // Savatga ob'ekt qo'shish
    cart.push({ name: name, price: numericPrice });
    
    // Tugmani yangilash
    updateMainButton();
}

// 3. Asosiy tugmani boshqarish
function updateMainButton() {
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        tg.MainButton.setText(`BUYURTMA: ${total.toLocaleString()} so'm`);
        tg.MainButton.setParams({
            color: '#ff6d70', // Cono Living Coral
            text_color: '#ffffff'
        });
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// 4. Buyurtma berish (Tugma bosilganda)
tg.MainButton.onClick(() => {
    if (cart.length === 0) return;

    // Lokatsiya olish parametrlari
    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const result = {
                products: cart,
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            };
            tg.sendData(JSON.stringify(result));
            tg.close();
        },
        (err) => {
            // Lokatsiya olinmasa ham ma'lumotni yuborish
            const result = {
                products: cart,
                lat: null,
                lon: null
            };
            tg.sendData(JSON.stringify(result));
            tg.close();
        },
        geoOptions
    );
});
