var express = require('express');

var mdAutenticacion = require('../middlewares/auth');

var app = express();

var Hospital = require('../models/hospital');

// ==========================================
// Obtener todos los hospitales
// ==========================================
app.get('/', mdAutenticacion.verifyToken, (req, res, next) => {

    var from = req.query.from || 0;
    from = Number(from);

    Hospital.find({deleted: false}, 'name img isactive user')
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .exec(
            (err, hospitals) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error cargando hospital',
                        errors: err
                    });
                }
                res.status(200).json({
                    ok: true,
                    hospitals: hospitals,
                    total: hospitals.length
                });
            });
});

// ==========================================
// Obtener Hospital por ID
// ==========================================
app.get('/:id', mdAutenticacion.verifyToken, (req, res) => {
    var id = req.params.id;
    Hospital.findOne({_id: id, deleted: false}, 'name img isactive user')
    .populate('user', 'name img email')
    .exec((err, hospital) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + 'no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospital
        });
    })
})
// ==========================================
// Actualizar Hospital
// ==========================================
app.put('/:id', mdAutenticacion.verifyToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }


        hospital.name = body.name;
        hospital.user = req.user._id;

        hospital.save((err, hospitalSaved) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalSaved
            });

        });

    });

});



// ==========================================
// Crear un nuevo hospital
// ==========================================
app.post('/', mdAutenticacion.verifyToken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        user: req.user._id
    });

    hospital.save((err, hospitalSaved) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalSaved
        });


    });

});


// ============================================
//   Borrar un hospital por el id
// ============================================
app.delete('/:id', mdAutenticacion.verifyToken, (req, res) => {

    var id = req.params.id;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error borrar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                message: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        hospital.deleted = true;
        hospital.save((err, hospitalSaved) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalSaved
            });

        });
    });

});


module.exports = app;