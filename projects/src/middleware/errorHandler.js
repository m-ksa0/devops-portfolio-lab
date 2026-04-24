function errorHandler(err, req, res, next) {
  req.log?.error({ err }, 'Unhandled application error');

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
