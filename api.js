const fs = require("fs");
const http = require("http");
const https = require("https");
const privateKey = fs.readFileSync("config/server.key", "utf8");
const certificate = fs.readFileSync("config/server.crt", "utf8");

const credentials = { key: privateKey, cert: certificate };

const express = require("express");
const path = require("path");
const sqlLib = require("./libs/sql");
const { port, sql, apikey } = require("./config/config.json");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "/web/public")));

//get - website
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/web/index.html");
});
app.get("/help", function (req, res) {
  res.sendFile(__dirname + "/web/help.html");
});
app.get("/feed", function (req, res) {
  res.sendFile(__dirname + "/web/feed.html");
});
app.get("/cp", function (req, res) {
  res.sendFile(__dirname + "/web/panel.html");
});
app.get("/download/backup", function (req, res) {
  const file = `${__dirname}/web/backup.zip`;
  res.download(file);
});
//post (get)
app.post("/api/check", function (req, res) {
  if (req.body.apikey === apikey) {
    res.send("working");
  } else {
    res.send("wrong key");
  }
});
app.post("/api/server", function (req, res) {
  if (req.body.apikey === apikey) {
    sqlLib.getServer(req.body.guildId, function (server) {
      res.send(server);
    });
  } else {
    return res.status(400).send({
      message: "wrong Api-Key!",
    });
  }
});
//put
app.put("/api/server", function (req, res) {
  if (req.body.apikey === apikey) {
    sqlLib.setServer(
      req.body.guildId,
      req.body.adminroleId,
      req.body.teshroleId
    );
    res.send(true);
  } else {
    return res.status(400).send({
      message: "wrong Api-Key!",
    });
  }
});
//update
//delte

//The 404 Route (ALWAYS Keep this as the last route)
app.get("*", function (req, res) {
  res.sendFile(__dirname + "/web/404.html", 404);
});

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
