const config = require('./config');
const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http').Server(app);
const io = module.exports = require('socket.io')(http, {
  pingTimeout: 58000,
  pingInterval: 2000
});
const mongoose = require('mongoose');
const passport = require('passport');
require('./services/passport')(passport);
const path = require('path');

// Connect Mongo
mongoose
  .connect(config[config.env].db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

// middleware
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(passport.initialize());
app.use(cors());

// routes
app.options('*', cors());
app.use(require('./api'));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// socket.io
const socketManager = require('./services/socketManager');
io.on('connection', socketManager);

http.listen(config.port, () =>
  console.log(`Server is listening on port ${config.port}`)
);
