const express = require('express');

//Setting up express
const app = express();

//Setting up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

//Setting up Layouts
const expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);

//Setting static files
app.use(express.static('./assets'));

//Extracting styles and scripts and placing them correctly
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//Setting up Database
const db = require('./config/mongoose');

//Setting up cookie-parser
const cookieParser = require('cookie-parser');

//MiddleWares
app.use(express.urlencoded());
app.use(cookieParser())

const port = 8000;

app.use('/', require('./routes'));

app.listen(port, function(err) {
    if(err) {
        console.log(`Error in running the server: ${err}`);
        return;
    }

    console.log(`Server is up and running on port: ${port}`);
})