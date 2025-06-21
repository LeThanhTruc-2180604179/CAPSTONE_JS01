import { ProductService } from '../models/Product.js';
import { renderProductCard, renderProductDetail } from '../views/ProductView.js';

export class ProductController {
    constructor(productListContainerId, productModalContainerId) {
        this.productService = new ProductService();
        this.productListContainer = document.getElementById(productListContainerId);
        this.productModalContainer = document.getElementById(productModalContainerId);
    }

    // Lấy và hiển thị sản phẩm
    async loadProducts() {
        await this.productService.fetchProducts();
        this.renderProducts(this.productService.products);
    }

    // Lọc sản phẩm
    filterProducts(type) {
        const filtered = this.productService.filterByType(type);
        this.renderProducts(filtered);
    }

    // Hiển thị danh sách sản phẩm
    renderProducts(products) {
        if (!this.productListContainer) return;
        if (products.length === 0) {
            this.productListContainer.innerHTML = `<div class="col-span-full text-center py-12"><i class="fas fa-search text-4xl text-gray-300 mb-4"></i><p class="text-gray-500 text-lg">Không có sản phẩm nào</p><p class="text-gray-400 text-sm">Thử tìm kiếm với từ khóa khác</p></div>`;
            return;
        }
        this.productListContainer.innerHTML = products.map(renderProductCard).join('');
    }

    // Hiển thị chi tiết sản phẩm
    showProductDetail(productId) {
        const product = this.productService.findById(productId);
        if (product && this.productModalContainer) {
            this.productModalContainer.innerHTML = renderProductDetail(product);
            this.productModalContainer.classList.remove('hidden');
        }
    }

    // Đóng modal chi tiết
    closeProductModal() {
        if (this.productModalContainer) {
            this.productModalContainer.classList.add('hidden');
            this.productModalContainer.innerHTML = '';
        }
    }
} 