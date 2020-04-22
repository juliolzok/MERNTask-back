const Proyecto = require('../models/Proyecto');

exports.crearProyecto = async (req, res) => {

    try {
        // crear nuevo proyecto
        const proyecto = new Proyecto(req.body);
        proyecto.save();
        res.json(proyecto);
    } catch (error) {
        console.log(error);
        res.status(500).send('hubo un error');
    }
}