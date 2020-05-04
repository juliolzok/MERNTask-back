const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');

const { validationResult } = require('express-validator');

// crea una nueva transitionDelay: 
exports.crearTarea = async (req, res) => {

    // revisar errores
    const errores = validationResult(req);
    if ( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() });
    }
    
    try {
        const { proyecto } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        // revisar si el pryecto pertence al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' })
        }

        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }


}

// obtiene las tareas por proyecto

exports.obtenerTareas = async (req, res) => {
    
    try {
        const { proyecto } = req.body;
        const existeProyecto = await Proyecto.findById(proyecto);
        if(!existeProyecto) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }
        // revisar si el pryecto pertence al usuario autenticado
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' })
        }
        // obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto });
        res.json({ tareas });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// actualizar la tarea

exports.actualizarTarea = async (req, res) => {
    
    try {
        const { proyecto, nombre, estado } = req.body;
        // si la terea existe
        let tarea = await Tarea.findById(req.params.id);
        
        if(!tarea) {
            return res.status(404).json({ msg: "No existe esa tarea" });
        }
        // revisar si el pryecto pertence al usuario autenticado
        const existeProyecto = await Proyecto.findById(proyecto);
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' })
        }
        // crear objeto con nueva info
        const nuevaTarea = {};

        if(nombre) {
            nuevaTarea.nombre = nombre;
        }
        if(estado) {
            nuevaTarea.estado = estado;
        }
        // guardar la tarea
        tarea = await Tarea.findOneAndUpdate({  _id : req.params.id }, nuevaTarea, { new: true });

        res.json({  tarea });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// elimina una terea

exports.eliminarTarea =  async (req, res) => {
    try {
        const { proyecto } = req.body;
        // si la terea existe
        let tarea = await Tarea.findById(req.params.id);
        
        if(!tarea) {
            return res.status(404).json({ msg: "No existe esa tarea" });
        }
        // revisar si el pryecto pertence al usuario autenticado
        const existeProyecto = await Proyecto.findById(proyecto);
        if (existeProyecto.creador.toString() !== req.usuario.id ) {
            return res.status(401).json({ msg: 'No autorizado' })
        }
        // eliminar la tarea
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({  msg: 'Tarea Eliminada' });


    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}