// 1. Telegram WebApp sozlamalari
const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];

// 2. Savatga qo'shish funksiyasi
function addToCart(name, price) {
    // Narxdan faqat raqamlarni olib, songa aylantiradi
    const numericPrice = parseInt(price.toString().replace(/\D/g, ''));
    
    cart.push({ name: name, price: numericPrice });
    
    // Tugmani yangilash
    updateMainButton();
    
    // Vibratsiya effekti
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// 3. Pastki tugmani yangilash
function updateMainButton() {
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        tg.MainButton.setText(`TASDIQLASH: ${total.toLocaleString()} so'm`);
        tg.MainButton.setParams({
            color: '#ec4899', // Mondo pushti rangi
            text_color: '#ffffff'
        });
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// 4. Buyurtmani yuborish (Yagona va tartibli onClick)
tg.MainButton.onClick(() => {
    if (cart.length === 0) return;

    // Lokatsiya olish uchun sozlamalar
    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            // Lokatsiya bilan yuborish
            const dataToSend = JSON.stringify({
                products: cart,
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            });
            tg.sendData(dataToSend);
            
            // Signal ketishi uchun 1 soniya kutamiz
            setTimeout(() => { tg.close(); }, 1000);
        },
        (err) => {
            // Lokatsiyasiz yuborish
            const dataToSend = JSON.stringify({
                products: cart,
                lat: null,
                lon: null
            });
            tg.sendData(dataToSend);
            
            setTimeout(() => { tg.close(); }, 1000);
        },
        geoOptions
    );
});
