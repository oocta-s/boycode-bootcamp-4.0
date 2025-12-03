// Validate movie payload for create/update (POST/PUT)
module.exports = (req, res, next) => {
  const { title, genre, year, rating } = req.body || {};

  // title: required string
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({ message: 'Title is required and must be a non-empty string' });
  }

  // genre: required string
  if (!genre || typeof genre !== 'string' || genre.trim() === '') {
    return res.status(400).json({ message: 'Genre is required and must be a non-empty string' });
  }

  // year: required number (allow numeric string but normalize)
  if (year === undefined || year === null) {
    return res.status(400).json({ message: 'Year is required and must be a number' });
  }
  const yearNum = Number(year);
  if (Number.isNaN(yearNum) || !Number.isFinite(yearNum)) {
    return res.status(400).json({ message: 'Year must be a valid number' });
  }
  // normalize
  req.body.year = yearNum;

  // rating: optional, but if present must be a number between 0 and 5
  if (rating !== undefined && rating !== null && rating !== '') {
    const ratingNum = Number(rating);
    if (Number.isNaN(ratingNum) || ratingNum < 0 || ratingNum > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 0 and 5' });
    }
    req.body.rating = ratingNum;
  }

  next();
};
