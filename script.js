// 1. Telegram WebApp asosiy obyektini sozlash
const tg = window.Telegram.WebApp;
tg.expand();

// Asosiy ranglarni brendga moslash (ixtiyoriy)
tg.setHeaderColor('#fbc2eb'); 

let cart = [];

// 2. Savatga qo'shish funksiyasi
function addToCart(name, price) {
    // Narxni tozalash (faqat raqamlar)
    const numericPrice = typeof price === 'string' 
        ? parseInt(price.replace(/\D/g, '')) 
        : price;
    
    cart.push({ name: name, price: numericPrice });
    
    updateMainButton();
    
    // Haptic Feedback (Muvaffaqiyatli qo'shilganda yengil tebranish)
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

// 3. Pastki tugmani yangilash (UX optimizatsiyasi bilan)
function updateMainButton() {
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        
        tg.MainButton.setParams({
            text: `TASDIQLASH: ${total.toLocaleString()} so'm`,
            color: '#ec4899', 
            text_color: '#ffffff',
            is_active: true,
            is_visible: true
        });
    } else {
        tg.MainButton.hide();
    }
}

// 4. Buyurtmani yuborish (MUKAMMAL VARIANT)
tg.MainButton.onClick(async () => {
    if (cart.length === 0) return;

    // UX: Tugmani yuklanish holatiga o'tkazamiz (Loading)
    tg.MainButton.showProgress();
    tg.MainButton.disable();

    // Ma'lumotni yuborish funksiyasi (Takrorlanishni kamaytirish uchun)
    const sendOrder = (lat = null, lon = null) => {
        const data = JSON.stringify({
            products: cart,
            location: { lat, lon },
            order_date: new Date().toISOString()
        });

        tg.sendData(data);
        
        // Signal ketishi uchun biroz kutib, keyin yopamiz
        setTimeout(() => {
            tg.close();
        }, 800);
    };

    // Lokatsiya olish sozlamalari
    const geoOptions = {
        enableHighAccuracy: true,
        timeout: 4000, // 4 soniya kutadi, keyin xatolikka o'tadi
        maximumAge: 0
    };

    // Lokatsiyani so'rash
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => sendOrder(pos.coords.latitude, pos.coords.longitude),
            (err) => sendOrder(), // Xatolik bo'lsa (rad etsa), lokatsiyasiz yuboradi
            geoOptions
        );
    } else {
        sendOrder(); // Geolocation qo'llab-quvvatlanmasa
    }
});
