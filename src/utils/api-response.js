exports.ok = (res, data, message = "success") => {
  return res.json({ message, data });
};

exports.created = (res, data, message = "created") => {
  return res.status(201).json({ message, data });
};

exports.badRequest = (res, message) => {
  return res.status(400).json({ message });
};

exports.unauthorized = (res, message = "Unauthorized") => {
  return res.status(401).json({ message });
};

exports.forbidden = (res, message = "Forbidden") => {
  return res.status(403).json({ message });
};

exports.notFound = (res, message = "Not found") => {
  return res.status(404).json({ message });
};

exports.serverError = (res, error) => {
  return res.status(500).json({ message: "Internal server error", error: error.message });
};