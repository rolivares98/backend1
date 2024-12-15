const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const productsFile = path.join(__dirname, '../products.json');

// leer productos

const readProducts = () => {
    try {
        if (!fs.existsSync(productsFile)) {
            fs.writeFileSync(productsFile, JSON.stringify([]));
        }
        const data = fs.readFileSync(productsFile, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error('Error leyendo el archivo:', error);
        return [];
    }
};

const writeProducts = (products) => {
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
};

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 10);

//routes

// listar todo los productos 
router.get('/', (req, res) => {
    const products =readProducts();
    const limit = req.query.limit;
    if(limit) {
        return res.json(products.slice(0, parseInt(limit)));
    }
    res.json(products);
});

// pid obtener producto por id

router.get('/:pid', (req, res) => {
    const {pid}= req.params;
    const products = readProducts();
    const product =products.find((p) => p.id === pid);
    if(!product) {
        return res.status(404).json({message: 'producto no encontrado'});
    }
    res.json(product);
});

// agregar un producto

router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios, menos thumbnails' });
    }

    const products = readProducts();
    const newProduct = {
        id: generateId(),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails: thumbnails || [],
    };
    products.push(newProduct);
    writeProducts(products);

    res.status(201).json({ message: 'Producto agregado exitosamente', product: newProduct });
});

//pid actualizar producto

router.put('/:pid', (req, res) => {
    const { pid } = req.params;
    const updates = req.body;

    const products = readProducts();
    const productIndex = products.findIndex((p) => p.id === pid);
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const { id, ...allowedUpdates } = updates; // No se permite actualizar el ID
    products[productIndex] = { ...products[productIndex], ...allowedUpdates };
    writeProducts(products);
    res.json({ message: 'Producto actualizado', product: products[productIndex] });
});

// deletear producto

router.delete('/:pid', (req, res) => {
    const { pid } = req.params;
    const products = readProducts();

    const filteredProducts = products.filter((p) => p.id !== pid);

    if (filteredProducts.length === products.length) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    writeProducts(filteredProducts);
    res.json({ message: 'Producto eliminado' });
});


module.exports = router;