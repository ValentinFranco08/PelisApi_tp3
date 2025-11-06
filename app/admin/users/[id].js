import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import UserForm from '../../../components/UserForm';
import { getUsers, updateUser } from '../../../db/auth';
import { router } from 'expo-router';
import Loading from '../../../components/Loading';

export default function EditUserScreen() {
  const { id } = useLocalSearchParams();
  const numericId = useMemo(() => Number(id), [id]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!Number.isFinite(numericId)) {
      alert('Identificador invalido');
      router.back();
      return;
    }
    loadUser();
  }, [numericId]);

  const loadUser = async () => {
    setLoading(true);
    try {
      const users = await getUsers();
      const userFound = users.find((item) => item.id === numericId);
      if (userFound) {
        setUser(userFound);
      } else {
        alert('Usuario no encontrado');
        router.back();
      }
    } catch (error) {
      console.error('Error loading user:', error);
      alert('Error al cargar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (userData) => {
    try {
      await updateUser(numericId, userData);
      router.back();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <UserForm onSubmit={handleSubmit} initialData={user} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
