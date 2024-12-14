const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const productsFile = path.join(__dirname, '../products.json');

const readProducts = () => {
    const data = fs.readFileSync(productsFile, 'utf-8');
    return JSON.parse(data);
};

const writeProducts = (products) => {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
};

const generateId = () => Math.random().toString(36).substring(2, 10);

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
    const { title, descripcion, code, price, status =true, stock, category, thumbnails} =req.body;

    if(!title || !descripcion || !code || !price || !stock || !category){
        return res.status(400).json({error: 'todos los campos son obligatorios, menos thumbnails'});
    }

    const products =readProducts();
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

    res.status(201).json({message: 'se ha agregado un producto', product: newProduct});
});

//pid actualizar producto

router.put('/:pid', (req, res) => {
    const {pid} = req.params;
    const updates = req.body;

    const products = readProducts();
    const producIndex = products.findIndex((p) => p.id === pid);
    if(producIndex === -1) {
        return res.status(404).json({message: 'producto no encontrado'});
    }

    const{id, ...allowedUpdates} = updates;
    products[producIndex] = { ...products[productIndex], ...allowedUpdates};
    writeProducts(products);
    res.json({message: 'producto actualizado', product: products[producIndex]});
});

// deletear producto

router.delete('/:pid', (req, res) => {
    const {pid} =req.params;
    const products = readProducts();

    const filteredProducts = products.filter((p) => p.id !== pid);

    if (filteredProducts.length === products.length) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    writeProducts(filteredProducts);
    res.json({ message: 'Producto eliminado' });
});


module.exports = router;