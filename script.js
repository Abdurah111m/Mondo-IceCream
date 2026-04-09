// 1. Telegram WebApp sozlamalari
const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];

// 2. Savatga qo'shish funksiyasi
function addToCart(name, price) {
    // Narxni raqamga aylantirish (probel yoki so'm yozuvlarini tozalaydi)
    const numericPrice = parseInt(price.toString().replace(/\D/g, ''));
    
    cart.push({ name: name, price: numericPrice });
    
    // Tugmani yangilash
    updateMainButton();
    
    // Vibratsiya (Haptic feedback)
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
            color: '#ec4899', // Mondo brendiga mos pushti rang
            text_color: '#ffffff'
        });
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// 4. Buyurtmani yuborish (YAGONA VA TOZA FUNKSIYA)
tg.MainButton.onClick(() => {
    if (cart.length === 0) return;

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    // Lokatsiyani olishga harakat qilamiz
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const dataToSend = JSON.stringify({
                products: cart,
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            });
            
            tg.sendData(dataToSend); // Ma'lumotni botga uzatish
            
            // Muhim: Telegram signalni qabul qilishi uchun 600ms kutamiz
            setTimeout(() => {
                tg.close();
            }, 600);
        },
        (err) => {
            // Lokatsiya olinmasa ham buyurtmani yuboramiz
            const dataToSend = JSON.stringify({
                products: cart,
                lat: null,
                lon: null
            });
            
            tg.sendData(dataToSend);
            
            setTimeout(() => {
                tg.close();
            }, 600);
        },
        options
    );
});
