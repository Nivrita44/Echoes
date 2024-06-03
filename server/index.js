const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

app.use(cors());
app.use(express.json());

app.listen(3002, () => {
    console.log("Server is running on port 3002");
});

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'echoes_book',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.post('/register', async(req, res) => {
    const { Email, RegNo, UserName, Password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(Password, 10);
        const SQL = 'INSERT INTO users (email, regNo, username, password) VALUES (?, ?, ?, ?)';
        const values = [Email, RegNo, UserName, hashedPassword];

        db.query(SQL, values, (err, results) => {
            if (err) {
                console.error('Error inserting user:', err);
                res.status(500).send(err);
            } else {
                console.log("User inserted successfully!");
                res.status(200).send({ message: 'User added' });
            }
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).send({ error: 'Error registering user' });
    }
});

app.post('/login', (req, res) => {
    const { LoginEmail, LoginPassword } = req.body;

    const SQL = 'SELECT * FROM users WHERE email = ?';
    const values = [LoginEmail];

    db.query(SQL, values, async(err, results) => {
        if (err) {
            console.error('Error during login:', err);
            res.status(500).send({ error: err });
        } else if (results.length > 0) {
            const user = results[0];
            const isMatch = await bcrypt.compare(LoginPassword, user.password);
            if (isMatch) {
                res.status(200).send(user);
            } else {
                res.status(400).send({ message: "Email and password don't match!" });
            }
        } else {
            res.status(400).send({ message: "Email and password don't match!" });
        }
    });
});