const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
// // people
const users = require('./routes/api/people/users');
const profiles = require('./routes/api/people/profile');
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// DB Config
const db = require('./config/keys').mongoURI;
mongoose.connect(db).then(() => console.log('MongoDB Connected')).catch((err) => console.log(err));
// Passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profiles', profiles);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
