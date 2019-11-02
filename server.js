const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const app = express();
// // people
const users = require('./routes/api/people/users');
const profile = require('./routes/api/people/profile');
const business = require('./routes/api/place/business/business');
const readAll = require('./routes/api/things/ReadAll');
const crudAll = require('./routes/api/things/CrudAll');
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// DB Config
const db = require('./config/keys').mongoURI;
mongoose.connect(db).then(() => console.log('MongoDB Connected')).catch((err) => console.log(err));
// Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);
// //  Routes People
app.use('/api/profile', profile);
app.use('/api/business', business);
app.use('/api/read-all', readAll);
app.use('/api/crud', crudAll);

app.use('/api/users', users);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
