require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');

const session      = require('express-session');

const MongoStore   = require('connect-mongo')(session);

const flash        = require("connect-flash");



mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/the-library-example', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Woah, dude, an express app!';



app.use(session({
  secret: "shhh-super-sectet-key",
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use(flash());



app.use((req, res, next)=>{
  res.locals.theUser = req.session.currentuser;

  res.locals.errorMessage = req.flash('error');

  next();
})
// creating a universal variable inside all the hbs files called theUser
// this variable is equal to the user in the session
// that means if there's no user in the session, this variable will be null/undefined (not sure which one)




const index = require('./routes/index');
app.use('/', index);

const bookRoutes = require('./routes/book-routes');
app.use('/', bookRoutes);

const authorRoutes = require('./routes/author-routes');
app.use('/', authorRoutes);

const userRoutes = require('./routes/user-routes');
app.use('/', userRoutes);


module.exports = app;
