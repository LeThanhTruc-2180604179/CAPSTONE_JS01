// Hàm kiểm tra rỗng
function isRequired(value, message) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return message || 'Trường này là bắt buộc.';
    }
    return '';
}

// Hàm kiểm tra độ dài
function minLength(value, min, message) {
    if (value.length < min) {
        return message || `Vui lòng nhập ít nhất ${min} ký tự.`;
    }
    return '';
}

function maxLength(value, max, message) {
    if (value.length > max) {
        return message || `Vui lòng nhập không quá ${max} ký tự.`;
    }
    return '';
}

// Hàm kiểm tra là số
function isNumber(value, message) {
    if (isNaN(value)) {
        return message || 'Vui lòng nhập một số hợp lệ.';
    }
    return '';
}

// Hàm kiểm tra số dương
function isPositive(value, message) {
    if (Number(value) <= 0) {
        return message || 'Vui lòng nhập một số lớn hơn 0.';
    }
    return '';
}

// Hàm kiểm tra giá trị tối đa
function maxValue(value, max, message) {
    if (Number(value) > max) {
        return message || `Giá trị không được vượt quá ${new Intl.NumberFormat().format(max)}.`;
    }
    return '';
}

// Hàm kiểm tra định dạng URL
function isUrl(value, message) {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlRegex.test(value)) {
        return message || 'Vui lòng nhập một địa chỉ URL hợp lệ.';
    }
    return '';
}

// Hàm chống spam (lặp ký tự)
function isNotSpam(value, message) {
    // Regex này tìm 5 hoặc nhiều ký tự giống nhau liên tiếp (ví dụ: 'aaaaa')
    const spamRegex = /(.)\1{4,}/;
    if (spamRegex.test(value)) {
        return message || 'Nội dung chứa các ký tự lặp lại không hợp lệ.';
    }
    return '';
}

// Hàm kiểm tra tên duy nhất
function isNameUnique(name, allProducts, currentId, message) {
    const normalizedName = name.toLowerCase();
    const existingProduct = allProducts.find(p => p.name.toLowerCase() === normalizedName);

    // Nếu tìm thấy sản phẩm trùng tên VÀ nó không phải là sản phẩm đang sửa
    if (existingProduct && existingProduct.id !== currentId) {
        return message || 'Tên sản phẩm này đã tồn tại.';
    }
    return '';
}

// Hàm validation chính cho form sản phẩm
export function validateProductForm(data, allProducts, currentId = null) {
    const errors = {};

    // Helper để gán lỗi
    const setError = (field, message) => {
        if (message) {
            errors[field] = message;
        }
    };

    // Validation Rules
    setError('name', isRequired(data.name) || isNameUnique(data.name, allProducts, currentId) || minLength(data.name, 5) || maxLength(data.name, 19) || isNotSpam(data.name));
    setError('price', isRequired(data.price) || isNumber(data.price) || isPositive(data.price) || maxValue(data.price, 999999999));
    setError('screen', isRequired(data.screen) || maxLength(data.screen, 60) || isNotSpam(data.screen));
    setError('backCamera', isRequired(data.backCamera) || maxLength(data.backCamera, 60) || isNotSpam(data.backCamera));
    setError('frontCamera', isRequired(data.frontCamera) || maxLength(data.frontCamera, 19) || isNotSpam(data.frontCamera));
    setError('img', isRequired(data.img) || isUrl(data.img));
    setError('type', isRequired(data.type));
    setError('desc', isRequired(data.desc) || minLength(data.desc, 10) || maxLength(data.desc, 60) || isNotSpam(data.desc));

    return errors;
}

// Hàm hiển thị lỗi trên UI
export function displayValidationErrors(errors) {
    // Xóa lỗi cũ
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');

    // Hiển thị lỗi mới
    for (const field in errors) {
        const errorElement = document.getElementById(`${field}Error`);
        if (errorElement) {
            errorElement.textContent = errors[field];
        }
    }
}

// Hàm xóa lỗi
export function clearValidationErrors() {
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
} 