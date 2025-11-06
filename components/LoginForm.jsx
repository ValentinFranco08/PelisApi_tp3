import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '../utils/commonStyles';

export default function LoginForm({ onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    const normalizedUsername = username.trim();
    const normalizedPassword = password;

    if (!normalizedUsername || !normalizedPassword) {
      setError('Por favor completa todos los campos');
      return;
    }

    const result = await onSubmit(normalizedUsername, normalizedPassword);

    if (!result.success) {
      setError(result.error || 'Credenciales invalidas');
    } else {
      setError('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <Text style={styles.logoPrimary}>PELIS</Text>
        <Text style={styles.logoAccent}>API</Text>
        <Text style={styles.logoPlus}>+</Text>
      </View>

      <Text style={styles.title}>Iniciar Sesion</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        placeholderTextColor={colors.textSecondary}
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          if (error) setError('');
        }}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Contrasena"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (error) setError('');
        }}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Iniciar Sesion</Text>
      </TouchableOpacity>

      <Link href="/register" asChild>
        <TouchableOpacity>
          <Text style={styles.link}>No tienes cuenta? Registrate</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  logoPrimary: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 4,
  },
  logoAccent: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 4,
  },
  logoPlus: {
    color: colors.primary,
    fontSize: 40,
    fontWeight: '900',
    marginLeft: 2,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  input: {
    alignSelf: 'stretch',
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    alignSelf: 'stretch',
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
  error: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});
