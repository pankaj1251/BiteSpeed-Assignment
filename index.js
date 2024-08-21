const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const routes = require("./routes/identify");

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello!");
  res.send(
    "Please use Postman to test the /identify API endpoint at: https://bitespeed-nqgo.onrender.com/identify"
  );
});

app.use("/identify", routes);

const PORT = process.env.PORT || 3000;
mongoose.Promise = global.Promise;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Could not connect to database", err);
    process.exit();
  });