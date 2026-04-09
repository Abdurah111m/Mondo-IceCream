// 1. Telegram WebApp sozlamalari
const tg = window.Telegram.WebApp;

// Ilovani tayyorlash va kengaytirish
tg.ready();
tg.expand();
tg.setHeaderColor('#fbc2eb'); 

let cart = [];

// 2. Savatga qo'shish funksiyasi
function addToCart(name, price) {
    // Narxni raqam formatiga keltirish
    const numericPrice = typeof price === 'string' 
        ? parseInt(price.replace(/\D/g, '')) 
        : parseInt(price);
    
    cart.push({ name: name, price: numericPrice });
    
    // Pastki tugmani yangilash
    updateMainButton();
    
    // Muvaffaqiyatli tebranish (Haptic Feedback)
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

// 3. Pastki tugmani boshqarish
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

// 4. Buyurtmani yuborish (YAGONA VA XAVFSIZ FUNKSIYA)
tg.MainButton.onClick(() => {
    if (cart.length === 0) return;

    // Tugmada yuklanish animatsiyasini ko'rsatish
    tg.MainButton.showProgress();
    tg.MainButton.disable();

    // Ma'lumotni yuborish jarayoni
    const sendOrder = (lat = null, lon = null) => {
        try {
            // Botga yuboriladigan ma'lumot tuzilmasi
            const data = JSON.stringify({
                products: cart,
                location: { lat, lon },
                total_sum: cart.reduce((s, i) => s + i.price, 0)
            });

            // Signalni yuborish
            tg.sendData(data);
            
            // Signal yetib borishi uchun 1.5 soniya kutib, keyin yopamiz
            setTimeout(() => {
                tg.close();
            }, 1500);
        } catch (e) {
            console.error("Xatolik yuz berdi:", e);
            tg.MainButton.hideProgress();
            tg.MainButton.enable();
            alert("Xatolik: " + e.message);
        }
    };

    // Lokatsiya olish (timeout bilan)
    const geoOptions = { enableHighAccuracy: true, timeout: 3500 };

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => sendOrder(pos.coords.latitude, pos.coords.longitude),
            () => sendOrder(), // Rad etilsa yoki xato bo'lsa lokatsiyasiz ketadi
            geoOptions
        );
    } else {
        sendOrder(); // Geolocation mavjud bo'lmasa
    }
});
