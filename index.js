const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = 3000;
mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/user-data")
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Could not connect to database", err);
    process.exit();
  });
