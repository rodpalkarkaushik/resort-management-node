const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const flash = require("connect-flash");

dotenv.config();
const app = express();

const pool = require("./config/db");

/* MIDDLEWARE */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    store: new pgSession({
      pool,
      tableName: "session"
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Flash messages
app.use(flash());
app.use((req, res, next) => {
  // Normalize flash arrays into single strings
  res.locals.success_msg = req.flash("success_msg")[0] || null;
  res.locals.error_msg = req.flash("error_msg")[0] || null;
  res.locals.username = req.session.username || null;
  next();
});

/* VIEW ENGINE */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ROUTES */
app.use(require("./routes/authRoutes"));
app.use(require("./routes/userRoutes"));
app.use(require("./routes/adminRoutes"));

/* ROOT – Public Homepage */
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM resorts ORDER BY id");
    res.render("home", {
      resorts: result.rows,
      username: req.session.username || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading homepage");
  }
});

/* LOGOUT */
app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});

/* SERVER */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("✅ Server running on port", PORT));