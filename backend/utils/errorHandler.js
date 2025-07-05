const errorHandler = (customError, err, req, res) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
  }

  res.status(statusCode).json({
    message: customError.message || "An error occurred",
    error: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });

  // Optional: Log errors to console for debugging
  console.error(`Error: ${err.message}`);
};

export default errorHandler;
