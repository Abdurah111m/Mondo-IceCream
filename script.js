// 1. Telegram WebApp asosiy obyektini olish
const tg = window.Telegram.WebApp;
tg.expand(); // Ilovani to'liq ochish

// Savat massivi
let cart = [];

// 2. Savatga qo'shish funksiyasi (HTML tugmalari buni chaqiradi)
function addToCart(name, price) {
    // Savatga mahsulotni qo'shish
    cart.push({ name: name, price: parseInt(price) });
    
    // Savat yangilangani uchun asosiy tugmani yangilaymiz
    updateMainButton();
    
    // Vizual effekt (Haptic feedback) - telefon titrashi (agar qo'llab-quvvatlasa)
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// 3. Asosiy tugmani yangilash
function updateMainButton() {
    if (cart.length > 0) {
        // Jami summani hisoblash
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        // Telegram pastki tugmasini sozlash
        tg.MainButton.setText(`TASDIQLASH: ${total.toLocaleString()} so'm`);
        tg.MainButton.setParams({
            color: '#ec4899', // Pink-600 (Tailwind rangiga mos)
            text_color: '#ffffff'
        });
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// 4. Buyurtmani yuborish (Asosiy tugma bosilganda)
tg.MainButton.onClick(() => {
    if (cart.length === 0) return;

    // Lokatsiya so'rash va ma'lumotni Python botga yuborish
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const data = {
                products: cart,
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            };
            tg.sendData(JSON.stringify(data)); // Python'ga signal ketdi
            tg.close(); // Ilova yopiladi
        },
        (err) => {
            // Lokatsiya rad etilsa ham buyurtma ketadi
            const data = {
                products: cart,
                lat: null,
                lon: null
            };
            tg.sendData(JSON.stringify(data));
            tg.close();
        },
        { timeout: 5000 }
    );
});
