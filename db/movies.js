import * as SQLite from "expo-sqlite";
import { Platform } from 'react-native';
import * as webMovies from './webMovies';

let dbPromise;

async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync("peliculas.db");
  }
  return dbPromise;
}

export async function initMoviesTable() {
  if (Platform.OS === 'web') {
    return webMovies.initMoviesTable();
  }

  const db = await getDb();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tmdbId TEXT,
      title TEXT NOT NULL,
      overview TEXT DEFAULT '',
      posterPath TEXT DEFAULT '',
      rating INTEGER DEFAULT 0,
      genre TEXT DEFAULT '',
      releaseDate TEXT DEFAULT '',
      runtime INTEGER DEFAULT 0,
      voteAverage REAL DEFAULT 0,
      voteCount INTEGER DEFAULT 0,
      year TEXT DEFAULT '',
      synopsis TEXT DEFAULT '',
      viewedAt TEXT DEFAULT '',
      userRating INTEGER DEFAULT 0,
      review TEXT DEFAULT '',
      reviewDate TEXT DEFAULT NULL
    );
  `);

  const columns = await db.getAllAsync("PRAGMA table_info(movies)");
  const columnSet = new Set(columns.map((col) => col.name));

  async function ensureColumn(name, definition) {
    if (!columnSet.has(name)) {
      await db.execAsync(`ALTER TABLE movies ADD COLUMN ${definition}`);
      columnSet.add(name);
    }
  }

  async function normalizeColumn(name, sql) {
    if (columnSet.has(name) && sql) {
      await db.execAsync(sql);
    }
  }

  await ensureColumn("tmdbId", "tmdbId TEXT");
  await ensureColumn("overview", "overview TEXT");
  await ensureColumn("posterPath", "posterPath TEXT");
  await ensureColumn("rating", "rating INTEGER");
  await ensureColumn("genre", "genre TEXT");
  await ensureColumn("releaseDate", "releaseDate TEXT");
  await ensureColumn("runtime", "runtime INTEGER");
  await ensureColumn("voteAverage", "voteAverage REAL");
  await ensureColumn("voteCount", "voteCount INTEGER");
  await ensureColumn("year", "year TEXT");
  await ensureColumn("synopsis", "synopsis TEXT");
  await ensureColumn("viewedAt", "viewedAt TEXT");

  await normalizeColumn("overview", "UPDATE movies SET overview = '' WHERE overview IS NULL");
  await normalizeColumn("posterPath", "UPDATE movies SET posterPath = '' WHERE posterPath IS NULL");
  await normalizeColumn("rating", "UPDATE movies SET rating = 0 WHERE rating IS NULL");
  await normalizeColumn("genre", "UPDATE movies SET genre = '' WHERE genre IS NULL");
  await normalizeColumn("releaseDate", "UPDATE movies SET releaseDate = '' WHERE releaseDate IS NULL");
  await normalizeColumn("runtime", "UPDATE movies SET runtime = 0 WHERE runtime IS NULL");
  await normalizeColumn("voteAverage", "UPDATE movies SET voteAverage = 0 WHERE voteAverage IS NULL");
  await normalizeColumn("voteCount", "UPDATE movies SET voteCount = 0 WHERE voteCount IS NULL");
  await normalizeColumn("year", "UPDATE movies SET year = '' WHERE year IS NULL");
  await normalizeColumn("synopsis", "UPDATE movies SET synopsis = '' WHERE synopsis IS NULL");
  await normalizeColumn(
    "viewedAt",
    "UPDATE movies SET viewedAt = datetime('now') WHERE viewedAt IS NULL OR viewedAt = ''"
  );

  await ensureColumn("userRating", "userRating INTEGER DEFAULT 0");
  await ensureColumn("review", "review TEXT DEFAULT ''");
  await ensureColumn("reviewDate", "reviewDate TEXT DEFAULT NULL");

  await normalizeColumn("userRating", "UPDATE movies SET userRating = 0 WHERE userRating IS NULL");
  await normalizeColumn("review", "UPDATE movies SET review = '' WHERE review IS NULL");
}

export async function fetchMovies() {
  if (Platform.OS === 'web') {
    return webMovies.fetchMovies();
  }

  const db = await getDb();
  return db.getAllAsync(
    "SELECT * FROM movies ORDER BY datetime(viewedAt) DESC, id DESC"
  );
}

export async function fetchMovieById(id) {
  if (Platform.OS === 'web') {
    return webMovies.fetchMovieById(id);
  }

  const db = await getDb();
  return db.getFirstAsync("SELECT * FROM movies WHERE id = ?", id);
}

export async function fetchMovieByTmdbId(tmdbId) {
  if (Platform.OS === 'web') {
    return webMovies.fetchMovieByTmdbId(tmdbId);
  }

  const db = await getDb();
  return db.getFirstAsync("SELECT * FROM movies WHERE tmdbId = ?", tmdbId);
}

export async function createMovie({
  tmdbId = null,
  title,
  overview = "",
  posterPath = "",
  rating = 0,
  genre = "",
  releaseDate = "",
  runtime = 0,
  voteAverage = 0,
  voteCount = 0,
  year = "",
  synopsis = "",
  viewedAt = new Date().toISOString(),
  userRating = 0,
  review = "",
  reviewDate = null,
}) {
  const normalizedGenre =
    Array.isArray(genre) && genre.length > 0
      ? genre
          .map((item) => {
            if (!item) return "";
            if (typeof item === "string") return item;
            if (typeof item === "object" && item !== null) {
              return item.name ?? "";
            }
            return "";
          })
          .filter(Boolean)
          .join(", ")
      : typeof genre === "string"
      ? genre
      : "";

  const normalizedReleaseDate =
    typeof releaseDate === "string" ? releaseDate.trim() : "";
  const normalizedRuntime = Number.isFinite(Number(runtime))
    ? Math.max(0, Math.trunc(Number(runtime)))
    : 0;
  const normalizedVoteAverage = Number.isFinite(Number(voteAverage))
    ? Number(voteAverage)
    : 0;
  const normalizedVoteCount = Number.isFinite(Number(voteCount))
    ? Math.max(0, Math.trunc(Number(voteCount)))
    : 0;
  const normalizedYear =
    typeof year === "string" && year.trim() !== ""
      ? year.trim()
      : normalizedReleaseDate
      ? normalizedReleaseDate.slice(0, 4)
      : "";
  const normalizedRating = Number.isFinite(Number(rating))
    ? Math.max(0, Math.min(100, Math.trunc(Number(rating))))
    : 0;
  const normalizedSynopsis =
    typeof synopsis === "string" && synopsis.trim() !== ""
      ? synopsis.trim()
      : typeof overview === "string"
      ? overview.trim()
      : "";

  if (Platform.OS === 'web') {
    return webMovies.createMovie({
      tmdbId,
      title,
      overview,
      posterPath,
      rating: normalizedRating,
      genre: typeof normalizedGenre === "string" ? normalizedGenre.trim() : "",
      releaseDate: normalizedReleaseDate,
      runtime: normalizedRuntime,
      voteAverage: normalizedVoteAverage,
      voteCount: normalizedVoteCount,
      year: normalizedYear,
      synopsis: normalizedSynopsis,
      viewedAt,
      userRating,
      review,
      reviewDate,
    });
  }

  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO movies (
        tmdbId,
        title,
        overview,
        posterPath,
        rating,
        genre,
        releaseDate,
        runtime,
        voteAverage,
        voteCount,
        year,
        synopsis,
        viewedAt,
        userRating,
        review,
        reviewDate
     )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    tmdbId,
    title,
    overview,
    posterPath,
    normalizedRating,
    typeof normalizedGenre === "string" ? normalizedGenre.trim() : "",
    normalizedReleaseDate,
    normalizedRuntime,
    normalizedVoteAverage,
    normalizedVoteCount,
    normalizedYear,
    normalizedSynopsis,
    viewedAt,
    userRating,
    review,
    reviewDate
  );
  return fetchMovieById(result.lastInsertRowId);
}

export async function updateMovie(id, fields) {
  if (Platform.OS === 'web') {
    return webMovies.updateMovie(id, fields);
  }

  const db = await getDb();
  const normalizedFields = { ...fields };
  if (Object.prototype.hasOwnProperty.call(normalizedFields, "genre")) {
    const maybeGenre = normalizedFields.genre;
    normalizedFields.genre =
      Array.isArray(maybeGenre) && maybeGenre.length > 0
        ? maybeGenre
            .map((item) => {
              if (!item) return "";
              if (typeof item === "string") return item;
              if (typeof item === "object" && item !== null) {
                return item.name ?? "";
              }
              return "";
            })
            .filter(Boolean)
            .join(", ")
        : typeof maybeGenre === "string"
        ? maybeGenre.trim()
        : "";
  }

  if (Object.prototype.hasOwnProperty.call(normalizedFields, "rating")) {
    const value = Number(normalizedFields.rating);
    normalizedFields.rating = Number.isFinite(value)
      ? Math.max(0, Math.min(100, Math.trunc(value)))
      : 0;
  }

  if (Object.prototype.hasOwnProperty.call(normalizedFields, "runtime")) {
    const value = Number(normalizedFields.runtime);
    normalizedFields.runtime = Number.isFinite(value)
      ? Math.max(0, Math.trunc(value))
      : 0;
  }

  if (Object.prototype.hasOwnProperty.call(normalizedFields, "voteAverage")) {
    const value = Number(normalizedFields.voteAverage);
    normalizedFields.voteAverage = Number.isFinite(value) ? value : 0;
  }

  if (Object.prototype.hasOwnProperty.call(normalizedFields, "voteCount")) {
    const value = Number(normalizedFields.voteCount);
    normalizedFields.voteCount = Number.isFinite(value)
      ? Math.max(0, Math.trunc(value))
      : 0;
  }

  if (Object.prototype.hasOwnProperty.call(normalizedFields, "releaseDate")) {
    const value = normalizedFields.releaseDate;
    normalizedFields.releaseDate =
      typeof value === "string" ? value.trim() : "";
  }

  if (Object.prototype.hasOwnProperty.call(normalizedFields, "synopsis")) {
    const value = normalizedFields.synopsis;
    normalizedFields.synopsis =
      typeof value === "string" && value.trim() !== ""
        ? value.trim()
        : typeof normalizedFields.overview === "string"
        ? normalizedFields.overview.trim()
        : "";
  }

  if (Object.prototype.hasOwnProperty.call(normalizedFields, "year")) {
    const value = normalizedFields.year;
    normalizedFields.year =
      typeof value === "string" && value.trim() !== ""
        ? value.trim()
        : normalizedFields.releaseDate
        ? normalizedFields.releaseDate.slice(0, 4)
        : "";
  }

  if (Object.prototype.hasOwnProperty.call(normalizedFields, "userRating")) {
    const value = Number(normalizedFields.userRating);
    normalizedFields.userRating = Number.isFinite(value)
      ? Math.max(0, Math.min(100, Math.trunc(value)))
      : 0;
  }

  if (Object.prototype.hasOwnProperty.call(normalizedFields, "review")) {
    const value = normalizedFields.review;
    normalizedFields.review = typeof value === "string" ? value.trim() : "";
  }

  if (Object.prototype.hasOwnProperty.call(normalizedFields, "reviewDate")) {
    const value = normalizedFields.reviewDate;
    normalizedFields.reviewDate = typeof value === "string" && value.trim() !== "" ? value.trim() : null;
  }

  const keys = Object.keys(normalizedFields);
  if (keys.length === 0) return fetchMovieById(id);

  const setters = keys.map((key) => `${key} = ?`).join(", ");
  const values = keys.map((key) => normalizedFields[key]);

  await db.runAsync(
    `UPDATE movies SET ${setters}, viewedAt = ? WHERE id = ?`,
    ...values,
    new Date().toISOString(),
    id
  );
  return fetchMovieById(id);
}

export async function saveReview(movieId, { userRating, review }) {
  if (Platform.OS === 'web') {
    return webMovies.saveReview(movieId, { userRating, review });
  }

  const db = await getDb();
  await db.runAsync(
    `UPDATE movies SET 
     userRating = ?, 
     review = ?,
     reviewDate = datetime('now')
     WHERE id = ?`,
    userRating,
    review,
    movieId
  );
  return fetchMovieById(movieId);
}

export async function upsertFromTmdb({
  id: tmdbId,
  title,
  overview,
  poster_path: posterPath,
  vote_average,
  vote_count,
  release_date: releaseDate,
  runtime,
  genres = [],
}) {
  await initMoviesTable();
  const existing = await fetchMovieByTmdbId(String(tmdbId));
  const genreNames =
    Array.isArray(genres) && genres.length > 0
      ? genres
          .map((genre) => (genre && typeof genre === "object" ? genre.name : undefined))
          .filter(Boolean)
          .join(", ")
      : "";
  const releaseDateValue = typeof releaseDate === "string" ? releaseDate : "";
  const voteAverageValue = Number.isFinite(Number(vote_average))
    ? Number(vote_average)
    : 0;
  const voteCountValue = Number.isFinite(Number(vote_count))
    ? Math.max(0, Math.trunc(Number(vote_count)))
    : 0;
  const runtimeValue = Number.isFinite(Number(runtime))
    ? Math.max(0, Math.trunc(Number(runtime)))
    : 0;
  const normalized = {
    tmdbId: String(tmdbId),
    title: title ?? "Sin titulo",
    overview: overview ?? "",
    posterPath: posterPath ?? "",
    rating: Math.round((voteAverageValue ?? 0) * 10),
    genre: genreNames,
    releaseDate: releaseDateValue,
    runtime: runtimeValue,
    voteAverage: voteAverageValue,
    voteCount: voteCountValue,
    year: releaseDateValue ? releaseDateValue.slice(0, 4) : "",
    synopsis: overview ?? "",
    viewedAt: new Date().toISOString(),
  };

  if (!existing) {
    return createMovie(normalized);
  }

  return updateMovie(existing.id, normalized);
}

export async function removeMovie(id) {
  if (Platform.OS === 'web') {
    return webMovies.removeMovie(id);
  }

  const db = await getDb();
  await db.runAsync("DELETE FROM movies WHERE id = ?", id);
}

export async function resetMovies() {
  if (Platform.OS === 'web') {
    return webMovies.resetMovies();
  }

  const db = await getDb();
  await db.execAsync("DELETE FROM movies");
}




