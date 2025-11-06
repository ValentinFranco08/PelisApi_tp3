import { View } from 'react-native';
import UserForm from '../../../components/UserForm';
import { createUser } from '../../../db/auth';
import { router } from 'expo-router';
import { adminStyles } from '../../../utils/adminStyles';

export default function NewUserScreen() {
  const handleSubmit = async (userData) => {
    try {
      await createUser(userData);
      router.back();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  return (
    <View style={adminStyles.container}>
      <UserForm onSubmit={handleSubmit} />
    </View>
  );
}
