const client = require("../index.js");
const config = require("../config.json");
const pawlog = require("./logs.js");
const express = require("express");
const app = express();
const port = 3000;

app
  .listen(port, () => {
    pawlog.info(`The app is listening at http://localhost:${port}`);
  })
  .on("error", (err) => {
    console.log(err);
  });
app.get("/alive", (req, res) => {
  res.send("YesSir!");
});
