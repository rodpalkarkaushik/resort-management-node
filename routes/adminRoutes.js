const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* =========================
   ADMIN AUTH MIDDLEWARE
========================= */
const isAdmin = (req, res, next) => {
  if (!req.session.userId || req.session.role !== "admin") {
    return res.redirect("/login");
  }
  next();
};

/* =========================
   ADD RESORT FORM
========================= */
router.get("/admin/resorts/add", isAdmin, (req, res) => {
  res.render("addResort", { error: null });
});

/* =========================
   SAVE RESORT
========================= */
router.post("/admin/resorts/add", isAdmin, async (req, res) => {
  const { name, price, image_url, description } = req.body;

  try {
    await pool.query(
      "INSERT INTO resorts (name, price, image_url, description) VALUES ($1,$2,$3,$4)",
      [name, price, image_url, description]
    );
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.render("addResort", { error: "Failed to add resort" });
  }
});

/* =========================
   VIEW RESORTS
========================= */
router.get("/admin/resorts", isAdmin, async (req, res) => {
  const result = await pool.query("SELECT * FROM resorts ORDER BY id DESC");
  res.render("adminResorts", { resorts: result.rows });
});

/* =========================
   DELETE RESORT
========================= */
router.post("/admin/resorts/delete/:id", isAdmin, async (req, res) => {
  await pool.query("DELETE FROM resorts WHERE id=$1", [req.params.id]);
  res.redirect("/admin/dashboard");
});

module.exports = router;
