const express = require('express');
const app = express();
const port = 3000; // Puerto fijo, sin variables de entorno
const mysql = require('mysql2/promise');
const cors = require('cors');

app.use(cors());

// Conectar a la base de datos
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'xexpress',
    //password: '',
    //port: 3306
});

// Ruta de registro, datos por URL
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

// Variable para guardar usuarios y contraseña, y ruta /login para el inicio de sesión
app.get('/login', async (req, res) => {
    const usuario = req.query.usuario;
    const clave = req.query.clave;
    const [rows] = await pool.execute('SELECT * FROM usuarios WHERE usuario = ? AND clave = ?', [usuario, clave])
    if (rows.length > 0) {
        res.send('Usuario y contraseña correctos')
        res.end()
        return
    }
    res.send('Usuario o contraseña incorrectos')
    res.end()
    return
    /* const { usuario, clave } = req.query;

    try {
        const [results] = await pool.query(
            "SELECT * FROM `usuarios` WHERE `usuario` = ? AND `clave` = ?",
            [usuario, clave]
        );

        if (results.length > 0) {
            res.status(200).send('Inicio de sesión correcto');
        } else {
            res.status(401).send('Datos incorrectos');
        }

        console.log(results); // results contiene filas retornadas por el servidor
    } catch (err) {
        console.log(err);
        res.status(500).send('Error al conectar a la base de datos');
    } */
});

// Cear ruta para el registro de usuarios con usuario y clave
app.post('/register', async (req, res) => {
    const usuario = req.query.user;
    const clave = req.query.clave;
    const result = await pool.query('SELECT * FROM usuarios WHERE usuario = ? AND clave = ?', [usuario, clave])
    if (result.affectRows > 0) {
        res.send('Usuario registrado correctamente')
        res.end()
        return
    }
    res.send('Error al registrar el usuario')
    res.end()
    return
/*     pool.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            res.send('Error al conectar a la base de datos')
            res.end()
            return
        }
        connection.query('INSERT INTO usuarios (usuario, clave) VALUES (?,?)', [usuario, clave], (err, result) => {
            if (err) {
                console.log(err);
                res.send('Error al insertar usuario en la base de datos')
                res.end()
                return
            }
            res.send('Usuario registrado correctamente')
            res.end()
            return
        })
    })*/
});

app.get('/validar', (req, res) => {
    const datos = req.query;
    console.log(datos);
    res.send('Sesión validada');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`El servidor está escuchando en http://localhost:${port}`);
});