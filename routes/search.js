var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medic = require('../models/medic');
var User = require('../models/user');

// ==============================
// Busqueda por colección
// ==============================
app.get('/collection/:table/:search', (req, res) => {

    var search = req.params.search;
    var table = req.params.table;
    var regex = new RegExp(search, 'i');

    var promise;

    switch (table) {

        case 'users':
            promise = searchUsers(search, regex);
            break;

        case 'medics':
            promise = searchMedics(search, regex);
            break;

        case 'hospitals':
            promise = searchHospitals(search, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de busqueda sólo son: users, medicos y hospitals',
                error: { message: 'Tipo de tabla/coleccion no válido' }
            });

    }

    promise.then(data => {

        res.status(200).json({
            ok: true,
            [table]: data
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

        Hospital.find({ name: regex, deleted: false })
            .populate('user', 'id name email')
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

        Medic.find({ name: regex, deleted: false })
            .populate('user', 'name email')
            .populate('hospital', 'id name')
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

        User.find({deleted: false}, 'name email role')
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