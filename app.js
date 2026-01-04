app.set("view engine", "ejs");
app.set("views", "views");

// Test route (already working)
app.get("/", (req, res) => {
  res.send("Resort Management Backend is Live 🚀");
});

// Page routes
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});
