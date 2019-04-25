var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');



var Schema = mongoose.Schema;

var validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} No es un rol valido'
}


var userSchema = new Schema({
    name: { type: String, required: [true, 'Ingrese nombre'], },
    email: { type: String, unique: true, required: [true, 'Ingrese email'], },
    password: { type: String, required: [true, 'Ingrese password'], },
    img: { type: String, required: false, },
    deleted: { type: Boolean, default: false },
    isactive: { type: Boolean, default: true },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles },
});
userSchema.plugin(uniqueValidator, { message: '{PATH} El email debe ser Unico' });
module.exports = mongoose.model('User', userSchema);