const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const router = express.Router();
const fs = require('fs');
const path = require('path');

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