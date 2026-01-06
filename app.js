const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const session = require("express-session");


dotenv.config();

const app = express();

// =========================
// MIDDLEWARES
// =========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "resort_secret_key",
    resave: false,
    saveUninitialized: false
  })
);


// =========================
// VIEW ENGINE
// =========================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// =========================
// DATABASE
// =========================
const db = require("./config/db");

// =========================
// ROUTES
// =========================

// HOME
app.get("/", (req, res) => {
  res.send("Resort Management System Backend is Live ✅");
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login");
});

// REGISTER PAGE
app.get("/register", (req, res) => {
  res.render("register");
});

// REGISTER POST
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    await db.query(sql, [username, hashedPassword]);

    res.send("User registered securely ✅");
  } catch (err) {
    console.error(err);
    res.status(500).send("Registration failed ❌");
  }
});

// LOGIN POST (OPTIONAL BASIC)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.send("User not found ❌");
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.send("Invalid password ❌");
    }

    // session start
    req.session.userId = user.id;
    req.session.username = user.username;

    res.send("Login successful 🔐");
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error ❌");
  }
});


// =========================
// DB TEST
// =========================
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS result");
    res.json({ status: "SUCCESS", rows });
  } catch (err) {
    res.status(500).json({ status: "FAILED", error: err.message });
  }
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
