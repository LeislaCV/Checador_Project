
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from 'context/AuthContext';

interface AdminHomeScreenProps {
  navigation: any;
}

export default function AdminHomeScreen({
  navigation,
}: AdminHomeScreenProps) {
const { logout} = useAuth(); 
  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pb-10 pt-14">
        {/* Encabezado */}
        <View className="mb-8">
          <Text className="text-sm font-semibold text-on-surface-variant">
            PANEL DE ADMINISTRACIÓN
          </Text>

          <Text className="mt-2 text-3xl font-bold text-primary">
            ¡Holii, Bienvenidoo! 👋
          </Text>

          <Text className="mt-2 text-base text-on-surface-variant">
            Gestiona la asistencia y los usuarios de tu organización porfi.
          </Text>
        </View>

        {/* Reconocimiento facial */}
        <TouchableOpacity
          className="mb-4 rounded-xl bg-primary p-6"
          onPress={() => navigation.navigate('RegisterFace')}
        >
          <Text className="text-3xl">📸</Text>

          <Text className="mt-3 text-xl font-bold text-white">
            Tomar asistencia
          </Text>

          <Text className="mt-1 text-sm text-white">
            Registrar entrada o salida mediante reconocimiento facial, woww.
          </Text>
        </TouchableOpacity>

        {/* Usuarios */}
        <TouchableOpacity
          className="mb-4 rounded-xl bg-surface-container p-5"
          onPress={() => navigation.navigate('Users')}
        >
          <Text className="text-2xl">👥</Text>

          <Text className="mt-2 text-lg font-bold text-on-background">
            Usuarios
          </Text>

          <Text className="mt-1 text-sm text-on-surface-variant">
            Registrar, consultar, editar y eliminar usuarios, excelentee.
          </Text>
        </TouchableOpacity>

        {/* Asistencias */}
        <TouchableOpacity
          className="mb-4 rounded-xl bg-surface-container p-5"
          onPress={() => navigation.navigate('AdminAttendance')}
        >
          <Text className="text-2xl">📋</Text>

          <Text className="mt-2 text-lg font-bold text-on-background">
            Asistencias
          </Text>

          <Text className="mt-1 text-sm text-on-surface-variant">
            Consulta las asistencias registradas y sus historiales.
          </Text>
        </TouchableOpacity>

        {/* Horarios */}
        <TouchableOpacity
          className="mb-4 rounded-xl bg-surface-container p-5"
          onPress={() => navigation.navigate('Schedules')}
        >
          <Text className="text-2xl">🕐</Text>

          <Text className="mt-2 text-lg font-bold text-on-background">
            Horarios
          </Text>

          <Text className="mt-1 text-sm text-on-surface-variant">
            Crear, consultar y modificar horarios.
          </Text>
        </TouchableOpacity>

        {/* Vacaciones */}
        <TouchableOpacity
          className="mb-4 rounded-xl bg-surface-container p-5"
          onPress={() => navigation.navigate('AdminVacations')}
        >
          <Text className="text-2xl">🏖️</Text>

          <Text className="mt-2 text-lg font-bold text-on-background">
            Vacaciones y permisos
          </Text>

          <Text className="mt-1 text-sm text-on-surface-variant">
            Consulta y administra las solicitudes de permisos.
          </Text>
        </TouchableOpacity>

        {/* Cerrar sesión */}
        <TouchableOpacity
          className="mt-4 items-center rounded-xl border border-outline p-4"
          onPress={() => logout()} 
        >
          <Text className="font-bold text-error">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

