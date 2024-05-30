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
      CREATE TABLE IF NOT EXISTS books_inventory (
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

app.post("/upload-book", (req, res) => {
  const {
    book_title,
    author,
    published_date,
    description,
    image_url,
    category,
  } = req.body;
  const insertQuery =
    "INSERT INTO books_inventory (book_title, author, published_date, description, image_url, category) VALUES (?, ?, ?, ?, ?, ?)";
  con.query(
    insertQuery,
    [book_title, author, published_date, description, image_url, category],
    (err, result) => {
      if (err) {
        console.error("Error inserting book:", err);
        res.status(500).send(err);
      } else {
        res.send({ id: result.insertId });
      }
    }
  );
});

// Get all books
app.get("/all_books", (req, res) => {
  con.query("SELECT * FROM books_inventory ", (err, results) => {
    if (err) {
      console.error("Error fetching books:", err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

// Update book data
app.put("/update-book/:id", (req, res) => {
  const { id } = req.params;
  const {
    book_title,
    author,
    published_date,
    description,
    image_url,
    category,
  } = req.body;
  const updateQuery =
    "UPDATE books_inventory SET book_title = ?, author = ?, published_date = ?, description = ?, image_url = ?, category = ? WHERE id = ?";
  con.query(
    updateQuery,
    [book_title, author, published_date, description, image_url, category, id],
    (err, result) => {
      if (err) {
        console.error("Error updating book:", err);
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Delete book
app.delete("/delete-book/:id", (req, res) => {
  const { id } = req.params;
  const deleteQuery = "DELETE FROM books_inventory WHERE id = ?";
  con.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error("Error deleting book:", err);
      res.status(500).send(err);
    } else if (result.affectedRows === 0) {
      res.status(404).send({ message: "Book not found" });
    } else {
      res.send({ message: "Book deleted successfully" });
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!!!!!");
});
