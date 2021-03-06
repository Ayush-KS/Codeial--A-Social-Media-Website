const express = require('express');

//Setting up passport
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

//Setting up MongoStore
const MongoStore = require('connect-mongo')(session);

//Setting up express
const app = express();

//Setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//Setting up Layouts
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

//Setting up SCSS
const sassMiddleware = require('node-sass-middleware');

//Setting up Socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_socket').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat server is listening on port 5000!');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

//Setting up flash messages
const flash = require('connect-flash');

// Setting static files
app.use(express.static('./assets'));

// Extracting styles and scripts and placing them correctly
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Setting up Database
const db = require('./config/mongoose');

// Setting up cookie-parser
const cookieParser = require('cookie-parser');

// MiddleWares
app.use(express.urlencoded());
app.use(cookieParser());
const customMware = require('./config/middleware');

// Creating express-session
app.use(session({
    name: 'codeial',
    // TODO Change secret before deployment at the production level
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000* 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err) {
            console.log(err || 'connect-mongodb setup ok');
        }
    )
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//Setting up flash messages
app.use(flash());
app.use(customMware.setFlash);

//Making the uploads folder available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

const port = 8000;

app.use('/', require('./routes'));

app.listen(port, function(err) {
    if(err) {
        console.log(`Error in running the server: ${err}`);
        return;
    }

    console.log(`Server is up and running on port: ${port}`);
})