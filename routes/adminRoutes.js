const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* ===== ADMIN AUTH ===== */
function isAdmin(req, res, next) {
  if (!req.session || req.session.role !== "admin") {
    return res.redirect("/login");
  }
  next();
}

/* ===== TEST ROUTE (VERY IMPORTANT) ===== */
router.get("/admin/test", (req, res) => {
  res.send("ADMIN ROUTES WORKING ✅");
});

/* ===== ADD RESORT PAGE ===== */
router.get("/admin/resorts/add", isAdmin, (req, res) => {
  res.render("addResort", { error: null });
});

module.exports = router;
