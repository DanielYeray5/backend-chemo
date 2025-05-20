require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const Car = require('./models/car');
const morgan = require('morgan');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

const app = express();
const PORT = 3000;

// Conectar a la base de datos MongoDB
// mongodb://atlas-sql-681977c89a385e470ffa733d-i9olts.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin'
mongoose.connect('mongodb://localhost:27018/chemo_autos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión a MongoDB exitosa');
}).catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
    console.log('Por favor, asegúrese de que la base de datos esté en funcionamiento.');
});

// Middleware para parsear JSON y habilitar CORS
app.use(express.json());
app.use(cors());

// Middleware para seguridad
app.use(helmet());

// Middleware para logs de solicitudes
app.use(morgan('combined'));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend-chemo')));

// Configuración de nodemailer (ejemplo con Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Función para generar PDF de la factura en memoria
function generarFacturaPDF({ nombre, correo, carrito }) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });
        doc.fontSize(20).text('Factura de compra', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Nombre: ${nombre}`);
        doc.text(`Correo: ${correo}`);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`);
        doc.moveDown();
        doc.fontSize(14).text('Productos:', { underline: true });
        let subtotal = 0;
        carrito.forEach((producto, i) => {
            const cantidad = producto.cantidad || 1;
            const precio = producto.price || 0;
            doc.fontSize(12).text(`${i + 1}. ${producto.name} x${cantidad} - $${precio.toLocaleString('es-MX')} MXN`);
            subtotal += precio * cantidad;
        });
        const iva = subtotal * 0.16;
        const total = subtotal + iva;
        doc.moveDown();
        doc.fontSize(12).text(`Subtotal: $${subtotal.toLocaleString('es-MX')} MXN`);
        doc.text(`IVA (16%): $${iva.toLocaleString('es-MX')} MXN`);
        doc.text(`Total: $${total.toLocaleString('es-MX')} MXN`);
        doc.moveDown();
        doc.fontSize(14).text('¡Gracias por tu compra en SuperCars!', { align: 'center' });
        doc.end();
    });
}

// Reiniciar el carrito al iniciar el servidor
let carrito = [];

// Endpoint para obtener los productos del carrito
app.get('/carrito', (req, res) => {
    res.json(carrito);
});

// Endpoint para agregar un producto al carrito
app.post('/carrito', (req, res) => {
    const { producto } = req.body;
    if (producto) {
        carrito.push(producto);
        res.status(201).json({ message: 'Producto agregado al carrito', carrito });
    } else {
        res.status(400).json({ message: 'Producto no especificado' });
    }
});

// Endpoint para vaciar el carrito desde el servidor
app.delete('/carrito', (req, res) => {
    carrito = []; // Vaciar el carrito en el servidor
    res.status(200).json({ message: 'El carrito ha sido vaciado' });
});

// Endpoint para confirmar la compra y reiniciar el carrito
app.post('/confirmar-compra', async (req, res) => {
    const { nombre, correo, carrito: carritoCompra } = req.body;
    let correoEnviado = false;
    let mensajeCorreo = '';
    console.log('Carrito recibido en /confirmar-compra:', JSON.stringify(carritoCompra, null, 2));
    if (!nombre || !correo || !Array.isArray(carritoCompra)) {
        return res.status(400).json({ message: 'Nombre, correo y carrito son obligatorios' });
    }

    // Actualizar el stock de cada producto comprado
    try {
        for (const producto of carritoCompra) {
            // Buscar el auto actual en la base de datos
            const car = await Car.findOne({ name: producto.name });
            if (!car) {
                return res.status(404).json({ message: `Auto no encontrado: ${producto.name}` });
            }
            // Validar que hay suficiente stock antes de restar
            const cantidadRestar = Math.abs(producto.cantidad || 1);
            if (car.stock < cantidadRestar) {
                return res.status(400).json({ message: `Stock insuficiente para ${producto.name}. Stock actual: ${car.stock}` });
            }
            if (cantidadRestar < 1) {
                return res.status(400).json({ message: `La cantidad mínima de compra para ${producto.name} es 1.` });
            }
            // Validación de stock máximo: no permitir comprar más de lo disponible
            if (cantidadRestar > car.stock) {
                return res.status(400).json({ message: `No puedes comprar ${cantidadRestar} unidades de ${producto.name}. Solo hay ${car.stock} disponibles.` });
            }
            car.stock -= cantidadRestar;
            await car.save();
            console.log(`Restado ${cantidadRestar} a ${producto.name}. Nuevo stock: ${car.stock}`);
        }
    } catch (error) {
        console.error('Error al actualizar el stock:', error);
        return res.status(500).json({ message: 'Error al actualizar el stock de los productos' });
    }

    // Generar la factura PDF y enviarla por correo
    try {
        const pdfBuffer = await generarFacturaPDF({ nombre, correo, carrito: carritoCompra });
        await transporter.sendMail({
            from: `SuperCars <${process.env.GMAIL_USER}>`,
            to: correo,
            subject: 'Factura de tu compra en SuperCars',
            text: 'Adjuntamos la factura de tu compra en SuperCars. ¡Gracias por confiar en nosotros!',
            attachments: [
                {
                    filename: 'factura.pdf',
                    content: pdfBuffer
                }
            ]
        });
        correoEnviado = true;
        mensajeCorreo = 'Factura enviada correctamente al correo.';
        console.log('Factura enviada correctamente al correo:', correo);
    } catch (err) {
        console.error('Error enviando la factura por correo:', err);
        mensajeCorreo = 'La compra fue exitosa, pero no se pudo enviar la factura por correo.';
        console.log('No se pudo enviar la factura por correo:', correo);
    }

    // Generar la factura o procesar la compra aquí
    console.log(`Compra confirmada por ${nombre} (${correo})`);

    // Reiniciar el carrito
    carrito = [];
    res.status(200).json({ 
        message: 'Compra confirmada, stock actualizado y carrito reiniciado',
        correoEnviado,
        mensajeCorreo
    });
});

// Endpoint para obtener los modelos de autos desde la base de datos
app.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
    } catch (error) {
        console.error('Error al obtener los autos desde la base de datos:', error);
        res.status(500).json({ message: 'Error al obtener los autos' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
