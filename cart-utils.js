// Add to cart function
export function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.qty = (existingItem.qty || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            qty: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    return cart;
}

// Calculate total items in cart
export function cartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.reduce((total, item) => total + (item.qty || 1), 0);
}