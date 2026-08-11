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

interface Schedule {
  id: number;
  start: string;
  end: string;
  day: string;
  tolerance_minutes: number;
}

export default function ScheduleScreen({ navigation }: any) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [day, setDay] = useState('');
  const [tolerance, setTolerance] = useState('10');

  const [saving, setSaving] = useState(false);

  const loadSchedules = async () => {
    try {
      const response = await fetch(
        `${API_URL}/schedules/all`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'No se pudieron obtener los horarios.'
        );
      }

      setSchedules(data);
    } catch (error: any) {
      console.log('ERROR HORARIOS:', error);

      Alert.alert(
        'Error',
        error.message || 'No fue posible cargar los horarios.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSchedules();
    }, [])
  );


  const refreshSchedules = async () => {
    setRefreshing(true);
    await loadSchedules();
  };

  const clearForm = () => {
    setStart('');
    setEnd('');
    setDay('');
    setTolerance('10');
    setEditingId(null);
  };

  const openCreateForm = () => {
    clearForm();
    setShowForm(true);
  };

  const openEditForm = (schedule: Schedule) => {
    setEditingId(schedule.id);
    setStart(schedule.start);
    setEnd(schedule.end);
    setDay(schedule.day);
    setTolerance(
      String(schedule.tolerance_minutes)
    );

    setShowForm(true);
  };
  const saveSchedule = async () => {
    if (
      !start.trim() ||
      !end.trim() ||
      !day.trim() ||
      !tolerance.trim()
    ) {
      Alert.alert(
        'Campos obligatorios',
        'Completa todos los campos del horario.'
      );
      return;
    }

    const toleranceNumber = Number(tolerance);

    if (
      Number.isNaN(toleranceNumber) ||
      toleranceNumber < 0
    ) {
      Alert.alert(
        'Tolerancia inválida',
        'La tolerancia debe ser un número mayor o igual a 0.'
      );
      return;
    }

    setSaving(true);

    try {
      const isEditing = editingId !== null;

      const url = isEditing
        ? `${API_URL}/schedules/${editingId}`
        : `${API_URL}/schedules`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },

        body: JSON.stringify({
          start: start.trim(),
          end: end.trim(),
          day: day.trim(),
          tolerance_minutes: toleranceNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'No se pudo guardar el horario.'
        );
      }

      Alert.alert(
        '¡Listo! ⏰',
        isEditing
          ? 'El horario fue actualizado correctamente.'
          : 'El horario fue creado correctamente.'
      );

      clearForm();
      setShowForm(false);

      await loadSchedules();
    } catch (error: any) {
      console.log(
        'ERROR GUARDANDO HORARIO:',
        error
      );

      Alert.alert(
        'Error',
        error.message ||
          'No fue posible guardar el horario.'
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteSchedule = (id: number) => {
    Alert.alert(
      'Eliminar horario',
      '¿Seguro que deseas eliminar este horario?',
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
                `${API_URL}/schedules/${id}`,
                {
                  method: 'DELETE',
                }
              );

              const data = await response.json();

              if (!response.ok) {
                throw new Error(
                  data.message ||
                    'No se pudo eliminar el horario.'
                );
              }

              Alert.alert(
                'Listo',
                'Horario eliminado correctamente.'
              );

              await loadSchedules();
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message ||
                  'No fue posible eliminar el horario.'
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator
          size="large"
          color="#33210d"
        />

        <Text className="mt-4 text-on-surface-variant">
          Cargando horarios...
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
            onRefresh={refreshSchedules}
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
            Horarios ⏰
          </Text>

          <Text className="mt-2 mb-6 text-base text-on-surface-variant">
            Administra los horarios de trabajo.
          </Text>

          {/* NUEVO HORARIO */}

          <TouchableOpacity
            className="mb-6 rounded-xl bg-primary p-5"
            onPress={() => {
              if (showForm) {
                clearForm();
              }

              setShowForm(!showForm);
            }}
          >
            <Text className="text-center text-lg font-bold text-white">
              {showForm
                ? '✕ Cancelar'
                : '+ Nuevo horario'}
            </Text>
          </TouchableOpacity>

          {/* FORMULARIO */}

          {showForm && (
            <View className="mb-7 rounded-xl bg-surface-container p-5">

              <Text className="mb-5 text-xl font-bold text-on-background">
                {editingId
                  ? 'Editar horario ✏️'
                  : 'Nuevo horario 📝'}
              </Text>

              {/* INICIO */}

              <Text className="mb-2 font-semibold text-on-background">
                Hora de entrada *
              </Text>

              <TextInput
                value={start}
                onChangeText={setStart}
                placeholder="08:00"
                placeholderTextColor="#80756c"
                className="mb-5 rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
              />

              {/* FIN */}

              <Text className="mb-2 font-semibold text-on-background">
                Hora de salida *
              </Text>

              <TextInput
                value={end}
                onChangeText={setEnd}
                placeholder="16:00"
                placeholderTextColor="#80756c"
                className="mb-5 rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
              />

              {/* DÍAS */}

              <Text className="mb-2 font-semibold text-on-background">
                Días *
              </Text>

              <TextInput
                value={day}
                onChangeText={setDay}
                placeholder="lunes, martes, miercoles, jueves, viernes"
                placeholderTextColor="#80756c"
                multiline
                className="mb-5 rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
              />

              {/* TOLERANCIA */}

              <Text className="mb-2 font-semibold text-on-background">
                Tolerancia en minutos *
              </Text>

              <TextInput
                value={tolerance}
                onChangeText={setTolerance}
                placeholder="10"
                placeholderTextColor="#80756c"
                keyboardType="numeric"
                className="mb-5 rounded-xl bg-surface-container-lowest px-4 py-4 text-on-background"
              />

              {/* GUARDAR */}

              <TouchableOpacity
                disabled={saving}
                onPress={saveSchedule}
                className={`rounded-xl p-4 ${
                  saving
                    ? 'bg-secondary'
                    : 'bg-primary'
                }`}
              >
                {saving ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-center font-bold text-white">
                    {editingId
                      ? 'Guardar cambios'
                      : 'Crear horario'}
                  </Text>
                )}
              </TouchableOpacity>

            </View>
          )}

          {/* CONTADOR */}

          <Text className="mb-4 text-sm font-semibold text-on-surface-variant">
            {schedules.length} horario(s) registrado(s)
          </Text>

          {/* SIN HORARIOS */}

          {schedules.length === 0 ? (
            <View className="rounded-xl bg-surface-container p-8">

              <Text className="text-center text-4xl">
                ⏰
              </Text>

              <Text className="mt-3 text-center text-lg font-bold text-on-background">
                No hay horarios
              </Text>

              <Text className="mt-2 text-center text-sm text-on-surface-variant">
                Crea el primer horario de trabajo.
              </Text>

            </View>
          ) : (
            schedules.map((schedule) => (
              <View
                key={schedule.id}
                className="mb-4 rounded-xl bg-surface-container p-5"
              >

                {/* HORARIO */}

                <Text className="text-xl font-bold text-on-background">
                  ⏰ {schedule.start} - {schedule.end}
                </Text>

                {/* DÍAS */}

                <Text className="mt-3 text-sm text-on-surface-variant">
                  📅 {schedule.day}
                </Text>

                {/* TOLERANCIA */}

                <View className="mt-4 rounded-lg bg-surface-container-lowest p-3">
                  <Text className="text-center font-bold text-primary">
                    🕐 Tolerancia: {schedule.tolerance_minutes} minutos
                  </Text>
                </View>

                {/* BOTONES */}

                <View className="mt-4 flex-row">

                  <TouchableOpacity
                    onPress={() =>
                      openEditForm(schedule)
                    }
                    className="mr-2 flex-1 rounded-lg bg-primary p-3"
                  >
                    <Text className="text-center font-bold text-white">
                      ✏️ Editar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      deleteSchedule(schedule.id)
                    }
                    className="ml-2 flex-1 rounded-lg bg-error-container p-3"
                  >
                    <Text className="text-center font-bold text-error">
                      🗑️ Eliminar
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