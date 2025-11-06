import AsyncStorage from '@react-native-async-storage/async-storage';
import { hashPassword } from './password';

class WebStorage {
  constructor() {
    this.storageKey = 'pelisapi_db';
  }

  async getItem(key) {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      const db = data ? JSON.parse(data) : {};
      return db[key];
    } catch (error) {
      console.error('Error reading from WebStorage:', error);
      return null;
    }
  }

  async setItem(key, value) {
    try {
      const data = await AsyncStorage.getItem(this.storageKey);
      const db = data ? JSON.parse(data) : {};
      db[key] = value;
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(db));
    } catch (error) {
      console.error('Error writing to WebStorage:', error);
    }
  }
}

const storage = new WebStorage();
let initPromise;

const sanitizeText = (value) => (typeof value === 'string' ? value.trim() : '');
const withoutPassword = (user) => {
  const { password: _unused, ...rest } = user;
  return rest;
};

const readUsers = async () => {
  const users = await storage.getItem('users');
  return Array.isArray(users) ? users : [];
};

const writeUsers = async (users) => storage.setItem('users', users);

const getNextId = (users) =>
  users.reduce((max, user) => Math.max(max, Number(user.id) || 0), 0) + 1;

const ensureSeedAdmin = async (users) => {
  const adminIndex = users.findIndex((user) => user.username === 'admin');

  if (adminIndex === -1) {
    const newUsers = [
      ...users,
      {
        id: getNextId(users),
        username: 'admin',
        password: hashPassword('admin123'),
        name: 'Administrador',
        role: 'admin',
      },
    ];
    await writeUsers(newUsers);
    return newUsers;
  }

  const adminUser = users[adminIndex];
  const ensured = [...users];
  let mutated = false;

  if (adminUser.role !== 'admin') {
    ensured[adminIndex] = { ...ensured[adminIndex], role: 'admin' };
    mutated = true;
  }

  if (adminUser.password !== hashPassword('admin123')) {
    ensured[adminIndex] = {
      ...ensured[adminIndex],
      password: hashPassword('admin123'),
    };
    mutated = true;
  }

  if (mutated) {
    await writeUsers(ensured);
    return ensured;
  }

  return users;
};

export const initDatabase = async () => {
  if (!initPromise) {
    initPromise = (async () => {
      const users = await readUsers();
      await ensureSeedAdmin(users);
    })();
  }

  return initPromise;
};

export const verifyCredentials = async (username, password) => {
  await initDatabase();
  const users = await readUsers();
  const trimmedUsername = sanitizeText(username);
  const user = users.find((u) => u.username === trimmedUsername);

  if (user && user.password === hashPassword(password)) {
    return withoutPassword(user);
  }

  return null;
};

export const getUsers = async () => {
  await initDatabase();
  const users = await readUsers();
  return users.map(withoutPassword);
};

export const createUser = async (userData) => {
  await initDatabase();

  const username = sanitizeText(userData.username);
  const name = sanitizeText(userData.name);
  const password = sanitizeText(userData.password);
  const role = userData.role === 'admin' ? 'admin' : 'user';

  if (!username || !name || !password) {
    throw new Error('Datos invalidos para crear usuario');
  }

  const users = await readUsers();
  if (users.some((user) => user.username === username)) {
    const error = new Error('UNIQUE constraint failed: users.username');
    throw error;
  }

  const newUser = {
    id: getNextId(users),
    username,
    password: hashPassword(password),
    name,
    role
  };

  await writeUsers([...users, newUser]);
  return withoutPassword(newUser);
};

export const updateUser = async (id, userData) => {
  await initDatabase();

  const userId = Number(id);
  const username = sanitizeText(userData.username);
  const name = sanitizeText(userData.name);
  const requestedRole = userData.role === 'admin' ? 'admin' : 'user';
  const password = sanitizeText(userData.password);

  if (!username || !name) {
    throw new Error('Datos invalidos para actualizar usuario');
  }

  const users = await readUsers();
  const index = users.findIndex((user) => user.id === userId);

  if (index === -1) {
    throw new Error('Usuario no encontrado');
  }

  if (users.some((user, idx) => idx !== index && user.username === username)) {
    const error = new Error('UNIQUE constraint failed: users.username');
    throw error;
  }

  const isSeedAdmin = users[index].username === 'admin';
  const role = isSeedAdmin ? 'admin' : requestedRole;

  const updatedUser = {
    ...users[index],
    username,
    name,
    role,
    ...(password ? { password: hashPassword(password) } : {})
  };

  users[index] = updatedUser;
  await writeUsers(users);
  return withoutPassword(updatedUser);
};

export const deleteUser = async (id) => {
  await initDatabase();
  const userId = Number(id);
  const users = await readUsers();
  const target = users.find((user) => user.id === userId);

  if (target?.username === 'admin') {
    throw new Error('No puedes eliminar el administrador predeterminado');
  }

  const filtered = users.filter((user) => user.id !== userId);

  if (filtered.length === users.length) {
    return { rowsAffected: 0 };
  }

  await writeUsers(filtered);
  return { rowsAffected: 1 };
};
