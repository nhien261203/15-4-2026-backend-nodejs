const { unauthorized, forbidden } = require("../utils/api-response");
const { verifyToken } = require("../utils/security");

exports.authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return unauthorized(res, "Missing or invalid token");
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return unauthorized(res, "Invalid or expired token");
  }
};

exports.requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return forbidden(res, "Admin permission required");
  }

  return next();
};