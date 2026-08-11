import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  console.log('🔥 LOGIN PRESIONADO');

  if (!email.trim() || !password.trim()) {
    Alert.alert('Datos incompletos', 'Ingresa tu correo y contraseña.');
    return;
  }

  try {
    console.log('📡 Intentando conectar con backend...');

    setLoading(true);

    await login(email.trim(), password);

    console.log('✅ LOGIN CORRECTO');

    Alert.alert('Bienvenido', 'Inicio de sesión correcto.');
  } catch (error: any) {
    console.log('❌ ERROR LOGIN:', error);

    Alert.alert(
      'Error al iniciar sesión',
      error.message || 'No fue posible iniciar sesión.'
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 justify-center px-6">
        <View className="mb-10 items-center">
          <View className="mb-5 h-20 w-20 items-center justify-center rounded-xl bg-primary-container">
            <Text className="text-4xl text-white">✓</Text>
          </View>

          <Text className="text-headline-lg-mobile text-on-background text-center">
            Checador Facial
          </Text>

          <Text className="text-body-md text-on-surface-variant mt-2 text-center">
            Control de asistencia con reconocimiento facial
          </Text>
        </View>

        <View className="rounded-xl bg-surface-container-lowest p-6">
          <Text className="text-label-md text-on-background mb-2">
            Correo electrónico
          </Text>

          <TextInput
            className="mb-5 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-4 text-on-background"
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#80756c"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text className="text-label-md text-on-background mb-2">
            Contraseña
          </Text>

          <TextInput
            className="mb-6 rounded-lg border border-outline-variant bg-surface-container-low px-4 py-4 text-on-background"
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#80756c"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            className="rounded-lg bg-primary-container py-4"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-center text-base font-bold text-white">
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-label-sm text-on-surface-variant mt-8 text-center">
          Sistema de control de asistencia
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}