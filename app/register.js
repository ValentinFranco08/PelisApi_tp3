import { StyleSheet } from 'react-native';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../useAuth';
import { useEffect } from 'react';
import { router } from 'expo-router';
import AuthBackground from '../components/AuthBackground';

export default function RegisterScreen() {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Si el usuario ya está logueado, redirigir según su rol
      router.replace(user.role === 'admin' ? '/admin/users' : '/peliculas');
    }
  }, [user]);

  return (
    <AuthBackground>
      <RegisterForm />
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});