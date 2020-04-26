const express = require('express');
const conectarDB = require('./config/db');

//crear servidor

const app = express();

//conectar base de datos

conectarDB();

//habilitar express.json

app.use( express.json({extended: true }) );

// puerto de la app
const PORT = process.env.PORT || 4000;

app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tarea'));




app.listen(PORT, () => {
    console.log(`El servidor corre en el puerto ${PORT}`);
});




