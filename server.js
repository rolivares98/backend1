const http = require('http');
const { Server } = require('socket.io');
const express = require('express');
const fs = require('fs'); // Importar fs para manejar archivos
const path = require('path'); // Importar path para manejar rutas

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración de middleware para servir archivos estáticos y vistas
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Handlebars como motor de plantillas
const handlebars = require('express-handlebars');
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Funciones auxiliares
const productsFile = path.join(__dirname, 'products.json');
const readProducts = () => JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
const writeProducts = (products) => fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));
const generateId = () => Math.random().toString(36).substring(2, 10);

// Ruta para renderizar "home.handlebars"
app.get('/', (req, res) => {
    const products = readProducts();
    res.render('home', { products });
});

// Ruta para renderizar "realTimeProducts.handlebars"
app.get('/realtimeproducts', (req, res) => {
    const products = readProducts();
    res.render('realTimeProducts', { products });
});

// Configurar eventos de WebSockets
io.on('connection', (socket) => {
    console.log('Cliente conectado');

// Emitir lista inicial de productos
socket.emit('updateProducts', readProducts());

// Escuchar evento de nuevo producto
socket.on('newProduct', (product) => {
    if (!product.title || !product.price || isNaN(product.price)) {
        socket.emit('error', 'El producto debe tener un título y un precio válido.');
        return;
    }
    const products = readProducts();
    products.push({ id: generateId(), ...product });
    writeProducts(products);
    io.emit('updateProducts', products);
});

  // Escuchar evento para eliminar producto
socket.on('deleteProduct', (productId) => {
    const products = readProducts();
    const filteredProducts = products.filter((p) => p.id !== productId);
    writeProducts(filteredProducts);

    // Emitir actualización a todos los clientes
    io.emit('updateProducts', filteredProducts);
});
});

// Iniciar el servidor
const PORT = 8080;
server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));