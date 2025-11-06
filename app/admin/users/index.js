import { View, FlatList, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useAuth } from '../../../useAuth';
import { getUsers, deleteUser } from '../../../db/auth';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Loading from '../../../components/Loading';
import { adminStyles } from '../../../utils/adminStyles';
import { colors } from '../../../utils/commonStyles';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const loadUsers = useCallback(async () => {
    try {
      const usersList = await getUsers();
      setUsers(usersList);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadUsers();
    }, [loadUsers])
  );

  const handleDelete = async (userId) => {
    if (!currentUser) {
      return;
    }

    if (userId === currentUser.id) {
      alert('No puedes eliminarte a ti mismo');
      return;
    }

    try {
      await deleteUser(userId);
      setLoading(true);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error?.message ?? 'Error al eliminar usuario');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={adminStyles.container}>
      <View style={adminStyles.header}>
        <Text style={adminStyles.title}>Gestión de Usuarios</Text>
        <TouchableOpacity 
          style={adminStyles.addButton}
          onPress={() => router.push('/admin/users/nuevo')}
        >
          <Ionicons name="add-circle" size={18} color={colors.text} />
          <Text style={adminStyles.addButtonText}>Nuevo Usuario</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={adminStyles.card}>
            <View style={adminStyles.cardHeader}>
              <Text style={adminStyles.cardTitle}>{item.name}</Text>
            </View>
            <Text style={adminStyles.cardText}>
              Usuario: {item.username}
            </Text>
            <Text style={adminStyles.cardText}>
              Rol: {item.role}
            </Text>
            <View style={adminStyles.buttonRow}>
              <TouchableOpacity 
                style={[adminStyles.actionButton, adminStyles.editButton]}
                onPress={() => router.push(`/admin/users/${item.id}`)}
              >
                <Text style={adminStyles.addButtonText}>Editar</Text>
              </TouchableOpacity>
              {currentUser && item.id !== currentUser.id && (
                <TouchableOpacity 
                  style={[adminStyles.actionButton, adminStyles.deleteButton]}
                  onPress={() => handleDelete(item.id)}
                >
                  <Text style={adminStyles.addButtonText}>Eliminar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={adminStyles.card}>
            <Text style={adminStyles.cardText}>No hay usuarios cargados.</Text>
          </View>
        }
      />
    </View>
  );
}
