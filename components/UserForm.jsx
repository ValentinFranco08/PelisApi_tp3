import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { adminStyles } from '../utils/adminStyles';
import { colors } from '../utils/commonStyles';

export default function UserForm({ onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    password: '',
    name: initialData?.name || '',
    role: initialData?.role || 'user',
  });
  const [error, setError] = useState('');
  const isSeedAdmin = initialData?.username === 'admin';

  const handleSubmit = async () => {
    setError('');

    const username = formData.username.trim();
    const name = formData.name.trim();

    if (!username || !name || (!initialData && !formData.password)) {
      setError('Por favor completa los campos requeridos');
      return;
    }

    try {
      await onSubmit({
        ...formData,
        username,
        name,
        role: isSeedAdmin ? 'admin' : formData.role,
      });
      setFormData((prev) => ({ ...prev, password: '' }));
      setError('');
    } catch (submitError) {
      setError(submitError?.message || 'No se pudo guardar el usuario');
    }
  };

  return (
    <View style={adminStyles.container}>
      <Text style={adminStyles.title}>{initialData ? 'Editar Usuario' : 'Nuevo Usuario'}</Text>
      
      {error ? <Text style={adminStyles.error}>{error}</Text> : null}

      <TextInput
        style={adminStyles.input}
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
        style={adminStyles.input}
        placeholder="Nombre"
        placeholderTextColor={colors.textSecondary}
        value={formData.name}
        onChangeText={(text) => {
          setFormData({ ...formData, name: text });
          if (error) setError('');
        }}
      />

      <TextInput
        style={adminStyles.input}
        placeholder={initialData ? 'Nueva contraseña (opcional)' : 'Contraseña'}
        placeholderTextColor={colors.textSecondary}
        value={formData.password}
        onChangeText={(text) => {
          setFormData({ ...formData, password: text });
          if (error) setError('');
        }}
        secureTextEntry
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
                setFormData({ ...formData, role: value });
                if (error) setError('');
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

      <TouchableOpacity 
        style={adminStyles.saveButton}
        onPress={handleSubmit}
      >
        <Text style={adminStyles.saveButtonText}>
          {initialData ? 'Actualizar usuario' : 'Crear usuario'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  }
});
