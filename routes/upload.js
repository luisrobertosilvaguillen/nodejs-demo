var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

var User = require('../models/user');
var Medic = require('../models/medic');
var Hospital = require('../models/hospital');


// default options
app.use(fileUpload());




app.put('/:type/:id', (req, res, next) => {

    var type = req.params.type;
    var id = req.params.id;

    // types de colección
    var typesValidos = ['hospitals', 'medics', 'users'];
    if (typesValidos.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener name del archivo
    var archivo = req.files.image;
    var nameCortado = archivo.name.split('.');
    var extensionArchivo = nameCortado[nameCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    // 12312312312-123.png
    var nameArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extensionArchivo }`;


    // Mover el archivo del temporal a un path
    var path = `./uploads/${ type }/${ nameArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al mover archivo',
                errors: err
            });
        }


        subirPorTipo(type, id, nameArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     message: 'Archivo movido',
        //     extensionArchivo: extensionArchivo
        // });


    })



});


function subirPorTipo(type, id, nameArchivo, res) {

    if (type === 'users') {

        User.findById(id, (err, user) => {

            if (!user) {
                return res.status(400).json({
                    ok: true,
                    message: 'User no existe',
                    errors: { message: 'User no existe' }
                });
            }


            var pathViejo = './uploads/users/' + user.img;

            // Si existe, elimina la imagen anterior
            // if (fs.existsSync(pathViejo)) {
            //     fs.unlink(pathViejo);
            // }

            user.img = nameArchivo;

            user.save((err, userActualizado) => {

                userActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de user actualizada',
                    user: userActualizado
                });

            })


        });

    }

    if (type === 'medics') {

        Medic.findOne({_id: id, deleted: false}, '_id name img isactive user')
        .populate('user', '_id name img email')
        .populate('hospital', '_id name img')
        .exec((err, medic) => {

            if (!medic) {
                return res.status(400).json({
                    ok: true,
                    message: 'Médico no existe',
                    errors: { message: 'Médico no existe' }
                });
            }

            var pathViejo = './uploads/medics/' + medic.img;

            // Si existe, elimina la imagen anterior
            // if (fs.existsSync(pathViejo)) {
            //     fs.unlink(pathViejo);
            // }

            medic.img = nameArchivo;

            medic.save((err, medicUpdated) => {

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de médico actualizada',
                    medic: medicUpdated
                });

            })

        });
    }

    if (type === 'hospitals') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    message: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = './uploads/hospitals/' + hospital.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }

            hospital.img = nameArchivo;

            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });

            })

        });
    }


}

module.exports = app;