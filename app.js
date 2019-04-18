var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, No-Auth, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var appRoutes = require('./routes/app');
var hospitalRoutes = require('./routes/hospital');
var medicRoutes = require('./routes/medic');
var searchRoutes = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imagesRoutes = require('./routes/images');


// mongoose.connection.openUri('mongodb+srv://lsilva:lsilvamongodb@testing-fpcxy.mongodb.net/test?retryWrites=true', (err, res) => {
mongoose.connection.openUri('mongodb://localhost:27017/nodeDemo', (err, res) => {
    if (err) throw err;
    console.log('Database Running');
});

app.use('/user', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medic', medicRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagesRoutes);

app.use('/', appRoutes);


app.listen(9834, () => {
    console.log('Server Running');
});