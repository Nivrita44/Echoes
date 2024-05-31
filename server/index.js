const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const mysql = require("mysql");

app.use(cors());
app.use(express.json());