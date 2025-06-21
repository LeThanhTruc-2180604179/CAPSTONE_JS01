import { CartService } from '../models/Cart.js';
import { renderCartItem } from '../views/CartView.js';

export class CartController {
    constructor(cartItemsContainerId, totalPriceElementId, cartCountElementId) {
        this.cartService = new CartService();
        this.cartItemsContainer = document.getElementById(cartItemsContainerId);
        this.totalPriceElement = document.getElementById(totalPriceElementId);
        this.cartCountElement = document.getElementById(cartCountElementId);
    }

    // Hiển thị giỏ hàng
    renderCart() {
        const cart = this.cartService.cart;
        // Đếm số lượng sản phẩm
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        if (this.cartCountElement) {
            if (itemCount > 0) {
                this.cartCountElement.textContent = itemCount;
                this.cartCountElement.classList.remove('hidden');
            } else {
                this.cartCountElement.classList.add('hidden');
            }
        }
        if (this.cartItemsContainer) {
            if (cart.length === 0) {
                this.cartItemsContainer.innerHTML = `<div class="text-center py-8"><i class="fas fa-shopping-cart text-4xl text-gray-300 mb-4"></i><p class="text-gray-500">Giỏ hàng trống</p><p class="text-sm text-gray-400">Hãy thêm sản phẩm vào giỏ hàng</p></div>`;
            } else {
                this.cartItemsContainer.innerHTML = cart.map(renderCartItem).join('');
            }
        }
        if (this.totalPriceElement) {
            this.totalPriceElement.textContent = `$ ${this.cartService.getTotalPrice()}`;
        }
    }

    // Thêm sản phẩm vào giỏ
    addToCart(product) {
        this.cartService.addToCart(product);
        this.renderCart();
    }

    // Tăng số lượng
    increaseQuantity(productId) {
        this.cartService.increaseQuantity(productId);
        this.renderCart();
    }

    // Giảm số lượng
    decreaseQuantity(productId) {
        this.cartService.decreaseQuantity(productId);
        this.renderCart();
    }

    // Xóa sản phẩm khỏi giỏ
    removeFromCart(productId) {
        this.cartService.removeFromCart(productId);
        this.renderCart();
    }

    // Thanh toán
    checkout() {
        if (this.cartService.cart.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }
        const total = this.cartService.getTotalPrice();
        if (confirm(`Xác nhận thanh toán ${total} $?`)) {
            this.cartService.cart = [];
            this.cartService.saveCartToStorage();
            this.renderCart();
            alert('Thanh toán thành công!');
        }
    }
}