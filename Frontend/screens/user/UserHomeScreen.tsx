import React from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function UserHomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pb-10 pt-14">

        {/* Encabezado */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-on-surface-variant">
            CHECADOR FACIAL
          </Text>

          <Text className="mt-2 text-3xl font-bold text-primary">
            ¡Holiii, {user?.name || 'Usuario'}! 👋
          </Text>

          <Text className="mt-2 text-base text-on-surface-variant">
            Consulta tu asistencia y gestiona tus permisos, porfis.
          </Text>
        </View>

        {/* Tomar asistencia */}
        <TouchableOpacity
          className="mb-4 rounded-xl bg-primary p-6"
          onPress={() => navigation.navigate('OpenCamera')}
        >
          <Text className="text-3xl">📸</Text>

          <Text className="mt-3 text-xl font-bold text-white">
            Mi asistencia
          </Text>

          <Text className="mt-1 text-sm text-white">
            Registra tu entrada o salida mediante reconocimiento facial. Woww!
          </Text>
        </TouchableOpacity>

      
        {/* Historial */}
        <TouchableOpacity
          className="mb-4 rounded-xl bg-surface-container p-5"
          onPress={() => navigation.navigate('AttendanceHistory')}
        >
          <Text className="text-2xl">📋</Text>
          
          <Text className="mt-2 text-lg font-bold text-on-background">
            Mi historial
            </Text>
            
            <Text className="mt-1 text-sm text-on-surface-variant">
              Consulta tus entradas, salidas y estados de asistencia.
              </Text>
              </TouchableOpacity>

        {/* Permisos */}
        <TouchableOpacity
          className="mb-4 rounded-xl bg-surface-container p-5"
          onPress={() => navigation.navigate('Vacations')}
        >
          <Text className="text-2xl">🏖️</Text>

          <Text className="mt-2 text-lg font-bold text-on-background">
            Mis permisos
          </Text>

          <Text className="mt-1 text-sm text-on-surface-variant">
            Consulta y administra tus solicitudes de permiso, porfis.
          </Text>
        </TouchableOpacity>

        {/* Información */}
        <View className="mb-6 rounded-xl bg-surface-container p-5">
          <Text className="text-lg font-bold text-on-background">
            Mi información
          </Text>

          <Text className="mt-3 text-sm text-on-surface-variant">
            Correo: {user?.email}
          </Text>

          <Text className="mt-1 text-sm text-on-surface-variant">
            Rol: {user?.rol}
          </Text>
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity
          className="items-center rounded-xl border border-outline p-4"
          onPress={logout}
        >
          <Text className="font-bold text-error">
            Cerrar sesión
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

