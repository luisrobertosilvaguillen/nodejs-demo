var express = require('express');

var mdAutenticacion = require('../middlewares/auth');

var app = express();

var Medic = require('../models/medic');

// ==========================================
// Obtener todos los medicos
// ==========================================
app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    Medic.find({deleted: false})
        .populate('user', 'name email')
        .populate('hospital', 'id name')
        .exec(
            (err, medics) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error cargando medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medics: medics,
                total: medics.length
            });
        });
});

// ==========================================
// Obtener Medico por ID
// ==========================================
app.get('/:id', mdAutenticacion.verifyToken, (req, res) => {
    var id = req.params.id;
    Medic.findOne({_id: id, deleted: false}, '_id name img isactive user')
    .populate('user', '_id name img email')
    .populate('hospital', '_id name img')
    .exec((err, medic) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        if (!medic) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id ' + id + 'no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            medic: medic
        });
    })
})
// ==========================================
// Actualizar Medico
// ==========================================
app.put('/:id', mdAutenticacion.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medic.findOne({deleted: false}, (err, medic) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medic) {
            return res.status(400).json({
                ok: false,
                message: 'El medico con el id ' + id + ' no existe',
                errors: { message: 'No existe un medico con ese ID' }
            });
        }


        medic.name = body.name;
        medic.user = req.user._id;
        medic.hospital = body.hospital;

        medic.save((err, medicSaved) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medic: medicSaved
            });
        });
    });
});



// ==========================================
// Crear un nuevo medico
// ==========================================
app.post('/', mdAutenticacion.verifyToken, (req, res) => {

    var body = req.body;

    var medic = new Medic({
        name: body.name,
        user: req.user._id,
        hospital: body.hospital,
        img: null
    });

    medic.save((err, medicSaved) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medic: medicSaved
        });


    });

});


// ============================================
//   Borrar un medico por el id
// ============================================
app.delete('/:id', mdAutenticacion.verifyToken, (req, res) => {

    var id = req.params.id;

    Medic.findById(id, (err, medic) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error borrar medico',
                errors: err
            });
        }

        if (!medic) {
            return res.status(400).json({
                ok: false,
                message: 'No existe un medico con ese id',
                errors: { message: 'No existe un medico con ese id' }
            });
        }

        medic.deleted = true;
        medic.save((err, medicSaved) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al eliminar medico',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                medic: medicSaved
            });
        });
    });
});


module.exports = app;