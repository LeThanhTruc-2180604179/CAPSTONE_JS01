// main.js - Updated with AdminService integration

import { ProductController } from './controllers/ProductController.js';
import { CartController } from './controllers/CartController.js';

// Khởi tạo controller
const productController = new ProductController('productList', 'productModal');
const cartController = new CartController('cartItems', 'totalPrice', 'cartCount');

// Biến toàn cục
let currentProducts = [];
let currentSlide = 0;
const totalSlides = document.querySelectorAll('#bannerTrack > div').length || 3;

// Khởi động ứng dụng
async function initApp() {
    try {
        await productController.loadProducts();
        currentProducts = productController.productService.products;
        productController.renderProducts(currentProducts);
        cartController.renderCart();
        setupEventListeners();
        initBannerSlider();
        console.log('Khởi tạo thành công!');
    } catch (error) {
        console.error('Lỗi khởi tạo:', error);
        showNotification('Không thể tải dữ liệu sản phẩm!', 'error');
    }
}

// Gắn sự kiện giao diện
function setupEventListeners() {
    const filterSelect = document.getElementById('productFilter');
    if (filterSelect) {
        filterSelect.addEventListener('change', (e) => {
            productController.filterProducts(e.target.value);
        });
    }
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => cartController.checkout());
    }
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.dataset.slide);
            goToSlide(slideIndex);
        });
    });
    window.showProductDetail = (id) => productController.showProductDetail(id);
    window.closeProductModal = () => productController.closeProductModal();
    window.addToCart = (id) => {
        const product = productController.productService.findById(id);
        if (product) cartController.addToCart(product);
    };
    window.increaseQuantity = (id) => { cartController.increaseQuantity(id); renderCartPage(); };
    window.decreaseQuantity = (id) => { cartController.decreaseQuantity(id); renderCartPage(); };
    window.removeFromCart = (id) => { cartController.removeFromCart(id); renderCartPage(); };
}

// Tự động chuyển slide banner
function initBannerSlider() {
    if (totalSlides > 1) {
        setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 5000);
    }
}

// Cập nhật slider
function updateSlider() {
    const track = document.getElementById('bannerTrack');
    const dots = document.querySelectorAll('.dot');
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
        dot.classList.toggle('bg-blue-600', index === currentSlide);
        dot.classList.toggle('bg-gray-400', index !== currentSlide);
    });
}

// Chuyển slide
function goToSlide(slideIndex) {
    if (slideIndex >= 0 && slideIndex < totalSlides) {
        currentSlide = slideIndex;
        updateSlider();
    }
}

// Giao diện user
function showUserView() {
    const userView = document.getElementById('userView');
    const mainContent = document.getElementById('mainContent');
    if (userView) userView.classList.remove('hidden');
    if (mainContent) {
        mainContent.classList.add('hidden');
        mainContent.innerHTML = '';
    }
}

// Lọc và cuộn đến sản phẩm
function filterAndScroll(brand) {
    showUserView();
    productController.filterProducts(brand);
    const productsSection = document.getElementById('productsSection');
    if (productsSection) {
        setTimeout(() => {
            productsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            setTimeout(() => {
                productsSection.style.transform = 'scale(1.01)';
                productsSection.style.transition = 'transform 0.3s ease-in-out';
                setTimeout(() => {
                    productsSection.style.transform = 'scale(1)';
                }, 500);
            }, 800);
        }, 100);
    }
}

// Hiện/ẩn giỏ hàng
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartSidebar && cartOverlay) {
        cartSidebar.classList.toggle('translate-x-full');
        cartOverlay.classList.toggle('hidden');
    }
}
window.toggleCart = toggleCart;

// Thông báo
function showNotification(message, type = 'success') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full flex items-center`;
    notification.innerHTML = `
        <i class="${icons[type]} mr-2"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Hiển thị trang giỏ hàng lớn
function showCartPage() {
    const userView = document.getElementById('userView');
    const mainContent = document.getElementById('mainContent');
    if (userView) userView.classList.add('hidden');
    if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.innerHTML = `
          <div class="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8" id="cartPage">
            <div class="md:col-span-2 bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-bold mb-4 flex items-center justify-between">
                <span>Giỏ hàng</span>
                <span id="cartPageCount" class="text-sm text-gray-500"></span>
              </h2>
              <div id="cartPageItems"></div>
            </div>
            <div class="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
              <div>
                <h3 class="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
                <div class="flex justify-between mb-2">
                  <span>Số sản phẩm</span>
                  <span id="cartPageSummaryCount">0</span>
                </div>
                <div class="flex justify-between mb-2">
                  <span>Phí vận chuyển</span>
                  <span id="cartPageShipping">$0.00</span>
                </div>
                <div class="flex justify-between font-bold text-lg mt-4">
                  <span>Tổng tiền</span>
                  <span id="cartPageTotal">$0</span>
                </div>
              </div>
              <button id="cartPageCheckoutBtn" class="mt-6 w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Thanh toán</button>
            </div>
          </div>
        `;
        renderCartPage();
        const checkoutBtn = document.getElementById('cartPageCheckoutBtn');
        if (checkoutBtn) checkoutBtn.onclick = showCheckoutPage;
    }
}

// Hiển thị trang thanh toán
function showCheckoutPage() {
    const userView = document.getElementById('userView');
    const mainContent = document.getElementById('mainContent');
    if (userView) userView.classList.add('hidden');
    if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.innerHTML = `
          <div id="checkoutPage" class="container mx-auto px-4 py-8">
            <h2 class="text-2xl font-bold mb-6">Xác nhận thanh toán</h2>
            <div id="checkoutOrderInfo" class="mb-6"></div>
            <button id="checkoutConfirmBtn" class="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 text-lg font-semibold">XÁC NHẬN THANH TOÁN</button>
            <button id="checkoutBackBtn" class="ml-4 bg-gray-300 text-gray-800 py-3 px-8 rounded-lg hover:bg-gray-400 text-lg font-semibold">Quay lại giỏ hàng</button>
          </div>
        `;
        renderCheckoutPage();
        document.getElementById('checkoutBackBtn').onclick = showCartPage;
        document.getElementById('checkoutConfirmBtn').onclick = () => {
            cartController.cartService.cart = [];
            cartController.cartService.saveCartToStorage();
            cartController.renderCart();
            showSuccessPage();
        };
    }
}

// Hiển thị trang thành công
function showSuccessPage() {
    const userView = document.getElementById('userView');
    const mainContent = document.getElementById('mainContent');
    if (userView) userView.classList.add('hidden');
    if (mainContent) {
        mainContent.classList.remove('hidden');
        mainContent.innerHTML = `
          <div id="successPage" class="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
            <i class="fas fa-check-circle text-green-500 text-6xl mb-4"></i>
            <h2 class="text-3xl font-bold mb-4">Thanh toán thành công!</h2>
            <p class="text-lg text-gray-600 mb-8">Cảm ơn bạn đã mua hàng tại PhoneStore.</p>
            <button id="successBackBtn" class="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 text-lg font-semibold">Về trang chủ</button>
          </div>
        `;
        document.getElementById('successBackBtn').onclick = showUserView;
    }
}

// Render giỏ hàng lớn
function renderCartPage() {
    const cart = cartController.cartService.cart;
    const itemsContainer = document.getElementById('cartPageItems');
    const count = document.getElementById('cartPageCount');
    const summaryCount = document.getElementById('cartPageSummaryCount');
    const total = document.getElementById('cartPageTotal');
    const shipping = document.getElementById('cartPageShipping');
    const checkoutBtn = document.getElementById('cartPageCheckoutBtn');
    if (!itemsContainer || !count || !summaryCount || !total || !shipping || !checkoutBtn) return;
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<div class="text-center py-8 text-gray-500">Giỏ hàng trống</div>';
        count.textContent = '';
        summaryCount.textContent = '0';
        total.textContent = '$ 0';
        shipping.textContent = '$0.00';
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
        return;
    }
    count.textContent = cart.length + ' Items';
    summaryCount.textContent = cart.length;
    shipping.textContent = '$5.00';
    itemsContainer.innerHTML = cart.map(item => `
        <div class="flex items-center border-b py-4">
            <img src="${item.img}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
            <div class="flex-1">
                <div class="font-semibold text-gray-800">${item.name}</div>
                <div class="text-gray-500 text-sm mb-2">$${item.price}</div>
                <div class="flex items-center space-x-2">
                    <button onclick="decreaseQuantity('${item.id}'); renderCartPage();" class="w-7 h-7 bg-gray-200 rounded hover:bg-gray-300">-</button>
                    <span class="px-2">${item.quantity}</span>
                    <button onclick="increaseQuantity('${item.id}'); renderCartPage();" class="w-7 h-7 bg-gray-200 rounded hover:bg-gray-300">+</button>
                </div>
                <a href="#" onclick="removeFromCart('${item.id}'); renderCartPage(); return false;" class="text-red-500 text-xs mt-2 inline-block">Remove</a>
            </div>
            <div class="w-24 text-right font-bold">$${item.price * item.quantity}</div>
        </div>
    `).join('');
    let sum = cartController.cartService.getTotalPrice();
    let final = sum + 5;
    total.textContent = `$ ${final > 0 ? final.toFixed(2) : 0}`;
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');
}

// Render trang thanh toán
function renderCheckoutPage() {
    const cart = cartController.cartService.cart;
    const container = document.getElementById('checkoutOrderInfo');
    if (!container) return;
    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center py-8 text-gray-500">Không có sản phẩm nào để thanh toán.</div>';
        return;
    }
    container.innerHTML = cart.map(item => `
        <div class="flex items-center border rounded-lg p-4 mb-2">
            <img src="${item.img}" alt="${item.name}" class="w-12 h-12 object-cover rounded mr-4">
            <div class="flex-1">
                <div class="font-semibold text-gray-800">${item.name}</div>
                <div class="text-gray-500 text-sm">Số lượng: ${item.quantity}</div>
            </div>
            <div class="text-blue-600 font-bold">$${item.price * item.quantity}</div>
        </div>
    `).join('') + `<div class="mt-4 text-right text-xl font-bold">Tổng tiền: <span class="text-blue-600">$ ${cartController.cartService.getTotalPrice()}</span></div>`;
}

// Gắn sự kiện chuyển trang
function setupCartPageEvents() {
    document.getElementById('cartPageCheckoutBtn').onclick = showCheckoutPage;
    document.getElementById('checkoutBackBtn').onclick = showCartPage;
    document.getElementById('checkoutConfirmBtn').onclick = () => {
        cartController.cartService.cart = [];
        cartController.cartService.saveCartToStorage();
        cartController.renderCart();
        showSuccessPage();
    };
    document.getElementById('successBackBtn').onclick = showUserView;
}

// Thay đổi nút giỏ hàng trên header để mở trang lớn
const cartBtn = document.querySelector('button[onclick="toggleCart()"]');
if (cartBtn) cartBtn.onclick = showCartPage;

// Gắn sự kiện khi DOM ready
setTimeout(setupCartPageEvents, 500);

document.addEventListener('DOMContentLoaded', initApp);
window.productController = productController;
window.cartController = cartController;

function goToCheckoutPage() {
    const cart = cartController.cartService.cart;
    const sum = cartController.cartService.getTotalPrice();
    const final = sum + 5;
    const main = document.getElementById('mainContent');
    if (!main) return;
    main.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 mt-8">
            <h2 class="text-2xl font-bold mb-6 text-center">Thanh toán</h2>
            <form id="checkoutForm" class="space-y-4">
                <div id="shippingFields">
                    <div>
                        <label class="block mb-1 font-medium">Họ tên</label>
                        <input type="text" name="name" class="w-full border rounded px-3 py-2" required>
                    </div>
                    <div>
                        <label class="block mb-1 font-medium">Số điện thoại</label>
                        <input type="tel" name="phone" class="w-full border rounded px-3 py-2" required>
                    </div>
                    <div>
                        <label class="block mb-1 font-medium">Địa chỉ</label>
                        <input type="text" name="address" class="w-full border rounded px-3 py-2" required>
                    </div>
                </div>
                <div>
                    <label class="block mb-1 font-medium">Hình thức nhận hàng</label>
                    <select name="shippingType" id="shippingTypeSelect" class="w-full border rounded px-3 py-2">
                        <option value="pickup">Nhận tại cửa hàng</option>
                        <option value="delivery">Giao tận nơi</option>
                    </select>
                </div>
                <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Xác nhận thanh toán</button>
            </form>
            <div class="mt-8 border-t pt-6">
                <h3 class="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h3>
                <div class="flex justify-between mb-2">
                    <span>Số sản phẩm</span>
                    <span>${cart.length}</span>
                </div>
                <div class="flex justify-between mb-2">
                    <span>Phí vận chuyển</span>
                    <span>$5.00</span>
                </div>
                <div class="flex justify-between font-bold text-lg mt-4">
                    <span>Tổng tiền</span>
                    <span>$${final > 0 ? final.toFixed(2) : 0}</span>
                </div>
            </div>
        </div>
    `;
    const form = document.getElementById('checkoutForm');
    const shippingFields = document.getElementById('shippingFields');
    const shippingTypeSelect = document.getElementById('shippingTypeSelect');
    if (shippingTypeSelect && shippingFields) {
        function toggleShippingFields() {
            if (shippingTypeSelect.value === 'pickup') {
                shippingFields.style.display = 'none';
                Array.from(shippingFields.querySelectorAll('input')).forEach(input => input.required = false);
            } else {
                shippingFields.style.display = '';
                Array.from(shippingFields.querySelectorAll('input')).forEach(input => input.required = true);
            }
        }
        shippingTypeSelect.addEventListener('change', toggleShippingFields);
        toggleShippingFields();
    }
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            renderSuccessPage();
        };
    }
}

function renderSuccessPage() {
    const main = document.getElementById('mainContent');
    if (!main) return;
    main.innerHTML = `
        <div class="max-w-xl mx-auto bg-white rounded-lg shadow p-8 mt-16 text-center">
            <div class="text-green-500 text-5xl mb-4"><i class="fas fa-check-circle"></i></div>
            <h2 class="text-2xl font-bold mb-2">Đặt hàng thành công!</h2>
            <p class="mb-6">Cảm ơn bạn đã mua hàng. Đơn hàng của bạn sẽ được xử lý trong thời gian sớm nhất.</p>
            <a href="#" onclick="renderCartPage(); return false;" class="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Về trang chủ</a>
        </div>
    `;
}

function setActiveNav(id) {
    ["navHome", "navSamsung", "navApple", "navCart", "navAdmin"].forEach(navId => {
        const el = document.getElementById(navId);
        if (el) el.classList.remove("text-blue-600", "font-bold", "underline");
    });
    const active = document.getElementById(id);
    if (active) active.classList.add("text-blue-600", "font-bold", "underline");
}

function setupHeaderEvents() {
    const navHome = document.getElementById('navHome');
    const navSamsung = document.getElementById('navSamsung');
    const navApple = document.getElementById('navApple');
    const navCart = document.getElementById('navCart');
    const navAdmin = document.getElementById('navAdmin');
    if (navHome) navHome.onclick = function(e) { e.preventDefault(); renderProductList(); setActiveNav('navHome'); };
    if (navSamsung) navSamsung.onclick = function(e) { e.preventDefault(); renderProductList('Samsung'); setActiveNav('navSamsung'); };
    if (navApple) navApple.onclick = function(e) { e.preventDefault(); renderProductList('Apple'); setActiveNav('navApple'); };
    if (navCart) navCart.onclick = function(e) { e.preventDefault(); renderCartPage(); setActiveNav('navCart'); };
    if (navAdmin) navAdmin.onclick = function(e) { e.preventDefault(); renderAdminPage(); setActiveNav('navAdmin'); };
}

// Gọi sau khi DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    setupHeaderEvents();
    setActiveNav('navHome');
    renderProductList();
});

function renderProductList(brand) {
    const main = document.getElementById('mainContent');
    // Banner section
    const bannerHTML = `
      <section class="bg-white mb-10">
        <div class="container mx-auto px-4 py-6">
          <div class="relative">
            <div class="overflow-hidden rounded-2xl shadow-2xl">
              <div class="flex transition-transform duration-500 ease-in-out">
                <div class="w-full flex-shrink-0">
                  <div class="banner-slide slide-1 relative h-96 md:h-[500px] flex items-center">
                    <div class="banner-overlay absolute inset-0 rounded-2xl"></div>
                    <div class="relative z-10 w-full px-8 md:px-16">
                      <div class="max-w-2xl">
                        <div class="glassmorphism inline-block px-4 py-2 rounded-full mb-6">
                          <span class="text-white text-sm font-semibold">✨ NEW ARRIVAL</span>
                        </div>
                        <h2 class="text-4xl md:text-6xl font-bold text-white text-shadow mb-4 animate-float">
                          iPHONE MỚI NHẤT
                        </h2>
                        <p class="text-xl md:text-2xl text-gray-200 mb-8 text-shadow">
                          Trải nghiệm công nghệ tuyệt vời với thiết kế hoàn hảo
                        </p>
                        <button onclick="renderProductList('iphone')" class="glassmorphism text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-gray-800 transition-all duration-300 transform hover:scale-105 animate-pulse-slow">
                          <i class="fas fa-rocket mr-2"></i>
                          Khám phá ngay
                        </button>
                      </div>
                    </div>
                    <div class="absolute top-10 right-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-float"></div>
                    <div class="absolute bottom-10 right-20 w-12 h-12 bg-white bg-opacity-20 rounded-full animate-float" style="animation-delay: -2s;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`;
    // Product section
    const products = window.productController.productService.products.filter(p => !brand || p.type.toLowerCase() === brand.toLowerCase());
    const productSection = `
      <section>
        <div class="max-w-6xl mx-auto px-4">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">SẢN PHẨM</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            ${products.map(window.renderProductCard).join('')}
          </div>
        </div>
      </section>`;
    main.innerHTML = bannerHTML + productSection;
}