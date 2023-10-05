const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const user = require('./models/user'); // Assuming 'user' is your user model
const bcrypt = require('bcrypt');
const initialize = require('./passportConfig'); // Corrected the import name
const flash = require('connect-flash');


require('dotenv').config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
initialize(passport); // Corrected the function name

function Authenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

app.get('/', Authenticated, async (req, res) => {
    res.render('home');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// ... (previous imports and setup)

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.send("All fields are required.");
    }

    try {
        // Check if a user with the same email exists
        const existingUser = await user.findOne({ email: email });

        if (existingUser) {
            return res.redirect('/login'); // Redirect to login if user already exists
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await user.create({
            name: name,
            email: email,
            password: hashedPassword,
        });

        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.redirect('/signup');
    }
});



app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',

   
}));

app.post('/logout', function(req, res, next){
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

  
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database is connected');
    app.listen(5000, () => {
        console.log('Server is running on port: 5000');
    });
}).catch((err) => {
    console.log('Error in connecting database');
});
