var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();
var User = require('../models/user');

// LOGIN //
app.post('/', (req, res, next) => {
    var body = req.body;

    User.findOne({ email: body.email }, (err, user) => {

        if (err)
            return res.status(500).json({
                ok: false,
                message: 'Error finding user',
                errors: err
            });

        if (!user)
            return res.status(400).json({
                ok: false,
                message: 'User do not exist',
                errors: err
            });

        if (!bcrypt.compareSync(body.password, user.password))
            return res.status(400).json({
                ok: false,
                message: 'Invalid Password',
                errors: err
            });
        var token = jwt.sign({ user: user }, 'lkjlaft##mas@#2', { expiresIn: 14440 }); // 4 Horas
        res.status(200).json({
            ok: true,
            token
        })

    });

});

module.exports = app;