var seed = require('../config/config').SEED;
var jwt = require('jsonwebtoken');


//  VERIFICAR TOKEN //
exports.verifyToken = (req, res, next) => {
    var token = req.headers["authorization"];
    if (!token)
        return res.status(401).json({
            ok: false,
            message: 'Falta Token',
        });

    jwt.verify(token, seed, (err, decoded) => {
        if (err)
            return res.status(401).json({
                ok: false,
                message: 'Token invalido',
                errors: err
            });
        req.user = decoded.user;
        next();
    });
}