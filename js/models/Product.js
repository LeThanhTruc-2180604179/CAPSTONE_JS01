export class Product {
    constructor(id, name, price, screen, backCamera, frontCamera, img, desc, type) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.screen = screen;
        this.backCamera = backCamera;
        this.frontCamera = frontCamera;
        this.img = img;
        this.desc = desc;
        this.type = type;
    }
}

export class ProductService {
    constructor() {
        this.products = [];
        this.apiUrl = 'https://68483f07ec44b9f349403913.mockapi.io/products';
    }

    async fetchProducts() {
        try {
            const response = await fetch(this.apiUrl);
            const data = await response.json();
            console.log('DATA:', data);
            this.products = data.map(item => new Product(
                item.id,
                item.name,
                item.price,
                item.screen,
                item.backCamera,
                item.frontCamera,
                item.img,
                item.desc,
                item.type
            ));
            return this.products;
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
            this.loadSampleData();
            return this.products;
        }
    }

    filterByType(type) {
        if (type === 'all') {
            return this.products;
        }
        return this.products.filter(product => 
            product.type && product.type.toLowerCase() === type.toLowerCase()
        );
    }

    findById(id) {
        return this.products.find(product => product.id === id);
    }
} 