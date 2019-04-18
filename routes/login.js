var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var seed = require('../config/config').SEED;

var app = express();
var User = require('../models/user');

// LOGIN //
app.post('/', (req, res, next) => {
    var body = req.body;
    console.log(body.email);

    User.findOne({ email: body.email }, (err, user) => {

        if (err)
            return res.status(500).json({
                ok: false,
                message: 'Error finding user',
                errors: err
            });
        console.log(user);
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

        console.log(user);
        var token = jwt.sign({ user: user }, seed, { expiresIn: 14440 }); // 4 Horas
        res.status(200).json({
            ok: true,
            token,
            user,
            id: user._id
        })

    });

});

module.exports = app;