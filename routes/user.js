var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();
var User = require('../models/user');


// GET USERS //
app.get('/', (req, res, next) => {

    User.find({}, 'name email img, role').exec(
        (err, users) => {
            if (err)
                return res.status(500).json({
                    ok: false,
                    message: 'Error in DB',
                    errors: err
                });

            res.status(200).json({
                ok: true,
                users
            })
        })
});

// DELETE USERS //
app.delete('/:id', (req, res) => {
    var id = req.params.id;
    User.findByIdAndDelete(id, (err, userDeleted) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'Error finding user',
                errors: {
                    message: `User ${id} do not exist`
                }
            });

        if (!userDeleted)
            return res.status(400).json({
                ok: false,
                message: `User ${id} do not exist`,
                errors: err
            });
        res.status(200).json({
            ok: true,
            user: userDeleted
        })
    })
});

// UPDATE USER //
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {
        if (err)
            return res.status(500).json({
                ok: false,
                message: 'Error finding user',
                errors: {
                    message: `User ${id} do not exist`
                }
            });

        if (!user)
            return res.status(400).json({
                ok: false,
                message: 'User do not exist',
                errors: err
            });


        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userUpdated) => {
            if (err)
                return res.status(400).json({
                    ok: false,
                    message: 'Error updating user',
                    errors: err
                });

            res.status(200).json({
                ok: true,
                user: userUpdated
            })
        })


    });


})

// CREATE USER //
app.post('/', (req, res, next) => {
    var body = req.body;

    var user = new User({
        ...body
    });
    user.password = bcrypt.hashSync(user.password, 10);
    user.save((err, userSaved) => {
        if (err)
            return res.status(400).json({
                ok: false,
                message: 'Error in DB saving user',
                errors: err
            });

        res.status(201).json({
            ok: true,
            user: userSaved
        })
    })
});

module.exports = app;