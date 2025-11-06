import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { adminStyles } from '../utils/adminStyles';
import { colors } from '../utils/commonStyles';

const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;
const MIN_USERNAME = 3;
const MIN_PASSWORD = 6;
const MIN_NAME = 3;

export default function UserForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    username: initialData?.username ?? '',
    password: '',
    confirmPassword: '',
    name: initialData?.name ?? '',
    role: initialData?.role ?? 'user',
  });
  const [error, setError] = useState('');
  const isSeedAdmin = initialData?.username === 'admin';

  const setField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (error) setError('');
  };

  const validate = () => {
    const username = formData.username.trim();
    const name = formData.name.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const lowerUsername = username.toLowerCase();

    if (!username || !name) {
      return 'Por favor completa los campos requeridos';
    }

    if (name.length < MIN_NAME) {
      return `El nombre debe tener al menos ${MIN_NAME} caracteres`;
    }

    if (username.length < MIN_USERNAME) {
      return `El usuario debe tener al menos ${MIN_USERNAME} caracteres`;
    }

    if (!USERNAME_REGEX.test(username)) {
      return 'El usuario solo puede contener letras, numeros, punto, guion y guion bajo';
    }

    if (!isSeedAdmin && lowerUsername === 'admin') {
      return 'El nombre de usuario "admin" esta reservado';
    }

    if (!initialData && password.length < MIN_PASSWORD) {
      return `La contrasena debe tener al menos ${MIN_PASSWORD} caracteres`;
    }

    if (initialData && password && password.length < MIN_PASSWORD) {
      return `La nueva contrasena debe tener al menos ${MIN_PASSWORD} caracteres`;
    }

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        return 'Las contraseñas no coinciden';
      }
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
      await onSubmit({
        ...formData,
        username: formData.username.trim(),
        name: formData.name.trim(),
        role: isSeedAdmin ? 'admin' : formData.role,
      });
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      setError('');
    } catch (submitError) {
      const message = submitError?.message ?? '';
      if (message.includes('El nombre de usuario ya existe') || message.includes('UNIQUE')) {
        setError('El nombre de usuario ya esta registrado');
        return;
      }
      setError(message || 'No se pudo guardar el usuario');
    }
  };

  return (
    <View style={adminStyles.container}>
      <Text style={adminStyles.title}>{initialData ? 'Editar Usuario' : 'Nuevo Usuario'}</Text>

      {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

      <TextInput
        style={adminStyles.input}
        placeholder="Usuario"
        placeholderTextColor={colors.textSecondary}
        value={formData.username}
        onChangeText={(text) => setField('username', text)}
        autoCapitalize="none"
      />

      <TextInput
        style={adminStyles.input}
        placeholder="Nombre"
        placeholderTextColor={colors.textSecondary}
        value={formData.name}
        onChangeText={(text) => setField('name', text)}
      />

      <TextInput
        style={adminStyles.input}
        placeholder={initialData ? 'Nueva contrasena (opcional)' : 'Contrasena'}
        placeholderTextColor={colors.textSecondary}
        value={formData.password}
        onChangeText={(text) => setField('password', text)}
      />

      <TextInput
        style={adminStyles.input}
        placeholder="Confirmar contrasena"
        placeholderTextColor={colors.textSecondary}
        value={formData.confirmPassword}
        onChangeText={(text) => setField('confirmPassword', text)}
      />

      {isSeedAdmin ? (
        <Text style={styles.notice}>
          El rol del administrador predeterminado no se puede modificar.
        </Text>
      ) : null}

      <Text style={[adminStyles.cardText, { marginBottom: 8 }]}>Rol</Text>
      <View style={styles.roleRow}>
        {[
          { value: 'admin', label: 'Administrador' },
          { value: 'user', label: 'Usuario' },
        ].map(({ value, label }) => {
          const selected = formData.role === value;
          const disabled = isSeedAdmin && value !== 'admin';
          return (
            <TouchableOpacity
              key={value}
              style={[
                styles.roleOption,
                selected && styles.roleOptionSelected,
                disabled && styles.roleOptionDisabled,
              ]}
              disabled={disabled}
              onPress={() => {
                if (disabled) return;
                setField('role', value);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled }}
            >
              <Text style={[styles.roleOptionText, selected && styles.roleOptionTextSelected]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={adminStyles.saveButton} onPress={handleSubmit}>
        <Text style={adminStyles.saveButtonText}>
          {initialData ? 'Actualizar usuario' : 'Crear usuario'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  notice: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 8,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 10,
  },
  roleOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
  },
  roleOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  roleOptionDisabled: {
    opacity: 0.5,
  },
  roleOptionText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  roleOptionTextSelected: {
    color: colors.text,
  },
});
