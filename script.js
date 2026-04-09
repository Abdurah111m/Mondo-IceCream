const tg = window.Telegram.WebApp;

// Ilovani tayyorlash
tg.ready();
tg.expand();
tg.setHeaderColor('#fbc2eb'); 

let cart = [];

// Savatga qo'shish funksiyasi
function addToCart(name, price) {
    const numericPrice = typeof price === 'string' 
        ? parseInt(price.replace(/\D/g, '')) 
        : price;
    
    cart.push({ name: name, price: numericPrice });
    
    updateMainButton();
    
    if (tg.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }
}

// Pastki tugmani boshqarish
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

// Buyurtmani yakunlash
tg.MainButton.onClick(() => {
    if (cart.length === 0) return;

    tg.MainButton.showProgress();
    tg.MainButton.disable();

    const sendOrder = (lat = null, lon = null) => {
        try {
            const data = JSON.stringify({
                products: cart,
                location: { lat, lon },
                total_price: cart.reduce((s, i) => s + i.price, 0)
            });

            tg.sendData(data);
            
            // Ma'lumot uzatilgach yopish
            setTimeout(() => {
                tg.close();
            }, 700);
        } catch (e) {
            console.error("Xatolik:", e);
            tg.MainButton.hideProgress();
            tg.MainButton.enable();
        }
    };

    const geoOptions = { enableHighAccuracy: true, timeout: 4000 };

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => sendOrder(pos.coords.latitude, pos.coords.longitude),
            () => sendOrder(), // Rad etilsa lokatsiyasiz ketadi
            geoOptions
        );
    } else {
        sendOrder();
    }
});
