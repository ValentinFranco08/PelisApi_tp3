import { useState } from 'react';
import { View } from 'react-native';
import UserForm from '../../../components/UserForm';
import { createUser } from '../../../db/auth';
import { router } from 'expo-router';
import { adminStyles } from '../../../utils/adminStyles';
import AppModal from '../../../components/AppModal';

export default function NewUserScreen() {
  const [modal, setModal] = useState({ visible: false });

  const closeModal = () => setModal({ visible: false });

  const handleSubmit = async (userData) => {
    try {
      await createUser(userData);
      setModal({
        visible: true,
        title: 'Usuario creado',
        message: `"${userData.name}" ahora forma parte de tu equipo.`,
        actions: [
          {
            text: 'Aceptar',
            onPress: () => {
              closeModal();
              router.back();
            },
          },
        ],
      });
    } catch (error) {
      const message = error?.message ?? '';
      if (message.includes('UNIQUE') || message.includes('El nombre de usuario ya existe')) {
        throw new Error('El nombre de usuario ya está registrado');
      }
      throw error;
    }
  };

  return (
    <View style={adminStyles.container}>
      <UserForm onSubmit={handleSubmit} />
      <AppModal
        visible={modal.visible}
        title={modal.title}
        message={modal.message}
        actions={modal.actions}
        onRequestClose={closeModal}
      />
    </View>
  );
}
