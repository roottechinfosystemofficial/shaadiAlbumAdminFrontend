const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error(err);
    const statusCode = err.statusCode || 500;

    if (
      typeof statusCode !== "number" ||
      statusCode < 100 ||
      statusCode > 599
    ) {
      res.status(500).json({
        error: "Internal Server Error",
        details: "An unexpected error occurred",
      });
    } else {
      res.status(statusCode).json({
        error: err.message || "An error occurred",
        code: err.code || undefined,
      });
    }
  });
};

export { asyncHandler };
