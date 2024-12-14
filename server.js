const express = require('express');
const app = express();
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

app.use(express.json());

// Rutas principales
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Puerto
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});