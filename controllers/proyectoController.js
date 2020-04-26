const { validationResult } = require('express-validator');

const Proyecto = require('../models/Proyecto');

exports.crearProyecto = async (req, res) => {

    // revisar errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        // crear nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // guardar el creador via JWT
        proyecto.creador = req.usuario.id;
        proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error');
    }
}

// obtiene todos los proyectos del usuario actual

exports.obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 });
        res.json({ proyectos });
    } catch (error){
        console.log(error);
        res.status(500).send('hubo un error');
    }
}

// Actualizar un proyecto

exports.actualizarProyecto = async (req, res) => {
    // Revisar si hay errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() });
    }

    // extraer la info del proyecto

    const { nombre } = req.body;
    const nuevoProyecto = {};
    if(nombre){
        nuevoProyecto.nombre = nombre;
    }

    try {
        // revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        // revisar si existe el proyecto
        if (!proyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' })
        }

        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id : req.params.id }, { $set : nuevoProyecto }, { new: true });

        res.json({ proyecto });

    } catch (error){
        console.log(error);
        res.status(500).send('Error en el servidor');
    }

}

// Eliminar  proyecto por id

exports.eliminarProyecto = async (req, res) => {

    try {
        let proyecto = await Proyecto.findById(req.params.id);
        // revisar si existe el proyecto
        if (!proyecto){
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' })
        }

        //Eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id : req.params.id });
        res.json({ msg: 'Proyecto eliminado' });

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}