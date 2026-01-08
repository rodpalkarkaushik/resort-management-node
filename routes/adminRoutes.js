const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

/* ADMIN DASHBOARD */
router.get("/admin/dashboard", adminController.dashboard);

/* RESORTS */
router.get("/admin/resorts", adminController.viewResorts);
router.get("/admin/resorts/add", adminController.addResortPage);
router.post("/admin/resorts/add", adminController.addResort);
router.get("/admin/resorts/edit/:id", adminController.editResortPage);
router.post("/admin/resorts/edit/:id", adminController.updateResort);
router.get("/admin/resorts/delete/:id", adminController.deleteResort);

/* BOOKINGS */
router.get("/admin/bookings", adminController.viewBookings);
router.post("/admin/bookings/status/:id", adminController.updateBookingStatus);

module.exports = router;