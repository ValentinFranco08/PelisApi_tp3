import { StyleSheet } from 'react-native';
import { useAuth } from '../useAuth';
import LoginForm from '../components/LoginForm';
import { useEffect } from 'react';
import { router } from 'expo-router';
import AuthBackground from '../components/AuthBackground';

export default function LoginScreen() {
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      // Redirect admins to the admin panel, regular users to the app home
      router.replace(user.role === 'admin' ? '/admin/users' : '/');
    }
  }, [user]);

  return (
    <AuthBackground>
      <LoginForm onSubmit={login} />
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