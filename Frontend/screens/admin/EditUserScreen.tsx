import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.0.10:5000';

export default function EditUserScreen({ route, navigation }: any) {
  const { user } = route.params;

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState(user.rol || 'empleado');
  const [state, setState] = useState(user.state || 'activo');
  const [areaId, setAreaId] = useState(
    user.area_id ? String(user.area_id) : ''
  );
  const [scheduleId, setScheduleId] = useState(
    user.schedule_id ? String(user.schedule_id) : ''
  );

  const [loading, setLoading] = useState(false);

  const updateUser = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert(
        'Campos obligatorios',
        'El nombre y el correo son obligatorios.'
      );
      return;
    }

    setLoading(true);

    try {
      const body: any = {
        name: name.trim(),
        email: email.trim(),
        rol,
        state,
        area_id: areaId.trim() ? Number(areaId) : null,
        schedule_id: scheduleId.trim() ? Number(scheduleId) : null,
      };

      if (password.trim()) {
        body.password = password;
      }

      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'No se pudo actualizar el usuario.'
        );
      }

      Alert.alert(
        '¡Usuario actualizado! 🎉',
        'Los datos se actualizaron correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No fue posible actualizar el usuario.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="px-6 pb-10 pt-14">

        {/* Regresar */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mb-6"
        >
          <Text className="text-base font-semibold text-primary">
            ← Regresar
          </Text>
        </TouchableOpacity>

        {/* Encabezado */}
        <Text className="text-sm font-semibold text-on-surface-variant">
          ADMINISTRACIÓN
        </Text>

        <Text className="mt-2 text-3xl font-bold text-primary">
          Editar usuario ✏️
        </Text>

        <Text className="mt-2 mb-7 text-base text-on-surface-variant">
          Modifica los datos de {user.name}.
        </Text>

        {/* Nombre */}
        <View className="mb-5">
          <Text className="mb-2 font-semibold text-on-background">
            Nombre *
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nombre"
            placeholderTextColor="#80756c"
            className="rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
          />
        </View>

        {/* Correo */}
        <View className="mb-5">
          <Text className="mb-2 font-semibold text-on-background">
            Correo electrónico *
          </Text>

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#80756c"
            keyboardType="email-address"
            autoCapitalize="none"
            className="rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
          />
        </View>

        {/* Contraseña */}
        <View className="mb-5">
          <Text className="mb-2 font-semibold text-on-background">
            Nueva contraseña
          </Text>

          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Déjala vacía para conservarla"
            placeholderTextColor="#80756c"
            secureTextEntry
            className="rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
          />

          <Text className="mt-2 text-xs text-on-surface-variant">
            Si no quieres cambiar la contraseña, deja este campo vacío.
          </Text>
        </View>

        {/* Rol */}
        <View className="mb-5">
          <Text className="mb-2 font-semibold text-on-background">
            Rol
          </Text>

          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setRol('empleado')}
              className={`mr-2 flex-1 rounded-xl p-4 ${
                rol === 'empleado'
                  ? 'bg-primary'
                  : 'bg-surface-container'
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  rol === 'empleado'
                    ? 'text-white'
                    : 'text-on-background'
                }`}
              >
                Empleado
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRol('administrador')}
              className={`flex-1 rounded-xl p-4 ${
                rol === 'administrador'
                  ? 'bg-primary'
                  : 'bg-surface-container'
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  rol === 'administrador'
                    ? 'text-white'
                    : 'text-on-background'
                }`}
              >
                Administrador
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Estado */}
        <View className="mb-5">
          <Text className="mb-2 font-semibold text-on-background">
            Estado
          </Text>

          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setState('activo')}
              className={`mr-2 flex-1 rounded-xl p-4 ${
                state === 'activo'
                  ? 'bg-primary'
                  : 'bg-surface-container'
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  state === 'activo'
                    ? 'text-white'
                    : 'text-on-background'
                }`}
              >
                Activo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setState('inactivo')}
              className={`flex-1 rounded-xl p-4 ${
                state === 'inactivo'
                  ? 'bg-primary'
                  : 'bg-surface-container'
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  state === 'inactivo'
                    ? 'text-white'
                    : 'text-on-background'
                }`}
              >
                Inactivo
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Área */}
        <View className="mb-5">
          <Text className="mb-2 font-semibold text-on-background">
            ID del área
          </Text>

          <TextInput
            value={areaId}
            onChangeText={setAreaId}
            placeholder="Ej. 1"
            placeholderTextColor="#80756c"
            keyboardType="numeric"
            className="rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
          />
        </View>

        {/* Horario */}
        <View className="mb-8">
          <Text className="mb-2 font-semibold text-on-background">
            ID del horario
          </Text>

          <TextInput
            value={scheduleId}
            onChangeText={setScheduleId}
            placeholder="Ej. 1"
            placeholderTextColor="#80756c"
            keyboardType="numeric"
            className="rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
          />
        </View>

        {/* Guardar */}
        <TouchableOpacity
          onPress={updateUser}
          disabled={loading}
          className={`rounded-xl p-5 ${
            loading ? 'bg-secondary' : 'bg-primary'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">
              Guardar cambios
            </Text>
          )}
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}
