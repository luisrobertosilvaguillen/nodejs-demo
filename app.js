var express = require('express');
var mongoose = require('mongoose');

var app = express();

mongoose.connection.openUri('mongodb://localhost:27017/nodeDemo', (err, res) => {
    if(err) throw err;
    console.log('Database Running');
});

app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Ok'
    })
})


app.listen(9834, () => {
    console.log('Running');
});