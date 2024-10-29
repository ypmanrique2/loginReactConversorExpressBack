const express = require('express');
const app = express();
const port = 3000;

// Obtener el cliente
const mysql = require('mysql2/promise');
const cors = require('cors');

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Variable para guardar guardar usuarios y contraseña, y ruta /login para el inicio de sesión

app.get('/login', (req, res) => { //req = request, peticion; res = response, respuesta
    const usuario = req.query.usuario;
    const clave = req.query.clave;
    if (usuario === 'admin' && clave === '1234') {
        res.json(
            {
                'message': 'Bienvenido admin',
                'logueado': true
            }
        )
        res.end()
        return
    } else {
        res.send('Usuario o contraseña incorrectos')
        res.end()
        return
    }
});

// Crear la conexión a la base de datos
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'xexpress'
});

app.get('/register', async (req, res) => {
    const usuario = req.query.usuario;
    const clave = req.query.clave;

    try {
        const [results] = await connection.query(
            "INSERT INTO usuarios (usuario, clave) VALUES (?,?)", [usuario, clave]
        );
        res.send('Usuario creado');
    } catch (err) {
        console.log(err);
        res.send('Error al crear el usuario');
    }
});

// Ruta de inicio de sesión, datos por URL
app.get('/login', async (req, res) => {
    const usuario = req.query.usuario;
    const clave = req.query.clave;

    try {
        const [results] = await connection.query(
            "SELECT * FROM usuarios WHERE usuario = ? AND clave = ?", [usuario, clave]
        );

        if (results.length === 0) {
            return res.send('Usuario o clave incorrecta');
        }

        res.send('Inicio de sesión exitoso');
    } catch (err) {
        console.log(err);
        res.send('Error al iniciar sesión');
    }
});

app.get('/validar', (req, res) =>{
    const datos = req.query;
    console.log(datos);
    res.send('Inicio sesion');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});