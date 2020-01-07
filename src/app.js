const path = require('path');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// connection to db
mongoose.connect('mongodb://localhost/toilocate-db')
  .then(db => console.log('db connected'))
  .catch(err => console.log(err));

// importing routes
const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api2');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use('/api/uploads', express.static('uploads'));

// routes
app.use('/', indexRoutes);
app.use('/api',apiRoutes);

app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`);
});
