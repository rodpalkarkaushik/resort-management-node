const pool = require("../config/db");

/* ADMIN DASHBOARD */
exports.dashboard = async (req, res) => {
  res.render("adminDashboard");
};

/* VIEW ALL RESORTS */
exports.viewResorts = async (req, res) => {
  const result = await pool.query("SELECT * FROM resorts ORDER BY id");
  res.render("adminResorts", { resorts: result.rows });
};

/* ADD RESORT PAGE */
exports.addResortPage = (req, res) => {
  res.render("adminAddResort");
};

/* ADD RESORT – with multiple images */
exports.addResort = async (req, res) => {
  const { name, price, image_url, image_url_2, image_url_3, image_url_4, contact, address, description } = req.body;

  await pool.query(
    `INSERT INTO resorts (name, price, image_url, image_url_2, image_url_3, image_url_4, contact, address, description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [name, price, image_url, image_url_2, image_url_3, image_url_4, contact, address, description]
  );

  res.redirect("/admin/resorts");
};

/* EDIT RESORT PAGE */
exports.editResortPage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM resorts WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.send("Resort not found");
    }

    res.render("adminEditResort", { resort: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.send("Error loading resort");
  }
};

/* UPDATE RESORT – with multiple images */
exports.updateResort = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image_url, image_url_2, image_url_3, image_url_4, contact, address, description } = req.body;

    await pool.query(
      `UPDATE resorts 
       SET name=$1, price=$2, image_url=$3, image_url_2=$4, image_url_3=$5, image_url_4=$6, contact=$7, address=$8, description=$9 
       WHERE id=$10`,
      [name, price, image_url, image_url_2, image_url_3, image_url_4, contact, address, description, id]
    );

    res.redirect("/admin/resorts");
  } catch (err) {
    console.error(err);
    res.send("Error updating resort");
  }
};

/* DELETE RESORT */
exports.deleteResort = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM resorts WHERE id = $1", [id]);
    res.redirect("/admin/resorts");
  } catch (err) {
    console.error(err);
    res.send("Error deleting resort");
  }
};

/* VIEW BOOKINGS ✅ */
exports.viewBookings = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings ORDER BY booking_date DESC"
    );
    res.render("adminBookings", { bookings: result.rows });
  } catch (err) {
    console.error(err);
    res.send("Error loading bookings");
  }
};
exports.dashboard = async (req, res) => {
  try {
    const result = await pool.query("SELECT image_url FROM resorts WHERE image_url IS NOT NULL");
    const images = result.rows.map(r => r.image_url);

    res.render("adminDashboard", {
      resortImages: images,   // ✅ now defined
      username: req.session.username
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading admin dashboard");
  }
};
/* UPDATE BOOKING STATUS – APPROVE or DECLINE */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    let status = "Pending";
    if (action === "approve") status = "Approved";
    if (action === "decline") status = "Cancelled";

    await pool.query(
      "UPDATE bookings SET status=$1 WHERE id=$2",
      [status, id]
    );

    res.redirect("/admin/bookings");
  } catch (err) {
    console.error(err);
    res.send("Error updating booking status");
  }
};