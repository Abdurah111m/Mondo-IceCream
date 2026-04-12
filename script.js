// 1. Telegram WebApp sozlamalari
const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();
tg.setHeaderColor('#fbc2eb'); 

let cart = [];

// 2. Savatga qo'shish funksiyasi
function addToCart(name, price) {
    const numericPrice = typeof price === 'string' 
        ? parseInt(price.replace(/\D/g, '')) 
        : parseInt(price);
    
    cart.push({ name: name, price: numericPrice });
    updateMainButton();
    
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

// 3. Pastki tugmani yangilash
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

// 4. Buyurtmani yuborish (DIAGNOSTIKA BILAN)
tg.MainButton.onClick(() => {
    tg.MainButton.showProgress();
    tg.MainButton.disable();

    console.log("Bosildi! Buyurtma tayyorlanmoqda...");

    // Ma'lumotni yuborish ichki funksiyasi
    const sendOrder = (lat = null, lon = null) => {
        try {
            const data = JSON.stringify({
                products: cart,
                location: { lat, lon },
                total_sum: cart.reduce((s, i) => s + i.price, 0)
            });

            console.log("Yuborilayotgan JSON:", data);

            // Signalni yuborish
            tg.sendData(data);
            
            console.log("✅ tg.sendData ishlatildi!");

            // DIQQAT: tg.close() olib tashlandi, xatoni konsolda ko'rish uchun!
            setTimeout(() => {
                tg.MainButton.hideProgress();
                tg.MainButton.enable();
                alert("Tekshiruv tugadi. Konsolga qarang!");
            }, 3000);

        } catch (e) {
            console.error("❌ Xatolik yuz berdi:", e);
            tg.MainButton.hideProgress();
            tg.MainButton.enable();
        }
    };

    // Lokatsiya olish (timeout bilan)
    const geoOptions = { enableHighAccuracy: true, timeout: 4000 };

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => sendOrder(pos.coords.latitude, pos.coords.longitude),
            () => sendOrder(), 
            geoOptions
        );
    } else {
        sendOrder(); 
    }
});
