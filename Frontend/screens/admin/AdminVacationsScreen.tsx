import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

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

export default function AdminVacationsScreen({ navigation }: any) {
  const [vacations, setVacations] = useState<Vacation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadVacations = async () => {
    try {
      const response = await fetch(`${API_URL}/vacations`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'No se pudieron obtener las solicitudes.'
        );
      }

      setVacations(data);
    } catch (error: any) {
      console.log('ERROR CARGANDO PERMISOS:', error);
      Alert.alert(
        'Error',
        error.message || 'No fue posible cargar las solicitudes.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadVacations();
    }, [])
  );

  const refreshVacations = async () => {
    setRefreshing(true);
    await loadVacations();
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

  const updateStatus = (id: number, status: string) => {
    const actionText = status === 'aprobado' ? 'aprobar' : 'rechazar';

    Alert.alert(
      status === 'aprobado' ? 'Aprobar solicitud' : 'Rechazar solicitud',
      `¿Seguro que deseas ${actionText} esta solicitud?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: status === 'aprobado' ? 'Aprobar' : 'Rechazar',
          style: status === 'aprobado' ? 'default' : 'destructive',
          onPress: async () => {
            try {
              setProcessingId(id);

              const response = await fetch(
                `${API_URL}/vacations/${id}`,
                {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                  },
                  body: JSON.stringify({
                    status,
                  }),
                }
              );

              const data = await response.json();

              if (!response.ok) {
                throw new Error(
                  data.message || 'No se pudo actualizar la solicitud.'
                );
              }

              Alert.alert(
                'Listo ✅',
                status === 'aprobado'
                  ? 'La solicitud fue aprobada correctamente.'
                  : 'La solicitud fue rechazada correctamente.'
              );

              await loadVacations();
            } catch (error: any) {
              console.log('ERROR ACTUALIZANDO PERMISO:', error);
              Alert.alert(
                'Error',
                error.message || 'No fue posible actualizar la solicitud.'
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#33210d" />
        <Text className="mt-4 text-on-surface-variant">
          Cargando solicitudes...
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
          {/* REGRESAR */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mb-6"
          >
            <Text className="text-base font-semibold text-primary">
              ← Regresar
            </Text>
          </TouchableOpacity>

          {/* ENCABEZADO */}
          <Text className="text-sm font-semibold text-on-surface-variant">
            CHECADOR FACIAL
          </Text>

          <Text className="mt-2 text-3xl font-bold text-primary">
            Solicitudes de permisos 📋
          </Text>

          <Text className="mt-2 mb-6 text-base text-on-surface-variant">
            Revisa y administra las solicitudes de los usuarios.
          </Text>

          {/* CONTADOR */}
          <View className="mb-6 rounded-xl bg-surface-container p-5">
            <Text className="text-sm text-on-surface-variant">
              Solicitudes registradas
            </Text>
            <Text className="mt-1 text-3xl font-bold text-primary">
              {vacations.length}
            </Text>
          </View>

          {/* SIN SOLICITUDES */}
          {vacations.length === 0 ? (
            <View className="rounded-xl bg-surface-container p-8">
              <Text className="text-center text-4xl">🏖️</Text>
              <Text className="mt-3 text-center text-lg font-bold text-on-background">
                No hay solicitudes
              </Text>
              <Text className="mt-2 text-center text-sm text-on-surface-variant">
                Cuando un usuario solicite un permiso, aparecerá aquí.
              </Text>
            </View>
          ) : (
            vacations.map((vacation) => (
              <View
                key={vacation.id}
                className="mb-4 rounded-xl bg-surface-container p-5"
              >
                {/* USUARIO */}
                <Text className="text-sm font-semibold text-on-surface-variant">
                  👤 Usuario
                </Text>
                <Text className="mt-1 text-lg font-bold text-on-background">
                  {vacation.user || `Usuario #${vacation.user_id}`}
                </Text>

                {/* MOTIVO */}
                <Text className="mt-4 text-sm font-semibold text-on-surface-variant">
                  📝 Motivo
                </Text>
                <Text className="mt-1 text-base text-on-background">
                  {vacation.reason}
                </Text>

                {/* FECHAS */}
                <Text className="mt-4 text-sm text-on-surface-variant">
                  📅 Del {formatDate(vacation.start_date)}
                </Text>
                <Text className="mt-1 text-sm text-on-surface-variant">
                  📅 Al {formatDate(vacation.end_date)}
                </Text>

                {/* ESTADO */}
                <View className="mt-4 rounded-lg bg-surface-container-lowest p-3">
                  <Text className="text-center font-bold text-primary">
                    {statusText(vacation.status)}
                  </Text>
                </View>

                {/* BOTONES */}
                {vacation.status === 'pendiente' && (
                  <View className="mt-4">
                    {/* APROBAR */}
                    <TouchableOpacity
                      disabled={processingId === vacation.id}
                      onPress={() => updateStatus(vacation.id, 'aprobado')}
                      className="mb-3 rounded-lg bg-primary p-4"
                    >
                      {processingId === vacation.id ? (
                        <ActivityIndicator color="#ffffff" />
                      ) : (
                        <Text className="text-center font-bold text-white">
                          ✅ Aprobar solicitud
                        </Text>
                      )}
                    </TouchableOpacity>

                    {/* RECHAZAR */}
                    <TouchableOpacity
                      disabled={processingId === vacation.id}
                      onPress={() => updateStatus(vacation.id, 'rechazado')}
                      className="rounded-lg bg-error-container p-4"
                    >
                      {processingId === vacation.id ? (
                        <ActivityIndicator color="#b3261e" />
                      ) : (
                        <Text className="text-center font-bold text-error">
                          ❌ Rechazar solicitud
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}