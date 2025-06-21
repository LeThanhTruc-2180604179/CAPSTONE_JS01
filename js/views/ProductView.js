export function renderProductCard(product) {
    return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center cursor-pointer" onclick="showProductDetail('${product.id}')">
            <img src="${product.img}" alt="${product.name}" class="w-full h-48 object-cover mb-2">
            <h3 class="text-lg font-medium text-gray-800 mb-2">${product.name}</h3>
            <p class="text-gray-600 mb-2">Giá sản phẩm: $${product.price}</p>
            <button onclick="addToCart('${product.id}'); event.stopPropagation();" 
                    class="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center">
                <i class="fas fa-shopping-cart mr-2"></i>Thêm giỏ hàng
            </button>
        </div>
    `;
}

export function renderProductDetail(product) {
    return `
        <div class="fixed inset-0 flex items-center justify-center z-50" style="background: rgba(0,0,0,0.5);">
            <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 md:mx-0 p-8 flex flex-col md:flex-row gap-8 relative animate-fade-in">
                <!-- Nút X đóng modal -->
                <button onclick="closeProductModal()" class="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl focus:outline-none" title="Đóng">
                    <i class="fas fa-times"></i>
                </button>
                <!-- Ảnh sản phẩm -->
                <div class="flex flex-col items-center justify-center w-full md:w-1/2">
                    <h3 class="text-sm text-gray-600 mb-2">chi tiết sản phẩm</h3>
                    <img src="${product.img}" alt="${product.name}" class="w-80 h-80 object-cover mx-auto mb-4 rounded-lg shadow-lg">
                    <button class="text-gray-600 text-sm flex items-center mx-auto">
                        <i class="fas fa-eye mr-2"></i>Hình ảnh sản phẩm
                    </button>
                </div>
                <!-- Thông tin sản phẩm -->
                <div class="flex flex-col justify-between w-full md:w-1/2">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800 mb-2">${product.name.toUpperCase()}</h1>
                        <p class="text-gray-600 font-medium mb-2">${product.type ? product.type.toUpperCase() : ''}</p>
                        <div class="space-y-2 mb-6 text-sm text-gray-600">
                            <p><strong>Thiết kế mang tính đột phá</strong></p>
                            <p><strong>Màn hình:</strong> ${product.screen}</p>
                            <p><strong>Camera sau:</strong> ${product.backCamera}</p>
                            <p><strong>Camera trước:</strong> ${product.frontCamera}</p>
                        </div>
                        <div class="mb-6">
                            <p class="text-3xl font-bold text-gray-800 mb-2">$ ${product.price}</p>
                        </div>
                    </div>
                    <button onclick="addToCart('${product.id}'); closeProductModal();" 
                            class="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors mb-4 flex items-center justify-center text-lg font-semibold">
                        <i class="fas fa-shopping-cart mr-2"></i>TIẾN HÀNH THANH TOÁN
                    </button>
                    <p class="text-xs text-gray-500">Thuế và phí vận chuyển sẽ tính khi thanh toán.</p>
                </div>
            </div>
        </div>
    `;
} 