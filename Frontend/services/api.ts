import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.10:5000';

interface LoginResponse {
  token: string;
  user: any;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión');
    }

    await AsyncStorage.setItem('token', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error('Error detallado en fetch login:', error);
    throw error;
  }
};
export const getToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const getUser = async () => {
  const user = await AsyncStorage.getItem('user');

  return user ? JSON.parse(user) : null;
};

export const logout = async () => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};