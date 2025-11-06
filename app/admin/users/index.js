import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { useAuth } from '../../../useAuth';
import { getUsers, deleteUser } from '../../../db/auth';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Loading from '../../../components/Loading';
import AppModal from '../../../components/AppModal';
import { adminStyles } from '../../../utils/adminStyles';
import { colors } from '../../../utils/commonStyles';

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ visible: false });
  const [toast, setToast] = useState({ visible: false, message: '' });
  const { user: currentUser } = useAuth();

  const hideToast = useCallback(() => {
    setToast({ visible: false, message: '' });
  }, []);

  const showToast = useCallback((message) => {
    setToast({ visible: true, message });
    setTimeout(hideToast, 2200);
  }, [hideToast]);

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

  const confirmDelete = (user) => {
    if (!currentUser || user.id === currentUser.id) {
      alert('No puedes eliminarte a ti mismo');
      return;
    }
    setModal({
      visible: true,
      title: 'Eliminar usuario',
      message: `¿Seguro que quieres eliminar a "${user.name}"?`,
      actions: [
        { text: 'Cancelar' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => performDelete(user.id),
        },
      ],
    });
  };

  const performDelete = async (userId) => {
    try {
      setLoading(true);
      await deleteUser(userId);
      await loadUsers();
      showToast('Usuario eliminado');
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
            <Text style={adminStyles.cardText}>Usuario: {item.username}</Text>
            <Text style={adminStyles.cardText}>Rol: {item.role}</Text>
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
                  onPress={() => confirmDelete(item)}
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

      <AppModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        actions={modal.actions}
        onRequestClose={() => setModal({ visible: false })}
      />

      {toast.visible ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#1f1f1f',
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  toastText: {
    color: colors.text,
    fontWeight: '600',
  },
});
