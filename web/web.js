const express = require("express");
const path = require('path');
const {
 port
} = require('../config/config.json');

const app = express();
const router = express.Router();

app.use(express.static(path.join(__dirname, 'public')));

var publicPath = path.join(__dirname, 'public');

app.get('/', function(req, res) {
 res.sendFile(__dirname+'/index.html');
});
app.get('/help', function(req, res) {
 res.sendFile(__dirname+'/help.html');
});
app.get('/feed', function(req, res) {
 res.sendFile(__dirname+'/feed.html');
});
app.get('/cp', function(req, res) {
 res.sendFile(__dirname+'/panel.html');
});
app.get('/download/backup', function(req, res) {
 const file = `${__dirname}/backup.zip`;
 res.download(file);
});





//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
 res.sendFile(__dirname+'/404.html', 404);
});
app.listen(port, () => console.log(`Web listening at http://localhost:${port}`));