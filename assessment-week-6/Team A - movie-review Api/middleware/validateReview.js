const movies = require('../data/movie');

// Middleware to validate review payload and movie existence
module.exports = (req, res, next) => {
  const movieIdParam = req.params.movieId || req.params.id || req.params.movieId;
  const movieId = movieIdParam ? parseInt(movieIdParam, 10) : undefined;

  // If route includes a movieId param, ensure movie exists
  if (movieIdParam) {
    if (Number.isNaN(movieId)) {
      return res.status(400).json({ message: 'Invalid movieId parameter' });
    }
    const movieExists = movies.some(m => m.id === movieId);
    if (!movieExists) return res.status(404).json({ message: `Movie with id ${movieId} not found` });
  }

  const { reviewer, comment, stars } = req.body || {};

  if (!reviewer || typeof reviewer !== 'string' || reviewer.trim() === '') {
    return res.status(400).json({ message: 'Reviewer is required' });
  }

  if (!comment || typeof comment !== 'string' || comment.trim() === '') {
    return res.status(400).json({ message: 'Comment is required' });
  }

  if (stars === undefined || stars === null) {
    return res.status(400).json({ message: 'Stars is required' });
  }

  const starsNum = Number(stars);
  if (Number.isNaN(starsNum) || starsNum < 1 || starsNum > 5) {
    return res.status(400).json({ message: 'Stars must be a number between 1 and 5' });
  }

  // normalize stars to number
  req.body.stars = starsNum;

  next();
};
