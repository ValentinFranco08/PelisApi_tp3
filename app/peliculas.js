import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Loading from '../components/Loading';
import ErrorView from '../components/ErrorView';
import MovieCard from '../components/MovieCard';
import MovieReviewForm from '../components/MovieReviewForm';
import { upsertFromTmdb, saveReview } from '../db/movies';
import AppModal from '../components/AppModal';

export default function Peliculas() {
  const router = useRouter();
  const { id: idParam } = useLocalSearchParams();
  const movieId = useMemo(() => String(idParam || '122').trim(), [idParam]);
  const [pelicula, setPelicula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [savedMovie, setSavedMovie] = useState(null);
  const [modal, setModal] = useState({ visible: false });

  useEffect(() => {
    const controller = new AbortController();
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_KEY}`,
      },
      signal: controller.signal,
    };

    async function fetchMovie() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?language=es-ES`,
          options
        );
        const data = await res.json();

        if (!res.ok || data.success === false || data.status_code) {
          throw new Error(data.status_message || 'No se encontro la pelicula');
        }

        setPelicula(data);
      } catch (err) {
        setPelicula(null);
        setError(err.message || 'No se pudo cargar la pelicula');
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
    return () => controller.abort();
  }, [movieId]);

  async function handleSave() {
    if (!pelicula) {
      return;
    }

    try {
      setSaving(true);
      const saved = await upsertFromTmdb(pelicula);
      setSavedMovie(saved);
      setShowReviewForm(true);
      return saved;
    } catch (err) {
      setModal({
        visible: true,
        title: 'Ups',
        message: err?.message ?? 'No se pudo guardar',
        actions: [{ text: 'Ok' }],
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleReviewSubmit(review) {
    if (!savedMovie) {
      return;
    }

    try {
      setSaving(true);
      await saveReview(savedMovie.id, review);
      setShowReviewForm(false);
      setModal({
        visible: true,
        title: 'Opinion guardada',
        message: 'Tu resena se guardo correctamente',
        actions: [
          { text: 'Ver biblioteca', onPress: () => router.push('/biblioteca') },
          { text: 'Seguir' },
        ],
      });
    } catch (err) {
      setModal({
        visible: true,
        title: 'Ups',
        message: err?.message ?? 'No se pudo guardar la resena',
        actions: [{ text: 'Ok' }],
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backLink} onPress={() => router.push('/')}>
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        {loading && <Loading text="Cargando pelicula..." />}
        {!loading && error !== '' && <ErrorView message={error} />}
        {!loading && pelicula && (
          <View style={styles.cardWrapper}>
            <MovieCard movie={pelicula} onPress={() => router.push(`/detalle/${pelicula.id}`)} />
            {showReviewForm ? (
              <MovieReviewForm
                initialValues={savedMovie}
                onSubmit={handleReviewSubmit}
                submitLabel={saving ? 'Guardando...' : 'Deja tu opinion'}
              />
            ) : (
              <TouchableOpacity
                style={[styles.actionButton, saving && styles.actionButtonDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                <Text style={styles.actionText}>
                  {saving ? 'Guardando...' : 'Deja tu opinion'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
      <AppModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        actions={modal.actions}
        onRequestClose={() => setModal({ visible: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  content: {
    padding: 24,
    alignItems: 'center',
    gap: 24,
  },
  backLink: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontSize: 12,
  },
  cardWrapper: {
    width: '100%',
    alignItems: 'center',
    gap: 18,
  },
  actionButton: {
    backgroundColor: '#e50914',
    borderRadius: 999,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    minWidth: 260,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
