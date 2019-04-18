var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medic = require('../models/medic');
var User = require('../models/user');

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:search', (req, res) => {

    var search = req.params.search;
    var tabla = req.params.tabla;
    var regex = new RegExp(search, 'i');

    var promesa;

    switch (tabla) {

        case 'users':
            promesa = searchUsers(search, regex);
            break;

        case 'medics':
            promesa = searchMedics(search, regex);
            break;

        case 'hospitals':
            promesa = searchHospitales(search, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de busqueda sólo son: users, medicos y hospitals',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});


// ==============================
// Busqueda general
// ==============================
app.get('/todo/:search', (req, res, next) => {

    var search = req.params.search;
    var regex = new RegExp(search, 'i');


    Promise.all([
            searchHospitals(search, regex),
            searchMedics(search, regex),
            searchUsers(search, regex)
        ])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitals: respuestas[0],
                medics: respuestas[1],
                users: respuestas[2]
            });
        })


});


function searchHospitals(search, regex) {

    return new Promise((resolve, reject) => {

        Hospital.find({ name: regex })
            .populate('user', 'name email')
            .exec((err, hospitals) => {

                if (err) {
                    reject('Error al cargar hospitals', err);
                } else {
                    resolve(hospitals)
                }
            });
    });
}

function searchMedics(search, regex) {

    return new Promise((resolve, reject) => {

        Medic.find({ name: regex })
            .populate('user', 'name email')
            .populate('hospital')
            .exec((err, medics) => {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medics)
                }
            });
    });
}

function searchUsers(search, regex) {

    return new Promise((resolve, reject) => {

        User.find({}, 'name email role')
            .or([{ 'name': regex }, { 'email': regex }])
            .exec((err, users) => {

                if (err) {
                    reject('Erro al cargar users', err);
                } else {
                    resolve(users);
                }


            })


    });
}



module.exports = app;