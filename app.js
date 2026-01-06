const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();

// =========================
// MIDDLEWARES
// =========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ SESSION (MUST BE BEFORE ROUTES)
app.use(
  session({
    secret: "resort-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // MUST be false on Render
      maxAge: 1000 * 60 * 60 // 1 hour
    }
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

// ---------- REGISTER ----------
app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword]
    );

    res.redirect("/login");
  } catch (err) {
    console.error(err);
    res.send("Registration failed ❌");
  }
});

// ---------- LOGIN ----------
app.get("/login", (req, res) => {
  res.render("login");
});

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
      return res.send("Wrong password ❌");
    }

    // ✅ STORE SESSION
    req.session.user = {
      id: user.id,
      username: user.username
    };

    console.log("LOGIN SUCCESS:", req.session.user);

    res.redirect("/dashboard");

  } catch (err) {
    console.error(err);
    res.send("Login failed ❌");
  }
});

// ---------- DASHBOARD ----------
app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  res.render("dashboard", {
    username: req.session.user.username
  });
});

// ---------- LOGOUT ----------
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
