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
import { useAuth } from '../../context/AuthContext';

const API_URL = 'http://192.168.0.10:5000';

interface Attendance {
  id: number;
  user_id: number;
  user?: string;
  date: string;
  entry?: string | null;
  exit?: string | null;
  status: string;
}

export default function AttendanceHistoryScreen({ navigation }: any) {
  const { user } = useAuth();

  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const loadHistory = async () => {
    if (!user?.id) return;

    try {
      let url = `${API_URL}/attendance/user/${user.id}`;

      if (filter) {
        url += `?filter=${filter}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'No se pudo obtener el historial.'
        );
      }

      setAttendances(data);
    } catch (error: any) {
      console.log('ERROR HISTORIAL:', error);

      Alert.alert(
        'Error',
        error.message || 'No fue posible cargar el historial.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [user?.id, filter])
  );

  const refreshHistory = async () => {
    setRefreshing(true);
    await loadHistory();
  };

  const formatTime = (time?: string | null) => {
    if (!time) return '--:--';

    return time.substring(0, 5);
  };

  const formatDate = (date: string) => {
    if (!date) return '';

    const parts = date.split('-');

    if (parts.length !== 3) return date;

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#33210d" />

        <Text className="mt-4 text-on-surface-variant">
          Cargando historial...
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
            onRefresh={refreshHistory}
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
            Mi historial 📋
          </Text>

          <Text className="mt-2 mb-6 text-base text-on-surface-variant">
            Consulta tus registros de asistencia.
          </Text>

          {/* Filtros */}
          <View className="mb-6">
            <Text className="mb-3 font-semibold text-on-background">
              Filtrar por
            </Text>

            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setFilter(null)}
                className={`mr-2 flex-1 rounded-xl p-3 ${
                  filter === null
                    ? 'bg-primary'
                    : 'bg-surface-container'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    filter === null
                      ? 'text-white'
                      : 'text-on-background'
                  }`}
                >
                  Todo
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilter('week')}
                className={`mr-2 flex-1 rounded-xl p-3 ${
                  filter === 'week'
                    ? 'bg-primary'
                    : 'bg-surface-container'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    filter === 'week'
                      ? 'text-white'
                      : 'text-on-background'
                  }`}
                >
                  Semana
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFilter('month')}
                className={`flex-1 rounded-xl p-3 ${
                  filter === 'month'
                    ? 'bg-primary'
                    : 'bg-surface-container'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    filter === 'month'
                      ? 'text-white'
                      : 'text-on-background'
                  }`}
                >
                  Mes
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Contador */}
          <Text className="mb-4 text-sm font-semibold text-on-surface-variant">
            {attendances.length} registro(s)
          </Text>

          {/* Sin registros */}
          {attendances.length === 0 ? (
            <View className="rounded-xl bg-surface-container p-8">
              <Text className="text-center text-4xl">
                📭
              </Text>

              <Text className="mt-3 text-center text-lg font-bold text-on-background">
                No hay registros
              </Text>

              <Text className="mt-2 text-center text-sm text-on-surface-variant">
                Todavía no tienes asistencias registradas.
              </Text>
            </View>
          ) : (
            /* Registros */
            attendances.map((attendance) => (
              <View
                key={attendance.id}
                className="mb-4 rounded-xl bg-surface-container p-5"
              >
                {/* Fecha */}
                <View className="mb-4">
                  <Text className="text-lg font-bold text-on-background">
                    📅 {formatDate(attendance.date)}
                  </Text>

                  <Text className="mt-1 text-sm text-on-surface-variant">
                    {attendance.status}
                  </Text>
                </View>

                {/* Entrada y salida */}
                <View className="flex-row">

                  {/* Entrada */}
                  <View className="mr-2 flex-1 rounded-xl bg-primary p-4">
                    <Text className="text-sm font-semibold text-white">
                      ENTRADA
                    </Text>

                    <Text className="mt-2 text-2xl font-bold text-white">
                      {formatTime(attendance.entry)}
                    </Text>
                  </View>

                  {/* Salida */}
                  <View className="flex-1 rounded-xl bg-surface-container-lowest p-4">
                    <Text className="text-sm font-semibold text-on-surface-variant">
                      SALIDA
                    </Text>

                    <Text className="mt-2 text-2xl font-bold text-primary">
                      {formatTime(attendance.exit)}
                    </Text>
                  </View>

                </View>
              </View>
            ))
          )}

        </View>
      </ScrollView>
    </View>
  );
}

