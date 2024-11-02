const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const fs = require("fs");
const multer = require("multer");
const SSLCommerzPayment = require("sslcommerz-lts");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox

const SECRET_KEY = "Thesecretkey";

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
const port = process.env.PORT || 3002

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
    res.send("hi");
})

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

    db.query(createnewTableQuery, function(err, result) {
        if (err) {
            console.error("Table creation failed:", err);
            process.exit(1); // Exit the process with an error code
        } else {
            console.log("New Table created or already exists");
        }
    });

});

const sslcommerzDb = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'echoes_book'
}).promise();
const createBillsTable = `CREATE TABLE IF NOT EXISTS bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(255),
    name VARCHAR(255),
    address VARCHAR(255),
    status VARCHAR(50),
    amount DECIMAL(10, 2)
  );
  `
db.query(createBillsTable, (err, result) => {
    if (err) {
        console.error("Bills table creation failed:", err);
        process.exit(1);
    } else {
        console.log("Bills table created or already exists");
    }
});

app.get("/sslcommerz", (req, res) => {
    res.send({ store_id, store_passwd });
});

app.post("/sslcommerz/init", async(req, res) => {
    const { name, address, amount } = req.body;
    const tran_id = `TRANS_${Date.now()}`;
    const data = {
        store_id,
        store_passwd,
        total_amount: amount,
        cus_name: name,
        cus_add1: address,
        cus_email: "customer@example.com",
        cus_phone: "01711111111",
        shipping_method: "NO",
        product_name: "Book",
        product_category: "N/A",
        product_profile: "Books",
        currency: "BDT",
        tran_id,
        success_url: `http://localhost:${port}/sslcommerz/success/${tran_id}`,
        fail_url: `http://localhost:${port}/sslcommerz/fail`,
        cancel_url: `http://localhost:${port}/sslcommerz/fail`,
        emi_option: 0,
    };
    try {
        const query = `INSERT INTO bills (transaction_id, name, address, status, amount) VALUES (?, ?, ?, 'pending', ?)`;
        await sslcommerzDb.execute(query, [data.tran_id, name, address, data.total_amount]);
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        sslcz.init(data).then((apiResponse) => {
            let GatewayPageURL = apiResponse.GatewayPageURL;
            res.send({ url: GatewayPageURL });
            console.log("Redirecting to: ", GatewayPageURL);
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
});


app.get('/init', (req, res) => {
    const data = {
        total_amount: 100,
        currency: 'BDT',
        tran_id: 'REF123', // use unique tran_id for each api call
        success_url: 'http://localhost:3030/success',
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send(GatewayPageURL)
        console.log('Redirecting to: ', GatewayPageURL)
    });
})

app.post("/sslcommerz/success/:tran_id", async(req, res) => {
    const { tran_id } = req.params;

    try {
        // Update the bill status to 'paid' in the database
        const updateQuery = `UPDATE bills SET status = 'paid' WHERE transaction_id = ?`;
        const [result] = await sslcommerzDb.execute(updateQuery, [tran_id]);

        if (result.affectedRows > 0) {
            res.redirect(`http://localhost:5173/success/${tran_id}`);
        } else {
            res.status(404).send("Transaction not found");
        }
    } catch (error) {
        res.status(500).send("Error updating transaction status");
    }
});
app.post("/sslcommerz/fail", (req, res) => {
    res.redirect("http://localhost:5173/fail");
});
// Endpoint to get transaction details
app.get("/api/transaction/:tran_id", async(req, res) => {
    const { tran_id } = req.params;

    try {
        // Query to get transaction details from the database
        const query = `SELECT * FROM bills WHERE transaction_id = ?`;
        const [rows] = await sslcommerzDb.execute(query, [tran_id]);

        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.status(404).send('Transaction not found');
        }
    } catch (error) {
        console.error('Error fetching transaction details:', error);
        res.status(500).send('Error fetching transaction details');
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

db.query(createCartTableQuery, function(err, result) {
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

db.query(createWishlistTableQuery, function(err, result) {
    if (err) {
        console.error("Wishlist table creation failed:", err);
        process.exit(1); // Exit the process with an error code
    } else {
        console.log("Wishlist table created or already exists");
    }
});

const createCheckoutQuery = `
CREATE TABLE IF NOT EXISTS new_checkout (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone INT NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    total_payment DECIMAL(10, 2) NOT NULL,
    book_ids VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
)
`;

db.query(createCheckoutQuery, function(err, result) {
    if (err) {
        console.error("Checkout table creation failed:", err);
        process.exit(1); // Exit the process with an error code
    } else {
        console.log("new Checkout table created or already exists");
    }
});

const createTableQuery = `
        CREATE TABLE IF NOT EXISTS book_rent_inventory (
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

db.query(createTableQuery, function(err, result) {
    if (err) {
        console.error("Rent Table creation failed:", err);
        process.exit(1); // Exit the process with an error code
    } else {
        console.log("Rent Table created or already exists");
    }
});

const createRentCartTableQuery = `
CREATE TABLE IF NOT EXISTS rent_cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rent_days DECIMAL NOT NULL,
    total_price DECIMAL NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES book_rent_inventory(id)
)
`;

db.query(createRentCartTableQuery, function(err, result) {
    if (err) {
        console.error("Rent Cart table creation failed:", err);
        process.exit(1); // Exit the process with an error code
    } else {
        console.log("Rent Cart table created or already exists");
    }
});

const createRentWishlistTableQuery = `
CREATE TABLE IF NOT EXISTS rent_wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES book_rent_inventory(id)
)
`;

db.query(createRentWishlistTableQuery, function(err, result) {
    if (err) {
        console.error("Rent Wishlist table creation failed:", err);
        process.exit(1); // Exit the process with an error code
    } else {
        console.log("Rent Wishlist table created or already exists");
    }
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

app.post("/register", upload.single("ProfileImage"), async(req, res) => {
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

    db.query(SQL, values, async(err, results) => {
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

app.get("/book-sell/:id", (req, res) => {
    const { id } = req.params; // Corrected line
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
            insertQuery, [
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

app.post("/checkout", authenticateToken, (req, res) => {
    const {
        email,
        phone,
        shippingAddress,
        paymentMethod,
        totalPayment,
        bookIds,
    } = req.body;
    const userId = req.user.userId;

    const insertCheckoutQuery = `
      INSERT INTO new_checkout (user_id, email ,phone ,shipping_address, payment_method, total_payment, book_ids)
      VALUES (?, ? ,? ,?, ?, ?, ?)
    `;

    db.query(
        insertCheckoutQuery, [
            userId,
            email,
            phone,
            shippingAddress,
            paymentMethod,
            totalPayment,
            bookIds.join(","),
        ],
        (err, result) => {
            if (err) {
                console.error("Error during checkout:", err);
                return res.status(500).send("Checkout failed. Please try again.");
            }
            res.status(200).send("Checkout successful");
        }
    );
});

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

//wishlist to cart

app.post("/add-to-cart-from-wishlist", authenticateToken, (req, res) => {
    const { bookIds } = req.body;
    const userId = req.user.userId;

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
        return res.status(400).send({ message: "No book IDs provided" });
    }

    const insertQuery = "INSERT INTO sell_cart (user_id, book_id) VALUES ?";
    const deleteQuery =
        "DELETE FROM sell_wishlist WHERE user_id = ? AND book_id IN (?)";

    const insertValues = bookIds.map((bookId) => [userId, bookId]);

    db.query(insertQuery, [insertValues], (insertErr) => {
        if (insertErr) {
            console.error("Error adding books to cart:", insertErr);
            return res.status(500).send({ message: "Error adding books to cart" });
        }

        db.query(deleteQuery, [userId, bookIds], (deleteErr) => {
            if (deleteErr) {
                console.error("Error removing books from wishlist:", deleteErr);
                return res
                    .status(500)
                    .send({ message: "Error removing books from wishlist" });
            }

            res.send({ message: "Books moved to cart successfully!" });
        });
    });
});

// Post single book rent inventory item
app.post(
    "/rent-book",
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
            "INSERT INTO book_rent_inventory (user_id, book_title, author, published_date, description, image_url, category, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        db.query(
            insertQuery, [
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

// Get all rent books
app.get("/all_rent_books", (req, res) => {
    db.query("SELECT * FROM book_rent_inventory", (err, results) => {
        if (err) {
            console.error("Error fetching books:", err);
            res.status(500).send(err);
        } else {
            res.send(results);
        }
    });
});

//search rent book
app.get("/search-rent-books", (req, res) => {
    const { query } = req.query;
    const searchQuery = `
        SELECT * FROM book_rent_inventory
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

//get a rent book details
app.get("/book-rent/:id", (req, res) => {
    const { id } = req.params;
    console.log(`Fetching book rent inventory with ID: ${id}`);
    const selectQuery = "SELECT * FROM book_rent_inventory WHERE id = ?";
    db.query(selectQuery, [id], (err, result) => {
        if (err) {
            console.error("Error fetching book rent inventory:", err);
            res.status(500).send(err);
        } else if (result.length === 0) {
            console.log(`Book rent inventory with ID ${id} not found`);
            res.status(404).send({ message: "Book not found" });
        } else {
            console.log("Book rent inventory fetched successfully:", result[0]);
            res.send(result[0]);
        }
    });
});

//recently added rent books
app.get("/recent_rent_books", (req, res) => {
    const query = `
        SELECT * FROM book_rent_inventory
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

// adding book to sell cart

app.post("/add-to-rent-cart", authenticateToken, (req, res) => {
    const { book_id, rent_days, total_price } = req.body;
    const user_id = req.user.userId;

    console.log("Received data:", { user_id, book_id, rent_days, total_price });

    const insertQuery =
        "INSERT INTO rent_cart (user_id, book_id,rent_days,total_price) VALUES (?, ?, ?, ?)";
    db.query(
        insertQuery, [user_id, book_id, rent_days, total_price],
        (err, result) => {
            if (err) {
                console.error("Error adding book to cart:", err);
                res.status(500).send(err);
            } else {
                res.send({ message: "Book added to cart successfully!" });
            }
        }
    );
});

//all books from cart of a specific user
// app.get("/rent-cart", authenticateToken, (req, res) => {
//     const userId = req.user.userId;

//     const query = `
//         SELECT book_rent_inventory.*
//         FROM rent_cart
//         JOIN book_rent_inventory ON rent_cart.book_id = book_rent_inventory.id
//         WHERE rent_cart.user_id = ?
//       `;

//     db.query(query, [userId], (err, results) => {
//         if (err) {
//             console.error("Error fetching cart books:", err);
//             res.status(500).send(err);
//         } else {
//             res.send(results);
//         }
//     });
// });

app.get("/rent-cart", authenticateToken, (req, res) => {
    const userId = req.user.userId;

    const query = `
      SELECT book_rent_inventory.*, rent_cart.total_price, rent_cart.rent_days
      FROM rent_cart
      JOIN book_rent_inventory ON rent_cart.book_id = book_rent_inventory.id
      WHERE rent_cart.user_id = ?
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

app.delete("/delete_rent_cart", authenticateToken, (req, res) => {
    const { bookIds } = req.body;
    const userId = req.user.userId;

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
        return res
            .status(400)
            .send({ message: "No book IDs provided for deletion" });
    }

    const deleteQuery = `
        DELETE FROM rent_cart
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

app.post("/add-to-rent-wishlist", authenticateToken, (req, res) => {
    const { book_id } = req.body;
    const user_id = req.user.userId;

    const checkQuery =
        "SELECT * FROM rent_wishlist WHERE user_id = ? AND book_id = ?";
    db.query(checkQuery, [user_id, book_id], (err, results) => {
        if (err) {
            console.error("Error checking wishlist:", err);
            res.status(500).send(err);
        } else if (results.length > 0) {
            const deleteQuery =
                "DELETE FROM rent_wishlist WHERE user_id = ? AND book_id = ?";
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
                "INSERT INTO rent_wishlist (user_id, book_id) VALUES (?, ?)";
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

app.get("/rent_wishlist", authenticateToken, (req, res) => {
    const userId = req.user.userId;

    const query = `
        SELECT book_rent_inventory.*
        FROM rent_wishlist
        JOIN book_rent_inventory ON rent_wishlist.book_id = book_rent_inventory.id
        WHERE rent_wishlist.user_id = ?
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

app.delete("/delete_rent_wishlist", authenticateToken, (req, res) => {
    const { bookIds } = req.body;
    const userId = req.user.userId;

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
        return res
            .status(400)
            .send({ message: "No book IDs provided for deletion" });
    }

    const deleteQuery = `
        DELETE FROM rent_wishlist
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
app.get("/rent-wishlist", authenticateToken, (req, res) => {
    const user_id = req.user.userId;

    const query = "SELECT book_id FROM rent_wishlist WHERE user_id = ?";
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

//wishlist to cart

app.post("/add-to-rent-cart-from-wishlist", authenticateToken, (req, res) => {
    const { bookIds } = req.body;
    const userId = req.user.userId;

    if (!Array.isArray(bookIds) || bookIds.length === 0) {
        return res.status(400).send({ message: "No book IDs provided" });
    }

    const insertQuery = "INSERT INTO rent_cart (user_id, book_id) VALUES ?";
    const deleteQuery =
        "DELETE FROM rent_wishlist WHERE user_id = ? AND book_id IN (?)";

    const insertValues = bookIds.map((bookId) => [userId, bookId]);

    db.query(insertQuery, [insertValues], (insertErr) => {
        if (insertErr) {
            console.error("Error adding books to cart:", insertErr);
            return res.status(500).send({ message: "Error adding books to cart" });
        }

        db.query(deleteQuery, [userId, bookIds], (deleteErr) => {
            if (deleteErr) {
                console.error("Error removing books from wishlist:", deleteErr);
                return res
                    .status(500)
                    .send({ message: "Error removing books from wishlist" });
            }

            res.send({ message: "Books moved to cart successfully!" });
        });
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