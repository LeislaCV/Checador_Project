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

interface Attendance {
  id: number;
  user_id: number;
  user?: string;
  date: string;
  entry?: string;
  exit?: string;
  status: string;
}

type FilterType = 'week' | 'month' | 'year' | null;

export default function AdminAttendanceScreen({ navigation }: any) {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>(null);

  // ================================
  // CARGAR ASISTENCIAS
  // ================================
  const loadAttendances = async (selectedFilter: FilterType = filter) => {
    try {
      let url = `${API_URL}/attendance`;

      if (selectedFilter) {
        url += `?filter=${selectedFilter}`;
      }

      const response = await fetch(url);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'No se pudieron obtener las asistencias.'
        );
      }

      setAttendances(data);
    } catch (error: any) {
      console.log('ERROR CARGANDO ASISTENCIAS:', error);

      Alert.alert(
        'Error',
        error.message || 'No fue posible cargar las asistencias.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ================================
  // CARGAR AL ENTRAR
  // ================================
  useFocusEffect(
    useCallback(() => {
      loadAttendances();
    }, [])
  );

  // ================================
  // REFRESH
  // ================================
  const refreshAttendances = async () => {
    setRefreshing(true);
    await loadAttendances();
  };

  // ================================
  // CAMBIAR FILTRO
  // ================================
  const changeFilter = async (newFilter: FilterType) => {
    setFilter(newFilter);
    setLoading(true);

    await loadAttendances(newFilter);
  };

  // ================================
  // FORMATO FECHA
  // ================================
  const formatDate = (date: string) => {
    if (!date) return '';

    const parts = date.split('-');

    if (parts.length !== 3) {
      return date;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  };

  // ================================
  // FORMATO HORA
  // ================================
  const formatTime = (time?: string) => {
    if (!time) {
      return '--:--';
    }

    return time.substring(0, 5);
  };

  // ================================
  // TEXTO FILTRO
  // ================================
  const filterText = () => {
    switch (filter) {
      case 'week':
        return 'Esta semana';

      case 'month':
        return 'Este mes';

      case 'year':
        return 'Este año';

      default:
        return 'Todas';
    }
  };

  // ================================
  // LOADING
  // ================================
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator
          size="large"
          color="#33210d"
        />

        <Text className="mt-4 text-on-surface-variant">
          Cargando asistencias...
        </Text>
      </View>
    );
  }

  // ================================
  // PANTALLA
  // ================================
  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAttendances}
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
            Asistencias 📋
          </Text>

          <Text className="mt-2 mb-6 text-base text-on-surface-variant">
            Consulta las asistencias registradas de los usuarios.
          </Text>

          {/* FILTROS */}
          <Text className="mb-3 text-sm font-semibold text-on-surface-variant">
            Filtrar por periodo
          </Text>

          <View className="mb-6">

            {/* TODAS */}
            <TouchableOpacity
              onPress={() => changeFilter(null)}
              className={`mb-2 rounded-xl p-4 ${
                filter === null
                  ? 'bg-primary'
                  : 'bg-surface-container'
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  filter === null
                    ? 'text-white'
                    : 'text-primary'
                }`}
              >
                📋 Todas
              </Text>
            </TouchableOpacity>

            {/* SEMANA */}
            <TouchableOpacity
              onPress={() => changeFilter('week')}
              className={`mb-2 rounded-xl p-4 ${
                filter === 'week'
                  ? 'bg-primary'
                  : 'bg-surface-container'
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  filter === 'week'
                    ? 'text-white'
                    : 'text-primary'
                }`}
              >
                📆 Esta semana
              </Text>
            </TouchableOpacity>

            {/* MES */}
            <TouchableOpacity
              onPress={() => changeFilter('month')}
              className={`mb-2 rounded-xl p-4 ${
                filter === 'month'
                  ? 'bg-primary'
                  : 'bg-surface-container'
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  filter === 'month'
                    ? 'text-white'
                    : 'text-primary'
                }`}
              >
                📅 Este mes
              </Text>
            </TouchableOpacity>

            {/* AÑO */}
            <TouchableOpacity
              onPress={() => changeFilter('year')}
              className={`rounded-xl p-4 ${
                filter === 'year'
                  ? 'bg-primary'
                  : 'bg-surface-container'
              }`}
            >
              <Text
                className={`text-center font-bold ${
                  filter === 'year'
                    ? 'text-white'
                    : 'text-primary'
                }`}
              >
                🗓️ Este año
              </Text>
            </TouchableOpacity>

          </View>

          {/* RESUMEN */}
          <View className="mb-6 rounded-xl bg-surface-container p-5">
            <Text className="text-sm text-on-surface-variant">
              Periodo seleccionado
            </Text>

            <Text className="mt-1 text-xl font-bold text-primary">
              {filterText()}
            </Text>

            <Text className="mt-2 text-sm text-on-surface-variant">
              {attendances.length} registro(s)
            </Text>
          </View>

          {/* SIN ASISTENCIAS */}
          {attendances.length === 0 ? (
            <View className="rounded-xl bg-surface-container p-8">
              <Text className="text-center text-4xl">
                📋
              </Text>

              <Text className="mt-3 text-center text-lg font-bold text-on-background">
                No hay asistencias
              </Text>

              <Text className="mt-2 text-center text-sm text-on-surface-variant">
                No existen registros para el periodo seleccionado.
              </Text>
            </View>
          ) : (
            attendances.map((attendance) => (
              <View
                key={attendance.id}
                className="mb-4 rounded-xl bg-surface-container p-5"
              >

                {/* USUARIO */}
                <Text className="text-sm font-semibold text-on-surface-variant">
                  👤 Usuario
                </Text>

                <Text className="mt-1 text-xl font-bold text-on-background">
                  {attendance.user ||
                    `Usuario #${attendance.user_id}`}
                </Text>

                {/* FECHA */}
                <Text className="mt-4 text-sm text-on-surface-variant">
                  📅 Fecha
                </Text>

                <Text className="mt-1 text-base font-semibold text-on-background">
                  {formatDate(attendance.date)}
                </Text>

                {/* HORARIOS */}
                <View className="mt-4 flex-row">

                  <View className="mr-2 flex-1 rounded-lg bg-surface-container-lowest p-4">
                    <Text className="text-center text-sm text-on-surface-variant">
                      🟢 Entrada
                    </Text>

                    <Text className="mt-1 text-center text-lg font-bold text-primary">
                      {formatTime(attendance.entry)}
                    </Text>
                  </View>

                  <View className="ml-2 flex-1 rounded-lg bg-surface-container-lowest p-4">
                    <Text className="text-center text-sm text-on-surface-variant">
                      🔴 Salida
                    </Text>

                    <Text className="mt-1 text-center text-lg font-bold text-primary">
                      {formatTime(attendance.exit)}
                    </Text>
                  </View>

                </View>

                {/* ESTADO */}
                <View className="mt-4 rounded-lg bg-surface-container-lowest p-3">
                  <Text className="text-center font-bold text-primary">
                    {attendance.status === 'asistencia'
                      ? 'Asistencia ✅'
                      : attendance.status}
                  </Text>
                </View>

              </View>
            ))
          )}

        </View>
      </ScrollView>
    </View>
  );
}