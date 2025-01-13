const express = require('express');
const router = express.Router();
const { readProducts } = require('../utils/products.utils');

router.get('/', (req, res) =>{
    const products = readProducts();
    res.render('home', {title: 'Home', products});
});

router.get('/realtimeproducts', (req, res) => {
    const products = readProducts();
    res.render('realTimeProducts', { title: 'Productos en tiempo real', products});
});

module.exports = router;