// main.js - Updated with AdminService integration

import {ProductController} from "./controllers/ProductController.js";
import {CartController} from "./controllers/CartController.js";
import {AdminController} from "./controllers/AdminController.js";
import { renderCartItem } from "./views/CartView.js";
import { renderProductCard } from "./views/ProductView.js";
import { 
    validateProductForm, 
    displayValidationErrors,
    clearValidationErrors
} from "./utils/validation.js";

// Khởi tạo controller
const productController = new ProductController("productList", "productModal");
const cartController = new CartController(
  "cartItems",
  "totalPrice",
  "cartCount"
);
const adminController = new AdminController("adminProductList");

// Biến toàn cục
let currentProducts = [];
let currentSlide = 0;
const totalSlides = document.querySelectorAll("#bannerTrack > div").length || 3;

// Khởi động ứng dụng
async function initApp() {
  try {
    await productController.loadProducts();
    currentProducts = productController.productService.products;
    productController.renderProducts(currentProducts);
    cartController.renderCart();
    setupEventListeners();
    initBannerSlider();
    await adminController.renderAdminProductList();
    console.log("Khởi tạo thành công!");
  } catch (error) {
    console.error("Lỗi khởi tạo:", error);
    showNotification("Không thể tải dữ liệu sản phẩm!", "error");
  }
}

// Gắn sự kiện giao diện
function setupEventListeners() {
  const filterSelect = document.getElementById("productFilter");
  if (filterSelect) {
    filterSelect.addEventListener("change", (e) => {
      productController.filterProducts(e.target.value);
    });
  }
  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => cartController.checkout());
  }
  document.querySelectorAll(".dot").forEach((dot) => {
    dot.addEventListener("click", (e) => {
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
  window.increaseQuantity = (id) => {
    cartController.increaseQuantity(id);
    renderCartPage();
  };
  window.decreaseQuantity = (id) => {
    cartController.decreaseQuantity(id);
    renderCartPage();
  };
  window.removeFromCart = (id) => {
    cartController.removeFromCart(id);
    renderCartPage();
  };
  window.editProduct = (id) => {
    adminController.editProduct(id);
    const submitBtn = document.querySelector(
      '#addProductForm button[type="submit"]'
    );
    const cancelBtn = document.getElementById("cancelEditBtn");
    if (submitBtn)
      submitBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Cập nhật sản phẩm';
    if (cancelBtn) cancelBtn.classList.remove("hidden");
  };
  window.deleteProduct = (id) => adminController.deleteProduct(id);
  const addProductForm = document.getElementById("addProductForm");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  if (addProductForm) {
    addProductForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearValidationErrors();

      const productData = {
        name: document.getElementById("productName").value,
        price: document.getElementById("productPrice").value, // Lấy giá trị là string để validate
        screen: document.getElementById("productScreen").value,
        backCamera: document.getElementById("productBackCamera").value,
        frontCamera: document.getElementById("productFrontCamera").value,
        img: document.getElementById("productImg").value,
        type: document.getElementById("productType").value,
        desc: document.getElementById("productDesc").value,
      };

      const allProducts = productController.productService.products;
      const editingId = adminController.editingProductId;
      const errors = validateProductForm(productData, allProducts, editingId);

      if (Object.keys(errors).length > 0) {
        displayValidationErrors(errors);
        return; // Dừng lại nếu có lỗi
      }

      // Chuyển giá thành số sau khi validation thành công
      const finalProductData = {
        ...productData,
        price: Number(productData.price)
      };

      if (adminController.editingProductId) {
        await adminController.updateProduct(
          adminController.editingProductId,
          finalProductData
        );
        adminController.editingProductId = null;
      } else {
        await adminController.addProduct(finalProductData);
      }
      addProductForm.reset();
      cancelEditBtn.classList.add("hidden");
      const submitBtn = document.querySelector(
        '#addProductForm button[type="submit"]'
      );
      if (submitBtn)
        submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Thêm sản phẩm';
    });
  }
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      addProductForm.reset();
      adminController.editingProductId = null;
      cancelEditBtn.classList.add("hidden");
      const submitBtn = document.querySelector(
        '#addProductForm button[type="submit"]'
      );
      if (submitBtn)
        submitBtn.innerHTML = '<i class="fas fa-plus mr-2"></i>Thêm sản phẩm';
    });
  }
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
  const track = document.getElementById("bannerTrack");
  const dots = document.querySelectorAll(".dot");
  if (track) {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
  }
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
    dot.classList.toggle("bg-blue-600", index === currentSlide);
    dot.classList.toggle("bg-gray-400", index !== currentSlide);
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
  document.getElementById('adminView').classList.add('hidden');
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('userView').classList.remove('hidden');

  document.getElementById("adminBtn").classList.remove("text-blue-600", "font-bold");
  document.getElementById("adminBtn").classList.add("text-gray-700");
}
window.showUserView = showUserView;

// Giao diện admin
function showAdminView() {
  document.getElementById('userView').classList.add('hidden');
  document.getElementById('mainContent').classList.add('hidden');
  document.getElementById('adminView').classList.remove('hidden');

  const adminBtn = document.getElementById("adminBtn");
  if (adminBtn) {
    adminBtn.classList.add("text-blue-600", "font-bold");
    adminBtn.classList.remove("text-gray-700");
  }
}
window.showAdminView = showAdminView;

// Hiển thị trang giỏ hàng lớn
function showCartPage() {
    document.getElementById('userView').classList.add('hidden');
    document.getElementById('adminView').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    renderCartPage();
}
window.showCartPage = showCartPage;

// Thông báo
function showNotification(message, type = "success") {
  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };
  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    info: "fas fa-info-circle",
    warning: "fas fa-exclamation-triangle",
  };
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full flex items-center`;
  notification.innerHTML = `
        <i class="${icons[type]} mr-2"></i>
        <span>${message}</span>
    `;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);
  setTimeout(() => {
    notification.classList.add("translate-x-full");
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Render giỏ hàng lớn
function renderCartPage() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    // Chỉ render nội dung, không ẩn/hiện view ở đây
    mainContent.innerHTML = `
      <div class="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-8" id="cartPage">
        <div class="md:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-bold mb-4 flex items-center justify-between">
            <span>Giỏ hàng</span>
            <span id="cartPageCount" class="text-sm text-gray-500"></span>
          </h2>
          <div id="cartPageItems"></div>
        </div>
        <div class="bg-white rounded-lg shadow p-6 flex flex-col justify-between" style="height: fit-content;">
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
            <div class="flex justify-between font-bold text-lg mt-4 border-t pt-4">
              <span>Tổng tiền</span>
              <span id="cartPageTotal">$0</span>
            </div>
          </div>
          <button onclick="goToCheckoutPage()" class="w-full bg-blue-600 text-white py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors">
            TIẾN HÀNH THANH TOÁN
          </button>
        </div>
      </div>
    `;
    
    // Render nội dung chi tiết
    const items = cartController.cartService.cart;
    const cartPageItemsContainer = document.getElementById('cartPageItems');
    const cartPageCount = document.getElementById('cartPageCount');
    const cartPageSummaryCount = document.getElementById('cartPageSummaryCount');
    const cartPageTotal = document.getElementById('cartPageTotal');

    if (cartPageItemsContainer) {
      if (items.length === 0) {
        cartPageItemsContainer.innerHTML = `<p class="text-gray-500">Giỏ hàng của bạn đang trống.</p>`;
      } else {
        cartPageItemsContainer.innerHTML = items.map(renderCartItem).join('');
      }
    }
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    if(cartPageCount) cartPageCount.textContent = `${totalItems} sản phẩm`;
    if(cartPageSummaryCount) cartPageSummaryCount.textContent = totalItems;
    if(cartPageTotal) cartPageTotal.textContent = `$${cartController.cartService.getTotalPrice().toFixed(2)}`;

    setupCartPageEvents();
}

function goToCheckoutPage() {
    document.getElementById('userView').classList.add('hidden');
    document.getElementById('adminView').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    renderCheckoutPage();
}
window.goToCheckoutPage = goToCheckoutPage;

function goToSuccessPage() {
    // Xử lý logic thanh toán
    cartController.cartService.cart = [];
    cartController.cartService.saveCartToStorage();
    cartController.renderCart(); // Cập nhật lại count trên header

    // Hiển thị trang thành công
    document.getElementById('userView').classList.add('hidden');
    document.getElementById('adminView').classList.add('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    renderSuccessPage();
}
window.goToSuccessPage = goToSuccessPage;

function renderCheckoutPage() {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;
    
    // Chỉ render nội dung
    mainContent.innerHTML = `
        <div id="checkoutPage" class="container mx-auto px-4 py-8">
            <h1 class="text-3xl font-bold text-center mb-8">Xác nhận Đơn hàng</h1>
            <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
                <div id="checkoutOrderInfo" class="mb-6"></div>
                <div class="text-right">
                    <button onclick="showCartPage()" class="bg-gray-300 text-gray-800 py-3 px-8 rounded-lg hover:bg-gray-400 font-semibold mr-4">
                        Quay lại
                    </button>
                    <button onclick="goToSuccessPage()" class="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 font-semibold">
                        XÁC NHẬN THANH TOÁN
                    </button>
                </div>
            </div>
        </div>
    `;
    // Render order summary
    const cart = cartController.cartService.cart;
    const container = document.getElementById("checkoutOrderInfo");
    if (!container) return;

    container.innerHTML = cart.map(item => `
        <div class="flex items-center border-b py-3">
            <img src="${item.img}" alt="${item.name}" class="w-16 h-16 object-cover rounded mr-4">
            <div class="flex-1">
                <div class="font-semibold">${item.name}</div>
                <div class="text-sm text-gray-500">Số lượng: ${item.quantity}</div>
            </div>
            <div class="font-semibold">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('') + `
    <div class="mt-6 text-right">
        <div class="text-lg">Phí vận chuyển: <span class="font-semibold">$5.00</span></div>
        <div class="text-2xl font-bold mt-2">Tổng cộng: <span class="text-blue-600">$${(cartController.cartService.getTotalPrice() + 5).toFixed(2)}</span></div>
    </div>
    `;
}

function renderSuccessPage() {
    const mainContent = document.getElementById('mainContent');
    if(!mainContent) return;

    // Chỉ render nội dung
    mainContent.innerHTML = `
        <div id="successPage" class="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
            <div class="bg-white p-10 rounded-full shadow-lg text-green-500 mb-6">
                <i class="fas fa-check text-5xl"></i>
            </div>
            <h1 class="text-3xl font-bold mb-2">Thanh toán thành công!</h1>
            <p class="text-gray-600 mb-8">Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.</p>
            <button onclick="showUserView()" class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Tiếp tục mua sắm
            </button>
        </div>
    `;
}

// Gắn sự kiện chuyển trang
function setupCartPageEvents() {
  const checkoutBtn = document.getElementById("cartPageCheckoutBtn");
  if (checkoutBtn) {
    checkoutBtn.onclick = goToCheckoutPage;
  }
}

// Thay đổi nút giỏ hàng trên header để mở trang lớn
const cartBtn = document.querySelector('button[onclick="toggleCart()"]');
if (cartBtn) cartBtn.onclick = showCartPage;

// Gắn sự kiện khi DOM ready
setTimeout(setupCartPageEvents, 500);

document.addEventListener("DOMContentLoaded", initApp);
window.productController = productController;
window.cartController = cartController;
window.adminController = adminController;

function setActiveNav(id) {
  ["navHome", "navSamsung", "navApple", "navCart", "navAdmin"].forEach(
    (navId) => {
      const el = document.getElementById(navId);
      if (el) el.classList.remove("text-blue-600", "font-bold", "underline");
    }
  );
  const active = document.getElementById(id);
  if (active) active.classList.add("text-blue-600", "font-bold", "underline");
}

function setupHeaderEvents() {
  const navHome = document.getElementById("navHome");
  const navSamsung = document.getElementById("navSamsung");
  const navApple = document.getElementById("navApple");
  const navCart = document.getElementById("navCart");
  const navAdmin = document.getElementById("navAdmin");
  if (navHome)
    navHome.onclick = function (e) {
      e.preventDefault();
      renderProductList();
      setActiveNav("navHome");
    };
  if (navSamsung)
    navSamsung.onclick = function (e) {
      e.preventDefault();
      renderProductList("Samsung");
      setActiveNav("navSamsung");
    };
  if (navApple)
    navApple.onclick = function (e) {
      e.preventDefault();
      renderProductList("Apple");
      setActiveNav("navApple");
    };
  if (navCart)
    navCart.onclick = function (e) {
      e.preventDefault();
      renderCartPage();
      setActiveNav("navCart");
    };
  if (navAdmin)
    navAdmin.onclick = function (e) {
      e.preventDefault();
      renderAdminPage();
      setActiveNav("navAdmin");
    };
}

// Gọi sau khi DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  setupHeaderEvents();
  setActiveNav("navHome");
  renderProductList();
});

// Lọc và cuộn đến sản phẩm
function filterAndScroll(brand) {
  showUserView();
  // Sửa ở đây: Gọi trực tiếp hàm render của controller
  productController.filterProducts(brand); 
  const productsSection = document.getElementById("productsSection");
  if (productsSection) {
    // ... existing code ... -->
  }
}
