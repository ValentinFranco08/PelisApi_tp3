import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../useAuth';

export default function LogoutButton() {
  const { logout } = useAuth();

  return (
    <TouchableOpacity 
      onPress={logout}
      style={{ marginRight: 15 }}
    >
      <Ionicons name="log-out-outline" size={24} color="white" />
    </TouchableOpacity>
  );
}