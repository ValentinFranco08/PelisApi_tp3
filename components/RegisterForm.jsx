import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import { router } from 'expo-router';
import { createUser } from '../db/auth';
import AppModal from './AppModal';
import { colors } from '../utils/commonStyles';

const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;
const MIN_USERNAME = 3;
const MIN_PASSWORD = 6;
const MIN_NAME = 3;

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ visible: false });

  const validate = () => {
    const name = formData.name.trim();
    const username = formData.username.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const lowerUsername = username.toLowerCase();

    if (!name || !username || !password || !confirmPassword) {
      return 'Por favor completá todos los campos';
    }

    if (name.length < MIN_NAME) {
      return `El nombre debe tener al menos ${MIN_NAME} caracteres`;
    }

    if (username.length < MIN_USERNAME) {
      return `El usuario debe tener al menos ${MIN_USERNAME} caracteres`;
    }

    if (!USERNAME_REGEX.test(username)) {
      return 'El usuario solo puede contener letras, números, punto, guion y guion bajo';
    }

    if (lowerUsername === 'admin') {
      return 'El nombre de usuario "admin" está reservado';
    }

    if (password.length < MIN_PASSWORD) {
      return `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`;
    }

    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden';
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await createUser({
        username: formData.username.trim(),
        password: formData.password,
        confirmPassword: undefined,
        name: formData.name.trim(),
        role: 'user', // Rol por defecto
      });

      setError('');
      setFormData({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
      });
      setModal({
        visible: true,
        title: 'Cuenta creada',
        message: 'Ya podés iniciar sesión con tus credenciales.',
        actions: [
          {
            text: 'Ir a iniciar sesión',
            onPress: () => router.replace('/login'),
          },
        ],
      });
    } catch (err) {
      const message = err?.message ?? '';
      if (message.includes('El nombre de usuario ya existe')) {
        setError('El nombre de usuario ya está registrado');
        return;
      }
      if (message.includes('UNIQUE')) {
        setError('El nombre de usuario ya está registrado');
        return;
      }
      setError('Ocurrió un error al crear la cuenta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor={colors.textSecondary}
        value={formData.name}
        onChangeText={(text) => {
          setFormData({ ...formData, name: text });
          if (error) setError('');
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor={colors.textSecondary}
        value={formData.username}
        onChangeText={(text) => {
          setFormData({ ...formData, username: text });
          if (error) setError('');
        }}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor={colors.textSecondary}
        value={formData.password}
        onChangeText={(text) => {
          setFormData({ ...formData, password: text });
          if (error) setError('');
        }}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor={colors.textSecondary}
        value={formData.confirmPassword}
        onChangeText={(text) => {
          setFormData({ ...formData, confirmPassword: text });
          if (error) setError('');
        }}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <Link href="/login" asChild>
        <TouchableOpacity>
          <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </Link>

      <AppModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        actions={modal.actions}
        onRequestClose={() => setModal((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: '#2f0d0d',
    borderColor: colors.error,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontWeight: '600',
    textAlign: 'center',
  },
});
