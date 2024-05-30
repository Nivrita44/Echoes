const express = require("express");
const app = express();
const port = 2000;
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "echoes_book",
});

con.connect(function (err) {
  if (err) {
    console.log("not Connected");
  }
  console.log("Connected");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server is connected to port ${port}`);
});
