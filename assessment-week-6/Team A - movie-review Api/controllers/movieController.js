const movies = require('../data/movie');
const reviews = require('../data/review');

let results = movies.map(({ slug, ...others }) => ({ ...others }));

// Get all movies
exports.getAllMovies = (req, res) => {
    const genre = req.query.genre;
    const year = req.query.year;
    const rating = req.query['rating[gte]'];
    const sort = req.query.sort;
    const limit = req.query.limit;
    const page = req.query.page;
    if (genre) {
        results = results.filter(m => m.genre.toLowerCase() === genre.toLowerCase());
    }
    if (year) {
        results = results.filter(m => m.year === parseInt(year));
    }
    if (rating) {
        results = results.filter(m => m.rating >= parseFloat(rating));
    }
    if (sort)  {
        if (sort === 'year') {
            results = results.sort((a, b) => a.year - b.year);
        } 
        if (sort === 'rating') {
            results = results.sort((a, b) => b.rating - a.rating);
        }
    }
    if (limit && page) {
        const startIndex = (page - 1) * limit;
        results = results.slice(startIndex, startIndex + parseInt(limit));
    }

    
    if (results.length === 0) {
        return res.status(200).json({ total: 0, results: [], message: 'No movies found matching the criteria' });
    }
    res.status(200).json({ total: results.length, results });
};

// Get movie by Id
exports.getMovieById = (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = results.find(m => m.id === movieId);
    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }
    const movieReviews = reviews.filter(r => r.movieId === movieId);
    res.status(200).json({ ...movie, reviews: movieReviews });
}

// Update Movie (PUT)
exports.updateMovie = (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = results.findIndex(m => m.id === movieId);
    if (movieIndex === -1) {
        return res.status(404).json({ message: 'Movie not found' });
    }
    const updatedMovie = { ...results[movieIndex], ...req.body };
    res.status(200).json(updatedMovie);
}

//  Update Movie (PATCH)
exports.partialUpdateMovie = (req, res) => {
    const movieId = parseInt(req.params.id);
    const movieIndex = results.findIndex(m => m.id === movieId);
    if (movieIndex === -1) {

        return res.status(404).json({ message: 'Movie not found' });
    }
    const updatedMovie = { ...results[movieIndex], ...req.body };
    res.status(200).json(updatedMovie);
}

// Bonus Feature: Get top rated movies
exports.getTopRatedMovies = (req, res) => {
    const topRatedMovies = results.filter(m => m.rating >= 4.5);
    res.status(200).json({ total: topRatedMovies.length, results: topRatedMovies });
}

// Bonus Feature: Get movie stats(number of reviews, average rating)
exports.getMovieStats = (req, res) => {
    const movieId = parseInt(req.params.id);
    const movie = results.find(m => m.id === movieId);
    if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
    }
    const movieReviews = reviews.filter(r => r.movieId === movieId);
    const numberOfReviews = movieReviews.length;
    const averageRating = numberOfReviews > 0 ? movieReviews.reduce((acc, curr) => acc + curr.rating, 0) / numberOfReviews : 0;
    res.status(200).json({ movieId, numberOfReviews, averageRating: averageRating.toFixed(2) });
}

