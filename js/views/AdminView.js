export function renderAdminProductRow(product) {
    return `
        <tr class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #${product.id}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <img src="${product.img}" alt="${product.name}" 
                     class="w-12 h-12 object-cover rounded-lg border">
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${product.name}</div>
                <div class="text-sm text-gray-500">${product.type}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                $${product.price}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.type.toLowerCase() === 'iphone' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                    ${product.type}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button onclick="editProduct('${product.id}')" 
                        class="text-blue-600 hover:text-blue-900 transition-colors">
                    <i class="fas fa-edit mr-1"></i>Sửa
                </button>
                <button onclick="deleteProduct('${product.id}')" 
                        class="text-red-600 hover:text-red-900 transition-colors">
                    <i class="fas fa-trash mr-1"></i>Xóa
                </button>
            </td>
        </tr>
    `;
} 