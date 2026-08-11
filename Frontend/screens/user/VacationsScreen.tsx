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
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://192.168.0.10:5000';

interface Vacation {
  id: number;
  user_id: number;
  user?: string;
  reason: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at?: string;
}

export default function VacationsScreen({ navigation }: any) {
  const { user } = useAuth();

  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saving, setSaving] = useState(false);

  const loadVacations = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(
        `${API_URL}/vacations/user/${user.id}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'No se pudieron obtener los permisos.'
        );
      }

      setVacations(data);
    } catch (error: any) {
      console.log('ERROR PERMISOS:', error);

      Alert.alert(
        'Error',
        error.message || 'No fue posible cargar los permisos.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadVacations();
    }, [user?.id])
  );

  const refreshVacations = async () => {
    setRefreshing(true);
    await loadVacations();
  };

  const createVacation = async () => {
    if (!reason.trim() || !startDate.trim() || !endDate.trim()) {
      Alert.alert(
        'Campos obligatorios',
        'Completa el motivo, fecha inicial y fecha final.'
      );
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/vacations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          user_id: user?.id,
          reason: reason.trim(),
          start_date: startDate.trim(),
          end_date: endDate.trim(),
          status: 'pendiente',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'No se pudo crear el permiso.'
        );
      }

      Alert.alert(
        '¡Solicitud enviada! 🏖️',
        'Tu solicitud de permiso quedó registrada como pendiente.'
      );

      setReason('');
      setStartDate('');
      setEndDate('');
      setShowForm(false);

      await loadVacations();
    } catch (error: any) {
      console.log('ERROR CREANDO PERMISO:', error);

      Alert.alert(
        'Error',
        error.message || 'No fue posible registrar el permiso.'
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteVacation = (id: number) => {
    Alert.alert(
      'Eliminar solicitud',
      '¿Seguro que deseas eliminar esta solicitud?',
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
              const response = await fetch(
                `${API_URL}/vacations/${id}`,
                {
                  method: 'DELETE',
                }
              );

              const data = await response.json();

              if (!response.ok) {
                throw new Error(
                  data.message || 'No se pudo eliminar.'
                );
              }

              Alert.alert('Listo', 'Solicitud eliminada correctamente.');

              await loadVacations();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'No fue posible eliminar la solicitud.'
              );
            }
          },
        },
      ]
    );
  };

  const formatDate = (date: string) => {
    if (!date) return '';

    const parts = date.split('-');

    if (parts.length !== 3) return date;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  const statusText = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente ⏳';

      case 'aprobado':
        return 'Aprobado ✅';

      case 'rechazado':
        return 'Rechazado ❌';

      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#33210d" />

        <Text className="mt-4 text-on-surface-variant">
          Cargando permisos...
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
            onRefresh={refreshVacations}
          />
        }
      >
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
            CHECADOR FACIAL
          </Text>

          <Text className="mt-2 text-3xl font-bold text-primary">
            Mis permisos 🏖️
          </Text>

          <Text className="mt-2 mb-6 text-base text-on-surface-variant">
            Solicita y consulta tus permisos.
          </Text>

          {/* Botón nueva solicitud */}
          <TouchableOpacity
            className="mb-6 rounded-xl bg-primary p-5"
            onPress={() => setShowForm(!showForm)}
          >
            <Text className="text-center text-lg font-bold text-white">
              {showForm
                ? '✕ Cancelar solicitud'
                : '+ Solicitar permiso'}
            </Text>
          </TouchableOpacity>

          {/* Formulario */}
          {showForm && (
            <View className="mb-7 rounded-xl bg-surface-container p-5">

              <Text className="mb-4 text-xl font-bold text-on-background">
                Nueva solicitud 📝
              </Text>

              {/* Motivo */}
              <Text className="mb-2 font-semibold text-on-background">
                Motivo *
              </Text>

              <TextInput
                value={reason}
                onChangeText={setReason}
                placeholder="Ej. Cita médica, asunto personal..."
                placeholderTextColor="#80756c"
                multiline
                numberOfLines={4}
                className="mb-5 rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
              />

              {/* Fecha inicial */}
              <Text className="mb-2 font-semibold text-on-background">
                Fecha inicial *
              </Text>

              <TextInput
                value={startDate}
                onChangeText={setStartDate}
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#80756c"
                className="mb-5 rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
              />

              {/* Fecha final */}
              <Text className="mb-2 font-semibold text-on-background">
                Fecha final *
              </Text>

              <TextInput
                value={endDate}
                onChangeText={setEndDate}
                placeholder="AAAA-MM-DD"
                placeholderTextColor="#80756c"
                className="mb-5 rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
              />

              {/* Guardar */}
              <TouchableOpacity
                disabled={saving}
                onPress={createVacation}
                className={`rounded-xl p-4 ${
                  saving ? 'bg-secondary' : 'bg-primary'
                }`}
              >
                {saving ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-center font-bold text-white">
                    Enviar solicitud
                  </Text>
                )}
              </TouchableOpacity>

            </View>
          )}

          {/* Contador */}
          <Text className="mb-4 text-sm font-semibold text-on-surface-variant">
            {vacations.length} solicitud(es)
          </Text>

          {/* Sin solicitudes */}
          {vacations.length === 0 ? (
            <View className="rounded-xl bg-surface-container p-8">
              <Text className="text-center text-4xl">
                🏖️
              </Text>

              <Text className="mt-3 text-center text-lg font-bold text-on-background">
                No tienes solicitudes
              </Text>

              <Text className="mt-2 text-center text-sm text-on-surface-variant">
                Aquí aparecerán tus permisos.
              </Text>
            </View>
          ) : (
            vacations.map((vacation) => (
              <View
                key={vacation.id}
                className="mb-4 rounded-xl bg-surface-container p-5"
              >
                <Text className="text-lg font-bold text-on-background">
                  📝 {vacation.reason}
                </Text>

                <Text className="mt-3 text-sm text-on-surface-variant">
                  📅 Del {formatDate(vacation.start_date)}
                </Text>

                <Text className="mt-1 text-sm text-on-surface-variant">
                  📅 Al {formatDate(vacation.end_date)}
                </Text>

                <View className="mt-4 rounded-lg bg-surface-container-lowest p-3">
                  <Text className="text-center font-bold text-primary">
                    {statusText(vacation.status)}
                  </Text>
                </View>

                {/* Solo permitir eliminar si está pendiente */}
                {vacation.status === 'pendiente' && (
                  <TouchableOpacity
                    className="mt-4 rounded-lg bg-error-container p-3"
                    onPress={() => deleteVacation(vacation.id)}
                  >
                    <Text className="text-center font-semibold text-error">
                      Eliminar solicitud
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}

        </View>
      </ScrollView>
    </View>
  );
}
