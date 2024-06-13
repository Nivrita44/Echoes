const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const SECRET_KEY = "Thesecretkey"; // Replace with your own secret key

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "echoes_book",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database:", err);
    return;
  } else {
    console.log("Connected to MySQL database!");
  }

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

  db.query(createTableQuery, function (err, result) {
    if (err) {
      console.error("Table creation failed:", err);
      process.exit(1); // Exit the process with an error code
    } else {
      console.log("Table created or already exists");
    }
  });

  const createnewTableQuery = `
        CREATE TABLE IF NOT EXISTS book_sell_inventory (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            book_title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            published_date DATE,
            description VARCHAR(1000),
            image_url VARCHAR(255),
            category VARCHAR(50),
            price DECIMAL(10, 2) NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `;

  db.query(createnewTableQuery, function (err, result) {
    if (err) {
      console.error("Table creation failed:", err);
      process.exit(1); // Exit the process with an error code
    } else {
      console.log("New Table created or already exists");
    }
  });

  const createCartTableQuery = `
CREATE TABLE IF NOT EXISTS sell_cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES book_sell_inventory(id)
)
`;

  db.query(createCartTableQuery, function (err, result) {
    if (err) {
      console.error("Cart table creation failed:", err);
      process.exit(1); // Exit the process with an error code
    } else {
      console.log("Cart table created or already exists");
    }
  });

  const createWishlistTableQuery = `
CREATE TABLE IF NOT EXISTS sell_wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES book_sell_inventory(id)
)
`;

  db.query(createWishlistTableQuery, function (err, result) {
    if (err) {
      console.error("Wishlist table creation failed:", err);
      process.exit(1); // Exit the process with an error code
    } else {
      console.log("Wishlist table created or already exists");
    }
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/register", upload.single("ProfileImage"), async (req, res) => {
  const { Email, RegNo, UserName, Password } = req.body;

  if (!req.file) {
    return res.status(400).send("No profile image uploaded");
  }

  const ProfileImage = `/uploads/${req.file.filename}`;

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);
    const SQL =
      "INSERT INTO users (email, regNo, username, password, image) VALUES (?, ?, ?, ?, ?)";
    const values = [Email, RegNo, UserName, hashedPassword, ProfileImage];

    db.query(SQL, values, (err, results) => {
      if (err) {
        console.error("Error inserting user:", err);
        res.status(500).send(err);
      } else {
        console.log("User inserted successfully!");
        res.status(200).send({ message: "User added" });
      }
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).send({ error: "Error registering user" });
  }
});

app.post("/login", (req, res) => {
  const { LoginEmail, LoginPassword } = req.body;

  const SQL = "SELECT * FROM users WHERE email = ?";
  const values = [LoginEmail];

  db.query(SQL, values, async (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      res.status(500).send({ error: err });
    } else if (results.length > 0) {
      const user = results[0];
      const isMatch = await bcrypt.compare(LoginPassword, user.password);
      if (isMatch) {
        const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
          expiresIn: "24h",
        });
        res.cookie("token", token, { httpOnly: true, sameSite: "Strict" });
        res.status(200).send(user);
      } else {
        console.log("Password does not match");
        res.status(400).send({ message: "Email and password don't match!" });
      }
    } else {
      console.log("User not found with the provided email");
      res.status(400).send({ message: "Email and password don't match!" });
    }
  });
});

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(403);
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "Strict" });
  res.status(200).send({ message: "Logged out successfully" });
});

app.post("/upload-book", authenticateToken, (req, res) => {
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
  db.query(
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

// app.get("/protected", authenticateToken, (req, res) => {
//   res.send({ message: "This is a protected route" });
// });

app.get("/protected", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const SQL = "SELECT id, email, username, image FROM users WHERE id = ?";
  const values = [userId];

  db.query(SQL, values, (err, results) => {
    if (err) {
      console.error("Error fetching user data:", err);
      res.status(500).send({ error: "Error fetching user data" });
    } else if (results.length > 0) {
      const user = results[0];
      res.status(200).send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  });
});

// Get all books
app.get("/all_books", (req, res) => {
  db.query("SELECT * FROM book_sell_inventory", (err, results) => {
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
  db.query(
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
  db.query(deleteQuery, [id], (err, result) => {
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

//recently added books
app.get("/recent_sell_books", (req, res) => {
  const query = `
      SELECT * FROM book_sell_inventory
      ORDER BY id DESC
      LIMIT 10
    `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching recent books:", err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

// Get single book sell inventory item
app.get("/book-sell/:id", (req, res) => {
  const { id } = req.params;
  console.log(`Fetching book sell inventory with ID: ${id}`);
  const selectQuery = "SELECT * FROM book_sell_inventory WHERE id = ?";
  db.query(selectQuery, [id], (err, result) => {
    if (err) {
      console.error("Error fetching book sell inventory:", err);
      res.status(500).send(err);
    } else if (result.length === 0) {
      console.log(`Book sell inventory with ID ${id} not found`);
      res.status(404).send({ message: "Book not found" });
    } else {
      console.log("Book sell inventory fetched successfully:", result[0]);
      res.send(result[0]);
    }
  });
});

// Post single book sell inventory item
app.post(
  "/sell-book",
  upload.array("images", 10),
  authenticateToken,
  (req, res) => {
    const { book_title, author, published_date, description, category, price } =
      req.body;

    const userId = req.user.userId; // Get the user ID from the authenticated token

    if (!req.files || req.files.length === 0) {
      return res.status(400).send("No images uploaded");
    }

    const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

    const insertQuery =
      "INSERT INTO book_sell_inventory (user_id, book_title, author, published_date, description, image_url, category, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      insertQuery,
      [
        userId,
        book_title,
        author,
        published_date,
        description,
        JSON.stringify(imageUrls),
        category,
        price,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting book:", err);
          res.status(500).send(err);
        } else {
          res.send({ id: result.insertId });
        }
      }
    );
  }
);

//search a book
app.get("/search-books", (req, res) => {
  const { query } = req.query;
  const searchQuery = `
      SELECT * FROM book_sell_inventory
      WHERE book_title LIKE ? OR author LIKE ? OR category LIKE ?
    `;
  const searchValues = [`%${query}%`, `%${query}%`, `%${query}%`];

  db.query(searchQuery, searchValues, (err, results) => {
    if (err) {
      console.error("Error fetching books:", err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

// adding book to sell cart

app.post("/add-to-cart", authenticateToken, (req, res) => {
  const { book_id } = req.body;
  const user_id = req.user.userId;

  const insertQuery = "INSERT INTO sell_cart (user_id, book_id) VALUES (?, ?)";
  db.query(insertQuery, [user_id, book_id], (err, result) => {
    if (err) {
      console.error("Error adding book to cart:", err);
      res.status(500).send(err);
    } else {
      res.send({ message: "Book added to cart successfully!" });
    }
  });
});

//all books from cart of a specific user
app.get("/cart", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const query = `
      SELECT book_sell_inventory.*
      FROM sell_cart
      JOIN book_sell_inventory ON sell_cart.book_id = book_sell_inventory.id
      WHERE sell_cart.user_id = ?
    `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching cart books:", err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

//deleting book from cart

app.delete("/delete_buy_cart", authenticateToken, (req, res) => {
  const { bookIds } = req.body;
  const userId = req.user.userId;

  if (!Array.isArray(bookIds) || bookIds.length === 0) {
    return res
      .status(400)
      .send({ message: "No book IDs provided for deletion" });
  }

  const deleteQuery = `
      DELETE FROM sell_cart
      WHERE user_id = ? AND book_id IN (?)
    `;

  db.query(deleteQuery, [userId, bookIds], (err, result) => {
    if (err) {
      console.error("Error deleting books from cart:", err);
      res.status(500).send(err);
    } else if (result.affectedRows === 0) {
      res.status(404).send({ message: "No books found in cart to delete" });
    } else {
      res.send({ message: "Books deleted from cart successfully" });
    }
  });
});

app.post("/add-to-wishlist", authenticateToken, (req, res) => {
  const { book_id } = req.body;
  const user_id = req.user.userId;

  const checkQuery =
    "SELECT * FROM sell_wishlist WHERE user_id = ? AND book_id = ?";
  db.query(checkQuery, [user_id, book_id], (err, results) => {
    if (err) {
      console.error("Error checking wishlist:", err);
      res.status(500).send(err);
    } else if (results.length > 0) {
      const deleteQuery =
        "DELETE FROM sell_wishlist WHERE user_id = ? AND book_id = ?";
      db.query(deleteQuery, [user_id, book_id], (err, result) => {
        if (err) {
          console.error("Error removing book from wishlist:", err);
          res.status(500).send(err);
        } else {
          res.send({ message: "Book removed from wishlist successfully!" });
        }
      });
    } else {
      const insertQuery =
        "INSERT INTO sell_wishlist (user_id, book_id) VALUES (?, ?)";
      db.query(insertQuery, [user_id, book_id], (err, result) => {
        if (err) {
          console.error("Error adding book to wishlist:", err);
          res.status(500).send(err);
        } else {
          res.send({ message: "Book added to wishlist successfully!" });
        }
      });
    }
  });
});

//all books from wishlist of a specific user
// app.get("/sell_wishlist", authenticateToken, (req, res) => {
//   const userId = req.user.userId;

//   const query = `
//       SELECT sell_wishlist.*
//       FROM sell_cart
//       JOIN sell_wishlist ON sell_cart.book_id = book_sell_inventory.id
//       WHERE sell_cart.user_id = ?
//     `;

//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching wishlist books:", err);
//       res.status(500).send(err);
//     } else {
//       res.send(results);
//     }
//   });
// });

app.get("/sell_wishlist", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  const query = `
      SELECT book_sell_inventory.*
      FROM sell_wishlist
      JOIN book_sell_inventory ON sell_wishlist.book_id = book_sell_inventory.id
      WHERE sell_wishlist.user_id = ?
    `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching wishlist books:", err);
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

//deleting book from wishlist

app.delete("/delete_buy_wishlist", authenticateToken, (req, res) => {
  const { bookIds } = req.body;
  const userId = req.user.userId;

  if (!Array.isArray(bookIds) || bookIds.length === 0) {
    return res
      .status(400)
      .send({ message: "No book IDs provided for deletion" });
  }

  const deleteQuery = `
      DELETE FROM sell_wishlist
      WHERE user_id = ? AND book_id IN (?)
    `;

  db.query(deleteQuery, [userId, bookIds], (err, result) => {
    if (err) {
      console.error("Error deleting books from wishlist:", err);
      res.status(500).send(err);
    } else if (result.affectedRows === 0) {
      res.status(404).send({ message: "No books found in wishlist to delete" });
    } else {
      res.send({ message: "Books deleted from wishlist successfully" });
    }
  });
});

//user wishlist
app.get("/wishlist", authenticateToken, (req, res) => {
  const user_id = req.user.userId;

  const query = "SELECT book_id FROM sell_wishlist WHERE user_id = ?";
  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error("Error fetching wishlist:", err);
      res.status(500).send(err);
    } else {
      const wishlist = results.map((row) => row.book_id);
      res.send(wishlist);
    }
  });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Error handling middleware
app.use((req, res, next) => {
  res.status(404).send({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
