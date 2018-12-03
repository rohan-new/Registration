const express = require('express');
const bodyParser = require('body-parser');
var ejs = require('ejs');
const bcrypt = require('bcryptjs');
const path = require('path');
const request = require('request');
const saltRounds = 10;
const initializeDatabases = require('./services/mongo-connection');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('web/public'));
app.use(express.static('web/public/views'));
let port = process.env.PORT || 3000;
app.set('port', port);
app.set('view engine','ejs');

const packages = {
    express,
    app,
    bcrypt,
    request,
    path
};
initializeDatabases().then(client => {
    db = client.db('USER');  
    require('./routes')(packages,db)
  }).catch(err => {
    console.error('Failed to make all database connections!')
    process.exit(1)
  })
                
app.listen(app.get('port'), (err) => {
    console.log(`Server running on port: ${app.get('port')}`);
})