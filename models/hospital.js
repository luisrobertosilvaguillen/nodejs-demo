var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var hospitalSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    deleted: { type: Boolean, default: false },
    isactive: { type: Boolean, default: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'hospitals' });

module.exports = mongoose.model('Hospital', hospitalSchema);