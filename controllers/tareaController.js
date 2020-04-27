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
