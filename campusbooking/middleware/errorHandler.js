function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // PostgreSQL unique violation
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Duplicate entry: a record with this value already exists' });
  }

  // PostgreSQL foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({ error: 'Invalid reference: related record does not exist' });
  }

  // PostgreSQL check constraint violation
  if (err.code === '23514') {
    return res.status(400).json({ error: 'Invalid value: check constraint violated' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
