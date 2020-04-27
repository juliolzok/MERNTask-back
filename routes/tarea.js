const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const tareaController = require('../controllers/tareaController');

const auth = require('../middleware/auth');

// crear una tarea
// api/tareas

router.post('/',
    auth,
    [
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
)


module.exports = router;