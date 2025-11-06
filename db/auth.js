import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import {
  initDatabase as webInit,
  verifyCredentials as webVerify,
  getUsers as webGetUsers,
  createUser as webCreateUser,
  updateUser as webUpdateUser,
  deleteUser as webDeleteUser
} from './webStorage';
import { hashPassword } from './password';

const sanitizeText = (value) => (typeof value === 'string' ? value.trim() : '');

export { hashPassword };

let dbPromise;
const getDb = async () => {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('auth.db');
  }
  return dbPromise;
};

let initPromise;
export const initDatabase = async () => {
  if (Platform.OS === 'web') {
    return webInit();
  }

  if (!initPromise) {
    initPromise = (async () => {
      const db = await getDb();
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL
        );
      `);

      const adminPassword = hashPassword('admin123');
      await db.runAsync(
        'INSERT OR IGNORE INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
        'admin',
        adminPassword,
        'Administrador',
        'admin'
      );
    })();
  }

  return initPromise;
};

export const verifyCredentials = async (username, password) => {
  if (Platform.OS === 'web') {
    await webInit();
    return webVerify(username, password);
  }

  await initDatabase();
  const db = await getDb();
  const sanitizedUsername = sanitizeText(username);
  const hashedPassword = hashPassword(password);

  const rows = await db.getAllAsync(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    sanitizedUsername,
    hashedPassword
  );

  return rows?.[0] ?? null;
};

export const getUsers = async () => {
  if (Platform.OS === 'web') {
    await webInit();
    return webGetUsers();
  }

  await initDatabase();
  const db = await getDb();
  return db.getAllAsync('SELECT id, username, name, role FROM users');
};

export const createUser = async (userData) => {
  const username = sanitizeText(userData.username);
  const name = sanitizeText(userData.name);
  const password = sanitizeText(userData.password);
  const role = userData.role === 'admin' ? 'admin' : 'user';

  if (!username || !name || !password) {
    throw new Error('Datos invalidos para crear usuario');
  }

  if (Platform.OS === 'web') {
    await webInit();
    return webCreateUser({
      username,
      name,
      password,
      role
    });
  }

  await initDatabase();
  const db = await getDb();
  const hashedPassword = hashPassword(password);

  try {
    const result = await db.runAsync(
      'INSERT INTO users (username, password, name, role) VALUES (?, ?, ?, ?)',
      username,
      hashedPassword,
      name,
      role
    );

    return result;
  } catch (error) {
    if (error?.message?.includes('UNIQUE constraint failed')) {
      throw new Error('El nombre de usuario ya existe');
    }
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  const username = sanitizeText(userData.username);
  const name = sanitizeText(userData.name);
  const requestedRole = userData.role === 'admin' ? 'admin' : 'user';
  const password = sanitizeText(userData.password);
  const numericId = Number(id);

  if (!username || !name) {
    throw new Error('Datos invalidos para actualizar usuario');
  }

  if (!Number.isFinite(numericId)) {
    throw new Error('Identificador invalido');
  }

  if (Platform.OS === 'web') {
    await webInit();
    return webUpdateUser(numericId, {
      username,
      name,
      role: requestedRole,
      password
    });
  }

  await initDatabase();
  const db = await getDb();

  const existing = await db.getFirstAsync(
    'SELECT username, role FROM users WHERE id = ?',
    numericId
  );

  if (!existing) {
    throw new Error('Usuario no encontrado');
  }

  const isSeedAdmin = existing.username === 'admin';
  const role = isSeedAdmin ? 'admin' : requestedRole;

  const params = [name, role];
  let setters = 'name = ?, role = ?';

  if (password) {
    const hashedPassword = hashPassword(password);
    setters += ', password = ?';
    params.push(hashedPassword);
  }

  setters += ', username = ?';
  params.push(username);

  params.push(numericId);

  try {
    const result = await db.runAsync(
      `UPDATE users SET ${setters} WHERE id = ?`,
      ...params
    );
    return result;
  } catch (error) {
    if (error?.message?.includes('UNIQUE constraint failed')) {
      throw new Error('El nombre de usuario ya existe');
    }
    throw error;
  }
};

export const deleteUser = async (id) => {
  if (Platform.OS === 'web') {
    await webInit();
    return webDeleteUser(id);
  }

  await initDatabase();
  const db = await getDb();

  const existing = await db.getFirstAsync(
    'SELECT username FROM users WHERE id = ?',
    id
  );

  if (existing?.username === 'admin') {
    throw new Error('No puedes eliminar el administrador predeterminado');
  }

  return db.runAsync('DELETE FROM users WHERE id = ?', id);
};
