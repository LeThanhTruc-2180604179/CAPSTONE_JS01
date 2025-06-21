export function renderCartItem(item) {
    return `
        <div class="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
            <img src="${item.img}" alt="${item.name}" class="w-12 h-12 object-cover rounded">
            <div class="flex-1">
                <h4 class="font-medium text-gray-800 text-sm">${item.name}</h4>
                <p class="text-gray-600 text-sm">$ ${item.price}</p>
                <div class="flex items-center space-x-2 mt-1">
                    <button onclick="decreaseQuantity('${item.id}')" 
                            class="w-6 h-6 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 flex items-center justify-center">
                        -
                    </button>
                    <span class="text-sm font-medium">${item.quantity}</span>
                    <button onclick="increaseQuantity('${item.id}')" 
                            class="w-6 h-6 bg-gray-200 text-gray-600 rounded text-xs hover:bg-gray-300 flex items-center justify-center">
                        +
                    </button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" 
                    class="text-gray-400 hover:text-red-500 text-sm">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
} 