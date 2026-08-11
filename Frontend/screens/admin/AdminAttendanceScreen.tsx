import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://192.168.0.10:5000';

export default function AdminAttendanceScreen({ navigation }: any) {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 

  const fetchAttendances = async (filterType = 'all') => {
    setLoading(true);
    try {

      const endpoint =
        filterType === 'all'
          ? `${API_URL}/attendance/history/all`
          : `${API_URL}/attendance/history/all?filter=${filterType}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (response.ok) {
        setAttendances(data.attendances || data);
      }
    } catch (error) {
      console.log('Error obteniendo asistencias:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances(filter);
  }, [filter]);

  return (
    <ScrollView className="flex-1 bg-background px-6 pt-12 pb-10">
      {/* Regresar */}
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-4">
        <Text className="text-base font-semibold text-primary">← Regresar</Text>
      </TouchableOpacity>

      {/* Encabezado */}
      <Text className="text-sm font-semibold text-on-surface-variant">
        ADMINISTRACIÓN
      </Text>
      <Text className="mt-2 text-3xl font-bold text-primary">
        Asistencias y Registros 📋
      </Text>
      <Text className="mt-2 mb-6 text-base text-on-surface-variant">
        Consulta el historial de asistencias de la organización.
      </Text>

      {/* Filtros de periodo */}
      <View className="mb-6 flex-row justify-between">
        {[
          { key: 'all', label: 'Todas' },
          { key: 'week', label: 'Semana' },
          { key: 'month', label: 'Mes' },
          { key: 'year', label: 'Año' },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            onPress={() => setFilter(item.key)}
            className={`rounded-xl px-4 py-3 ${
              filter === item.key ? 'bg-primary' : 'bg-surface-container'
            }`}
          >
            <Text
              className={`font-semibold ${
                filter === item.key ? 'text-white' : 'text-on-background'
              }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de asistencias */}
      {loading ? (
        <View className="mt-20 items-center justify-center">
          <ActivityIndicator size="large" color="#33210d" />
        </View>
      ) : attendances.length === 0 ? (
        <View className="mt-16 items-center">
          <Text className="text-base text-on-surface-variant">
            No hay registros de asistencia disponibles.
          </Text>
        </View>
      ) : (
        attendances.map((item, index) => (
          <View
            key={index}
            className="mb-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm"
          >
            <Text className="text-sm font-semibold text-on-surface-variant">
              👤 Usuario: {item.user_name || `ID: ${item.user_id}`}
            </Text>

            <Text className="mt-1 text-base font-bold text-on-background">
              📅 Fecha: {item.date}
            </Text>

            <View className="mt-3 flex-row justify-between">
              <View className="rounded-xl bg-surface-container p-3 flex-1 mr-2">
                <Text className="text-xs text-on-surface-variant">Entrada</Text>
                <Text className="font-bold text-on-background mt-1">
                  🟢 {item.check_in || '--:--'}
                </Text>
              </View>

              <View className="rounded-xl bg-surface-container p-3 flex-1 ml-2">
                <Text className="text-xs text-on-surface-variant">Salida</Text>
                <Text className="font-bold text-on-background mt-1">
                  🔴 {item.check_out || '--:--'}
                </Text>
              </View>
            </View>

            <View className="mt-3 items-center rounded-xl bg-surface-container p-3">
              <Text className="font-bold text-primary">
                Estado: {item.status}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}