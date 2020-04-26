const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const proyectoController = require('../controllers/proyectoController');

const auth = require('../middleware/auth');

// Crea proyectos
// api/proyectos

router.post('/',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

// Actualizar proyecto por ID

router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
);

// Eliminar proyecto por ID

router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
);

module.exports = router;