import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'pelisapi_movies_db';

const parse = (value) => {
  try {
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error('Failed to parse movies from storage', e);
    return [];
  }
};

const readAll = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const arr = parse(raw);
  return Array.isArray(arr) ? arr : [];
};

const writeAll = async (arr) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch (e) {
    console.error('Failed to write movies to storage', e);
  }
};

const getNextId = (arr) => arr.reduce((max, it) => Math.max(max, Number(it.id) || 0), 0) + 1;

export async function initMoviesTable() {
  const movies = await readAll();
  if (!Array.isArray(movies)) {
    await writeAll([]);
  }
}

export async function fetchMovies() {
  const movies = await readAll();
  // order by viewedAt desc, id desc
  return movies
    .slice()
    .sort((a, b) => {
      const aTime = a.viewedAt ? Date.parse(a.viewedAt) : 0;
      const bTime = b.viewedAt ? Date.parse(b.viewedAt) : 0;
      if (aTime !== bTime) return bTime - aTime;
      return (b.id || 0) - (a.id || 0);
    });
}

export async function fetchMovieById(id) {
  const movies = await readAll();
  const nid = Number(id);
  return movies.find((m) => Number(m.id) === nid) ?? null;
}

export async function fetchMovieByTmdbId(tmdbId) {
  const movies = await readAll();
  return movies.find((m) => String(m.tmdbId) === String(tmdbId)) ?? null;
}

export async function createMovie(payload) {
  const movies = await readAll();
  const id = getNextId(movies);
  const now = new Date().toISOString();
  const record = {
    id,
    tmdbId: payload.tmdbId ?? null,
    title: payload.title ?? 'Sin titulo',
    overview: payload.overview ?? '',
    posterPath: payload.posterPath ?? '',
    rating: payload.rating ?? 0,
    genre: payload.genre ?? '',
    releaseDate: payload.releaseDate ?? '',
    runtime: payload.runtime ?? 0,
    voteAverage: payload.voteAverage ?? 0,
    voteCount: payload.voteCount ?? 0,
    year: payload.year ?? '',
    synopsis: payload.synopsis ?? '',
    viewedAt: payload.viewedAt ?? now,
    userRating: payload.userRating ?? 0,
    review: payload.review ?? '',
    reviewDate: payload.reviewDate ?? null,
  };
  movies.push(record);
  await writeAll(movies);
  return record;
}

export async function updateMovie(id, fields) {
  const movies = await readAll();
  const nid = Number(id);
  const idx = movies.findIndex((m) => Number(m.id) === nid);
  if (idx === -1) return null;
  const updated = { ...movies[idx], ...fields };
  // normalize some fields
  if (fields.userRating !== undefined) {
    const v = Number(fields.userRating);
    updated.userRating = Number.isFinite(v) ? Math.max(0, Math.min(100, Math.trunc(v))) : 0;
  }
  if (fields.review !== undefined) {
    updated.review = typeof fields.review === 'string' ? fields.review.trim() : '';
  }
  if (fields.reviewDate !== undefined) {
    updated.reviewDate = typeof fields.reviewDate === 'string' && fields.reviewDate.trim() !== '' ? fields.reviewDate : null;
  }
  updated.viewedAt = new Date().toISOString();
  movies[idx] = updated;
  await writeAll(movies);
  return updated;
}

export async function saveReview(movieId, { userRating, review }) {
  return updateMovie(movieId, { userRating, review, reviewDate: new Date().toISOString() });
}

export async function upsertFromTmdb(tmdbMovie) {
  await initMoviesTable();
  const existing = await fetchMovieByTmdbId(String(tmdbMovie.id ?? tmdbMovie.tmdbId ?? ''));
  const normalized = {
    tmdbId: String(tmdbMovie.id ?? tmdbMovie.tmdbId ?? ''),
    title: tmdbMovie.title ?? 'Sin titulo',
    overview: tmdbMovie.overview ?? '',
    posterPath: tmdbMovie.poster_path ?? tmdbMovie.posterPath ?? '',
    voteAverage: tmdbMovie.vote_average ?? 0,
    voteCount: tmdbMovie.vote_count ?? 0,
    releaseDate: tmdbMovie.release_date ?? '',
    runtime: tmdbMovie.runtime ?? 0,
    genres: tmdbMovie.genres ?? [],
    viewedAt: new Date().toISOString(),
  };

  if (!existing) {
    return createMovie(normalized);
  }

  return updateMovie(existing.id, normalized);
}

export async function removeMovie(id) {
  const movies = await readAll();
  const nid = Number(id);
  const filtered = movies.filter((m) => Number(m.id) !== nid);
  await writeAll(filtered);
}

export async function resetMovies() {
  await writeAll([]);
}
