import { StyleSheet } from 'react-native';

export const colors = {
  background: '#181818',
  primary: '#e50914',
  text: '#fff',
  textSecondary: '#b3b3b3',
  inputBackground: '#2f2f2f',
  error: '#ff5555',
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
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
  error: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});