// middlewares/auth.js

exports.ensureUser = (req, res, next) => {
  if (req.session.username && req.session.role === "user") {
    return next();
  }
  req.flash("error_msg", "Access denied");
  res.redirect("/admin/dashboard");
};

exports.ensureAdmin = (req, res, next) => {
  if (req.session.username && req.session.role === "admin") {
    return next();
  }
  req.flash("error_msg", "Access denied");
  res.redirect("/dashboard");
};