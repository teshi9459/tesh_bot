const express = require("express");
const path = require('path');
const {
 port
} = require('../config/config.json');

const app = express();
const router = express.Router();

app.use(express.static(path.join(__dirname, 'public')));

var publicPath = path.join(__dirname, 'public');

app.get('/download/backup', function(req, res) {
 const file = `${__dirname}/public/backup.zip`;
 res.download(file);
});


router.get("/", function (req, res) {
 res.sendFile(path.join(__dirname, "/"));
});


app.get('/new_deposit', function (req, res) {
 res.sendfile(publicPath + '/new_deposit.html');
});


app.listen(port, () => console.log(`Web listening at http://localhost:${port}`));