const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();
tg.setHeaderColor('#fbc2eb');

let cart = [];

function addToCart(name, price) {
    const numericPrice = typeof price === 'string' ? parseInt(price.replace(/\D/g, '')) : parseInt(price);
    cart.push({ name: name, price: numericPrice });
    updateMainButton();
    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
}

function updateMainButton() {
    if (cart.length > 0) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        tg.MainButton.setParams({
            text: `TASDIQLASH: ${total.toLocaleString()} so'm`,
            color: '#ec4899',
            is_active: true,
            is_visible: true
        });
    } else {
        tg.MainButton.hide();
    }
}

// ASOSIY FUNKSIYA - FAQAT BITTA BO'LISHI SHART
tg.MainButton.onClick(() => {
    tg.MainButton.showProgress();
    tg.MainButton.disable();

    const data = JSON.stringify({
        products: cart,
        total_sum: cart.reduce((s, i) => s + i.price, 0)
    });

    try {
        // Signalni yuborish
        tg.sendData(data);
        alert("Signal yuborildi! CMD-ni tekshiring.");
        
        setTimeout(() => {
            tg.close();
        }, 2000);
    } catch (e) {
        alert("Xatolik: " + e.message);
        tg.MainButton.hideProgress();
        tg.MainButton.enable();
    }
});
