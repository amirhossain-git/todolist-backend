function errorHandler(err, req, res, next) {
  const statusCode = Number(err.statusCode) || 500;
  const message = err.message || "Internal Server Error";

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      details: Object.values(err.errors).map((e) => e.message)
    });
  }

  // Mongoose cast error (e.g. invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid id format" });
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {})
  });
}

module.exports = { errorHandler };

