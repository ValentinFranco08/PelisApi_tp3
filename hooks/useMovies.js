import { useCallback, useEffect, useRef, useState } from "react";
import {
  initMoviesTable,
  fetchMovies,
  fetchMovieById,
  createMovie,
  updateMovie,
  removeMovie,
  upsertFromTmdb,
  saveReview as saveReviewDb,
} from "../db/movies";

function useMountedState(initialValue) {
  const [state, setState] = useState(initialValue);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const setSafeState = useCallback((value) => {
    if (!mountedRef.current) return;
    setState(value);
  }, []);

  return [state, setSafeState];
}

export function useMovies() {
  const [movies, setMovies] = useMountedState([]);
  const [loading, setLoading] = useMountedState(true);
  const [error, setError] = useMountedState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      await initMoviesTable();
      const data = await fetchMovies();
      setMovies(data);
    } catch (err) {
      setError(err?.message ?? "No se pudo cargar la biblioteca");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setMovies]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(async (payload) => {
    await createMovie(payload);
    await load();
  }, [load]);

  const update = useCallback(async (id, payload) => {
    await updateMovie(id, payload);
    await load();
  }, [load]);

  const remove = useCallback(async (id) => {
    await removeMovie(id);
    await load();
  }, [load]);

  const saveFromTmdb = useCallback(async (tmdbMovie) => {
    const saved = await upsertFromTmdb(tmdbMovie);
    await load();
    return saved;
  }, [load]);

  const saveReview = useCallback(async (movieId, review) => {
    await saveReviewDb(movieId, review);
    await load();
  }, [load]);

  return {
    movies,
    loading,
    error,
    refresh: load,
    create,
    update,
    remove,
    saveFromTmdb,
    saveReview,
  };
}

export function useMovieById(id) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const rawId = Array.isArray(id) ? (id.length > 0 ? id[0] : undefined) : id;

    if (rawId === undefined || rawId === null || rawId === "") {
      setMovie(null);
      setError("");
      setLoading(false);
      return () => {
        active = false;
      };
    }

    const numericId = Number(rawId);
    if (!Number.isFinite(numericId)) {
      setMovie(null);
      setLoading(false);
      setError("Identificador invalido");
      return () => {
        active = false;
      };
    }

    async function load() {
      try {
        setLoading(true);
        setError("");
        await initMoviesTable();
        const record = await fetchMovieById(numericId);
        if (active) {
          setMovie(record ?? null);
          if (!record) {
            setError("No encontramos la pelicula");
          }
        }
      } catch (err) {
        if (active) {
          setError(err?.message ?? "No se pudo cargar la pelicula");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [id]);

  return { movie, loading, error };
}
