import express from 'express';

import mysql from 'mysql2/promise';

import cors from 'cors';

const app = express();
const port = 3000; // Puerto fijo, sin variables de entorno

app.use(cors());
app.use(express.json()); // Para poder parsear el cuerpo de las solicitudes JSON

// Conectar a la base de datos
const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'xexpress',
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
        res.status(201).send('Usuario creado');
    } catch (err) {
        console.log(err);
        res.status(500).send('Error al crear el usuario');
    }
});

// Ruta de inicio de sesión
app.post('/login', async (req, res) => {
    const { usuario, clave } = req.body; // Obtenemos los datos del cuerpo de la solicitud

    // Verificamos las credenciales en la base de datos
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
            res.status(401).send('Usuario o contraseña incorrectos');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error al procesar la solicitud');
    }
});

/* // Ruta para editar usuario
app.put('/user/:id', async (req, res) => {
    const { id } = req.params;
    const { usuario, clave } = req.body;

    if (!usuario || !clave) {
        return res.status(400).json({ error: "El usuario y la clave son obligatorios." });
    }

    try {
        const [results] = await connection.query(
            "UPDATE usuarios SET usuario = ?, clave = ? WHERE id = ?",
            [usuario, clave, id]
        );
        if (results.affectedRows > 0) {
            res.send('Usuario actualizado');
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error al actualizar el usuario');
    }
});

// Ruta para eliminar usuario
app.delete('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const [results] = await connection.query(
            "DELETE FROM usuarios WHERE id = ?",
            [id]
        );
        if (results.affectedRows > 0) {
            res.send('Usuario eliminado');
        } else {
            res.status(404).send('Usuario no encontrado');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error al eliminar el usuario');
    }
}); */

// Ruta de validación (opcional, si la necesitas)
app.get('/validar', (req, res) => {
    const datos = req.query;
    console.log(datos);
    res.send('Sesión validada');
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`El servidor está escuchando en http://localhost:${port}`);
});