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
    console.error("Error connecting to MySQL database:", err);
    process.exit(1); // Exit the process with an error code
  } else {
    console.log("Connected to MySQL database!");

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        published_date DATE,
        description VARCHAR(1000),
        image_url VARCHAR(255),
        category VARCHAR(50)
      )
    `;

    con.query(createTableQuery, function (err, result) {
      if (err) {
        console.error("Table creation failed:", err);
        process.exit(1); // Exit the process with an error code
      } else {
        console.log("Table created or already exists");

        // Start the server only after table creation
        app.listen(port, () => {
          console.log(`Server is connected to port ${port}`);
        });
      }
    });
  }
});

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});
