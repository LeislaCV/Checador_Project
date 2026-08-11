import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const API_URL = 'http://192.168.0.10:5000';

interface User {
  id: number;
  name: string;
  email: string;
  rol: string;
  state: string;
  area_id?: number | null;
  schedule_id?: number | null;
}

export default function UsersScreen({ navigation }: any) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);

      if (!response.ok) {
        throw new Error('No se pudieron obtener los usuarios.');
      }

      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.message || 'No fue posible cargar los usuarios.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUsers();
    }, [])
  );

  const refreshUsers = async () => {
    setRefreshing(true);
    await loadUsers();
  };

  const deleteUser = (id: number, name: string) => {
    Alert.alert(
      'Eliminar usuario',
      `¿Seguro que deseas eliminar a ${name}?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/users/${id}`, {
                method: 'DELETE',
              });

              const data = await response.json();

              if (!response.ok) {
                throw new Error(
                  data.message || 'No se pudo eliminar el usuario.'
                );
              }

              Alert.alert('Éxito', data.message);
              loadUsers();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'No fue posible eliminar el usuario.'
              );
            }
          },
        },
      ]
    );
  };

  const filteredUsers = users.filter((user) => {
    const text = search.toLowerCase();

    return (
      user.name?.toLowerCase().includes(text) ||
      user.email?.toLowerCase().includes(text) ||
      user.rol?.toLowerCase().includes(text)
    );
  });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#33210d" />

        <Text className="mt-4 text-on-surface-variant">
          Cargando usuarios...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshUsers}
          />
        }
      >
        <View className="px-6 pb-10 pt-14">

          {/* Encabezado */}
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mb-5"
            >
              <Text className="text-base font-semibold text-primary">
                ← Regresar
              </Text>
            </TouchableOpacity>

            <Text className="text-sm font-semibold text-on-surface-variant">
              ADMINISTRACIÓN
            </Text>

            <Text className="mt-2 text-3xl font-bold text-primary">
              Usuarios 👥
            </Text>

            <Text className="mt-2 text-base text-on-surface-variant">
              Administra los usuarios registrados en el sistema.
            </Text>
          </View>

          {/* Botón crear */}
          <TouchableOpacity
            className="mb-5 rounded-xl bg-primary p-5"
            onPress={() => navigation.navigate('CreateUser')}
          >
            <Text className="text-center text-lg font-bold text-white">
              + Registrar usuario
            </Text>
          </TouchableOpacity>

          {/* Buscador */}
          <View className="mb-6 rounded-xl bg-surface-container p-4">
            <Text className="mb-2 font-semibold text-on-background">
              Buscar usuario
            </Text>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Nombre, correo o rol..."
              placeholderTextColor="#80756c"
              className="rounded-lg bg-surface-container-lowest px-4 py-3 text-on-background"
            />
          </View>

          {/* Contador */}
          <Text className="mb-4 text-sm font-semibold text-on-surface-variant">
            {filteredUsers.length} usuario(s)
          </Text>

          {/* Lista */}
          {filteredUsers.length === 0 ? (
            <View className="rounded-xl bg-surface-container p-8">
              <Text className="text-center text-base text-on-surface-variant">
                No se encontraron usuarios.
              </Text>
            </View>
          ) : (
            filteredUsers.map((user) => (
              <View
                key={user.id}
                className="mb-4 rounded-xl bg-surface-container p-5"
              >
                {/* Información */}
                <View className="mb-4">
                  <Text className="text-xl font-bold text-on-background">
                    {user.name}
                  </Text>

                  <Text className="mt-1 text-sm text-on-surface-variant">
                    {user.email}
                  </Text>

                  <View className="mt-3 flex-row">
                    <View className="mr-2 rounded-full bg-primary-fixed px-3 py-1">
                      <Text className="text-xs font-semibold text-on-primary-fixed">
                        {user.rol}
                      </Text>
                    </View>

                    <View className="rounded-full bg-secondary-container px-3 py-1">
                      <Text className="text-xs font-semibold text-on-secondary-container">
                        {user.state}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Botones */}
<View>

  {/* Editar */}
  <TouchableOpacity
    className="mb-3 rounded-lg border border-outline p-3"
    onPress={() =>
      navigation.navigate('EditUser', {
        user,
      })
    }
  >
    <Text className="text-center font-semibold text-primary">
      ✏️ Editar usuario
    </Text>
  </TouchableOpacity>

  {/* Registrar rostro */}
  <TouchableOpacity
    className="mb-3 rounded-lg bg-primary p-3"
    onPress={() =>
      navigation.navigate('RegisterFace', {
        userId: user.id,
        userName: user.name,
      })
    }
  >
    <Text className="text-center font-semibold text-white">
      📸 Registrar rostro
    </Text>
  </TouchableOpacity>

  {/* Eliminar */}
  <TouchableOpacity
    className="rounded-lg bg-error-container p-3"
    onPress={() => deleteUser(user.id, user.name)}
  >
    <Text className="text-center font-semibold text-error">
      🗑️ Eliminar usuario
    </Text>
  </TouchableOpacity>

</View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

