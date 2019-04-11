var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');

//mongoose.connection.openUri('mongodb+srv://lsilva:lsilvamongodb@testing-fpcxy.mongodb.net/test?retryWrites=true', (err, res) => {
mongoose.connection.openUri('mongodb://localhost:27017/nodeDemo', (err, res) => {
    if (err) throw err;
    console.log('Database Running');
});

app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


app.listen(9834, () => {
    console.log('Server Running');
});