const tg = window.Telegram.WebApp;
tg.expand();

// Cono brend rangi: Living Coral
tg.MainButton.setParams({ 
    color: '#ff6d70', 
    text_color: '#ffffff' 
});

let cart = [];

// 1. Savatga qo'shish va yangilash funksiyasi
function addToCart(name, price) {
    // Narxdan probel va belgilarni olib tashlab, songa aylantiramiz
    const numericPrice = parseInt(price.toString().replace(/\D/g, ''));
    
    cart.push({ name: name, price: numericPrice });
    updateMainButton();
}

// 2. Savatdan mahsulotni kamaytirish (kerak bo'lsa foydalanish uchun)
function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index > -1) {
        cart.splice(index, 1);
    }
    updateMainButton();
}

// 3. Asosiy tugma ko'rinishini yangilash
function updateMainButton() {
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        tg.MainButton.setText(`BUYURTMA: ${total.toLocaleString()} so'm`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// 4. TASDIQLASH TUGMASI BOSILGANDA (Lokatsiya + Ma'lumot yuborish)
tg.MainButton.onClick(() => {
    if (cart.length === 0) return;

    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    // Lokatsiyani so'raymiz
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const data = {
                products: cart,
                lat: pos.coords.latitude,
                lon: pos.coords.longitude
            };
            tg.sendData(JSON.stringify(data));
            tg.close(); // Ilova yopiladi va Python'ga DEBUG keladi
        },
        (err) => {
            console.log("Lokatsiya olinmadi:", err);
            // Lokatsiya berilmasa ham ma'lumotni yuboramiz
            const data = {
                products: cart,
                lat: null,
                lon: null
            };
            tg.sendData(JSON.stringify(data));
            tg.close();
        }, 
        options
    );
});
