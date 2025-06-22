import { ProductService } from '../models/Product.js';
import { renderAdminProductRow } from '../views/AdminView.js';

export class AdminController {
    constructor(adminProductListId) {
        this.productService = new ProductService();
        this.adminProductList = document.getElementById(adminProductListId);
        this.editingProductId = null;
        this.searchText = '';
        this.sortOrder = null; // 'asc' | 'desc' | null
        this._initSearchAndSortEvents();
    }

    // Gắn sự kiện tìm kiếm và sắp xếp
    _initSearchAndSortEvents() {
        setTimeout(() => {
            const searchInput = document.getElementById('adminSearchInput');
            const sortSelect = document.getElementById('sortPriceSelect');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.searchText = e.target.value.trim().toLowerCase();
                    this.renderAdminProductList();
                });
            }
            if (sortSelect) {
                sortSelect.addEventListener('change', (e) => {
                    const val = e.target.value;
                    if (val === 'asc' || val === 'desc') {
                        this.sortOrder = val;
                    } else {
                        this.sortOrder = null;
                    }
                    this.renderAdminProductList();
                });
            }
        }, 500);
    }

    // Hiển thị danh sách sản phẩm (có tìm kiếm, sắp xếp)
    async renderAdminProductList() {
        let products = await this.productService.fetchProducts();
        if (!this.adminProductList) return;
        // Lọc theo tên
        if (this.searchText) {
            products = products.filter(p => p.name.toLowerCase().includes(this.searchText));
        }
        // Sắp xếp theo giá
        if (this.sortOrder === 'asc') {
            products = products.slice().sort((a, b) => a.price - b.price);
        } else if (this.sortOrder === 'desc') {
            products = products.slice().sort((a, b) => b.price - a.price);
        }
        if (products.length === 0) {
            this.adminProductList.innerHTML = `<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500"><i class="fas fa-inbox text-4xl mb-2"></i><p>Không có sản phẩm nào</p></td></tr>`;
            return;
        }
        this.adminProductList.innerHTML = products.map(renderAdminProductRow).join('');
    }

    // Kiểm tra dữ liệu sản phẩm
    validateProductData(data) {
        if (!data.name || !data.price || !data.screen || !data.backCamera || !data.frontCamera || !data.img || !data.type) {
            alert('Vui lòng nhập đầy đủ thông tin sản phẩm!');
            return false;
        }
        if (isNaN(data.price) || Number(data.price) <= 0) {
            alert('Giá sản phẩm phải là số lớn hơn 0!');
            return false;
        }
        if (!/^https?:\/\//.test(data.img)) {
            alert('Link ảnh không hợp lệ!');
            return false;
        }
        return true;
    }

    // Thêm sản phẩm (dùng axios)
    async addProduct(productData) {
        if (!this.validateProductData(productData)) return;
        await axios.post(this.productService.apiUrl, productData);
        await this.productService.fetchProducts();
        await this.renderAdminProductList();
    }

    // Cập nhật sản phẩm (dùng axios)
    async updateProduct(productId, productData) {
        if (!this.validateProductData(productData)) return;
        await axios.put(`${this.productService.apiUrl}/${productId}`, productData);
        await this.productService.fetchProducts();
        await this.renderAdminProductList();
    }

    // Xóa sản phẩm (dùng axios)
    async deleteProduct(productId) {
        if (!confirm('Bạn chắc chắn xóa?')) return;
        await axios.delete(`${this.productService.apiUrl}/${productId}`);
        await this.productService.fetchProducts();
        await this.renderAdminProductList();
    }

    // Đổ dữ liệu lên form để sửa
    editProduct(productId) {
        const product = this.productService.findById(productId);
        if (!product) return;
        this.editingProductId = productId;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productScreen').value = product.screen;
        document.getElementById('productBackCamera').value = product.backCamera;
        document.getElementById('productFrontCamera').value = product.frontCamera;
        document.getElementById('productImg').value = product.img;
        document.getElementById('productType').value = product.type;
        document.getElementById('productDesc').value = product.desc;
    }
} 