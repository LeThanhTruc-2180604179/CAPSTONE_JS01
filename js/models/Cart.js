export class CartItem {
    constructor(product, quantity = 1) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.img = product.img;
        this.quantity = quantity;
    }

    getTotalPrice() {
        return this.price * this.quantity;
    }
}

export class CartService {
    constructor() {
        this.cart = this.loadCartFromStorage();
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const cartItem = new CartItem(product, 1);
            this.cart.push(cartItem);
        }
        this.saveCartToStorage();
    }

    increaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
            this.saveCartToStorage();
        }
    }

    decreaseQuantity(productId) {
        const item = this.cart.find(item => item.id === productId);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            this.saveCartToStorage();
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCartToStorage();
    }

    getTotalPrice() {
        return this.cart.reduce((total, item) => total + item.getTotalPrice(), 0);
    }

    saveCartToStorage() {
        const cartData = this.cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            img: item.img,
            quantity: item.quantity
        }));
        localStorage.setItem('shoppingCart', JSON.stringify(cartData));
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('shoppingCart');
        if (savedCart) {
            const cartData = JSON.parse(savedCart);
            return cartData.map(item => {
                const cartItem = new CartItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    img: item.img
                }, item.quantity);
                return cartItem;
            });
        }
        return [];
    }
} 