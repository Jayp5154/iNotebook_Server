const connectToMongo = require("./db");
const express = require("express");

connectToMongo();
const app = express();
const port = 5000;
var cors = require("cors");
const path = require("path");

//CORS or Cross-Origin Resource Sharing in Node.js
//is a mechanism by which a front-end client
//can make requests for resources to an external back-end server
app.use(cors());

//Middleware
app.use(express.json());

//Available Routes
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/notes", require("./routes/notes.js"));

//Static file
app.use(express.static(path.join(__dirname, "../Frontend/build")));

app.get("*", function (req, res) {
  res.sendFile(__dirname, "../Frontend/build/index.html");
});

app.listen(port, () => {
  console.log(`iNotebook App listening on port ${port}`);
});
