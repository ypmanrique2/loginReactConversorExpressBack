import express from 'express';

import mysql from 'mysql2/promise';

import cors from 'cors';

import userRoutes from './userRoutes.js';

const port = 3000; // Puerto fijo del back-end en xpress, sin variables de entorno
const app = express();

// Configuración de CORS
const corsOptions = {
    origin: 'https://conversorreactfrontend.onrender.com:5173',  // Permitir solicitudes desde el front-end
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos permitidos
    allowedHeaders: ['Content-Type'],  // Encabezados permitidos
};

app.use(cors(corsOptions)); // Usar las opciones de CORS configuradas

app.use(express.json()); // Para analizar JSON en el cuerpo de las solicitudes
app.use(userRoutes);


// Conectar a la base de datos
const connection = mysql.createPool({
    host: 'mysql-conversor-soy-7596.i.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS_QbjHj-vGWZmBnhv3u0L',
    database: 'defaultdb',
    port: 12655
});

// Ruta de registro
app.post('/register', async (req, res) => {
    const { usuario, clave } = req.body;

    if (!usuario || !clave) {
        return res.status(400).json({ error: "El usuario y la clave son obligatorios." });
    }

    try {
        const [results] = await connection.query(
            "INSERT INTO usuarios (usuario, clave) VALUES (?, ?)",
            [usuario, clave]
        );
        res.status(201).json({ message: 'Usuario creado' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { usuario, clave } = req.body; // Obtenemos los datos del cuerpo de la solicitud

    try {
        const [results] = await connection.query(
            "SELECT * FROM usuarios WHERE usuario = ? AND clave = ?",
            [usuario, clave]
        );

        if (results.length > 0) {
            res.json({
                message: 'Usuario y contraseña correctos',
                logueado: true
            });
        } else {
            res.status(401).json('Usuario o contraseña incorrectos');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json('Error al procesar la solicitud');
    }
});

// Ruta de validación
app.get('/validar', (req, res) => {
    const datos = req.query;
    console.log(datos);
    res.json('Sesión validada');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`El servidor está escuchando en http://mysql-conversor-soy-7596.i.aivencloud.com:${port}`);
});

export default connection;