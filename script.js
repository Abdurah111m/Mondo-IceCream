const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];

// Savatga qo'shish funksiyasi
function addToCart(name, price) {
    // Narxni son ko'rinishiga keltirish (agar matn bo'lsa)
    const numericPrice = parseInt(price.toString().replace(/\D/g, ''));
    
    cart.push({ name: name, price: numericPrice });
    
    // Tugmani ko'rsatish va matnini yangilash
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    tg.MainButton.setText(`TASDIQLASH: ${total.toLocaleString()} so'm`);
    tg.MainButton.show();
    
    // Cono brend rangi: Living Coral
    tg.MainButton.setParams({ color: '#ff6d70' });
}
// script.js ichidagi addToCart funksiyasini mana bunga almashtiring
function updateCart(name, price, action) {
    if (action === 'plus') {
        cart.push({ name, price: parseInt(price) });
    } else if (action === 'minus') {
        const index = cart.findIndex(item => item.name === name);
        if (index > -1) cart.splice(index, 1);
    }
    updateMainButton();
}
// ASOSIY TUGMA BOSILGANDA
tg.MainButton.onClick(() => {
    if (cart.length > 0) {
        // Ma'lumotni JSON qilib yuboramiz
        const dataToSend = JSON.stringify({
            products: cart,
            total: cart.reduce((sum, item) => sum + item.price, 0)
        });
        
        tg.sendData(dataToSend); // Ilova shu yerda yopilishi shart!
    } else {
        alert("Savat bo'sh! Muzqaymoq tanlang 🍦");
    }
});

// Savatga qo'shish funksiyasi
function addToCart(name, price) {
    cart.push({ name, price });
    updateMainButton();
}

// Asosiy tugmani yangilash
function updateMainButton() {
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        tg.MainButton.setText(`BUYURTMA BERISH: ${total.toLocaleString()} so'm`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

tg.MainButton.onClick(() => {
    const data = JSON.stringify(cart); // Savatni JSON ga aylantirish
    tg.sendData(data); // MA'LUMOTNI YUBORISH (Eng asosiysi shu!)
});

const tg = window.Telegram.WebApp;
tg.expand();

let cart = [];

// Savatni yangilash
function addToCart(name, price) {
    cart.push({ name, price: parseInt(price) });
    updateMainButton();
}

// Savatni kamaytirish (ixtiyoriy foydalanish uchun)
function removeFromCart(name) {
    const index = cart.findIndex(item => item.name === name);
    if (index > -1) {
        cart.splice(index, 1);
    }
    updateMainButton();
}

function updateMainButton() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    if (total > 0) {
        tg.MainButton.setText(`BUYURTMA: ${total.toLocaleString()} so'm`);
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

// TASDIQLASH TUGMASI
tg.MainButton.onClick(() => {
    // Lokatsiyani olish va yuborish
    navigator.geolocation.getCurrentPosition((pos) => {
        const data = {
            products: cart,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
        };
        tg.sendData(JSON.stringify(data));
        tg.close(); // Ilova yopilishi shart!
    }, (err) => {
        // Lokatsiya berilmasa ham yuborish
        tg.sendData(JSON.stringify({ products: cart, lat: null, lon: null }));
        tg.close();
    });
});
// Telegram MainButton bosilganda ma'lumot yuborish
tg.MainButton.onClick(() => {
    // Lokatsiyani olishga harakat qilamiz
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const orderData = {
                products: cart,
                lat: position.coords.latitude,
                lon: position.coords.longitude
            };
            tg.sendData(JSON.stringify(orderData));
        },
        (error) => {
            // Lokatsiyaga ruxsat bermasa ham buyurtmani yuboramiz
            const orderData = {
                products: cart,
                lat: null,
                lon: null
            };
            tg.sendData(JSON.stringify(orderData));
        },
        { timeout: 5000 } // 5 soniya kutish
    );
});
