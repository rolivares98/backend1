const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { post } = require('./products.router');

const cartsFile = path.join(__dirname, '../carts.json');

const readCarts = () => {
    const data = fs.readFileSync(cartsFile, 'utf-8');
    return JSON.parse(data);
};
const writeCarts = (carts) => {
    fs.writeFileSync(cartsFile, JSON.stringify(carts, null, 2));
};

const generateId = () => Math.random().toString(36).substring(2, 10);

//crear nuevo carrito

router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: generateId(),
        products: [],
    };
    carts.push(newCart);
    writeCarts(carts);
    res.json({message: 'carrito creado', cart: newCart});
});

// listar el carro

router.get('/:cid', (req, res) => {
    const { cid} =req.params;
    const carts = readCarts();

    const cart = carts.find((c) => c.id === cid);
    if(!cart) {
        return res.status(404).json({message: 'carrito no encontrado'});
    }
    res.json(cart.products);
});

// add producto al carro

router.post('/:cid/products/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = readCarts();
    const cartIndex = carts.findIndex((c) => c.id === cid);

    if(cartIndex === -1) {
        return res.status(404).json({ message: 'carrito no encontrado'});
    }
    const cart =carts[cartIndex];
    const producIndex = cart.products.findIndex((p) => p.product === pid);

    if(producIndex === -1) {
        cart.products.push({ product: pid, quantity: 1});
    } else {
        cart.products[producIndex].quantity += 1;
    }
    writeCarts(carts);
    res.json({ message: 'producto agregado al carrito', cart});
    

});

// deletear producto del carrito

router.delete('/:cid/products/:pid', (req, res) => {
    const { cid, pid } = req.params;
    const carts = readCarts();
    const cartIndex = carts.findIndex((c) => c.id === cid);

    if (cartIndex === -1) {
        return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const cart = carts[cartIndex];
    const filteredProducts = cart.products.filter((p) => p.product !== pid);

    if (filteredProducts.length === cart.products.length) {
        return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products = filteredProducts;
    writeCarts(carts);

    res.json({ message: 'Producto eliminado del carrito', cart });
});

module.exports =router;