import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

const API_URL = 'http://192.168.0.10:5000';

export default function AttendanceScreen({ navigation }: any) {
  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);

  const takeAttendance = async () => {
    if (!cameraRef.current) {
      Alert.alert(
        'Error',
        'La cámara todavía no está disponible.'
      );
      return;
    }

    try {
      setLoading(true);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (!photo?.uri) {
        throw new Error('No se pudo obtener la fotografía.');
      }

      const formData = new FormData();

      formData.append('image', {
        uri: photo.uri,
        name: 'attendance.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch(
        `${API_URL}/attendance/facial`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
  data.detail || data.message || 'No se pudo registrar la asistencia.'
);
      }

      let title = '¡Asistencia registrada! 🎉';

      if (data.type === 'entrada') {
        title = '¡Entrada registrada! 🟢';
      }

      if (data.type === 'salida') {
        title = '¡Salida registrada! 🔵';
      }

      Alert.alert(
        title,
        data.message || 'La asistencia se registró correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error: any) {
      console.log(
        'ERROR REGISTRANDO ASISTENCIA:',
        error
      );

      Alert.alert(
        'No se pudo registrar',
        error.message ||
          'No fue posible procesar el reconocimiento facial.'
      );

    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator
          size="large"
          color="#33210d"
        />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">

        <Text className="mb-4 text-center text-2xl font-bold text-primary">
          Necesitamos acceso a la cámara 📸
        </Text>

        <Text className="mb-6 text-center text-base text-on-surface-variant">
          La cámara se utiliza para verificar tu identidad y
          registrar tu asistencia.
        </Text>

        <TouchableOpacity
          onPress={requestPermission}
          className="rounded-xl bg-primary px-8 py-4"
        >
          <Text className="font-bold text-white">
            Permitir cámara
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4"
        >
          <Text className="font-semibold text-primary">
            Cancelar
          </Text>
        </TouchableOpacity>

      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">

      {/* Cámara */}
      <CameraView
        ref={cameraRef}
        facing="front"
        className="flex-1"
      />

      {/* Panel inferior */}
      <View className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 pb-10 pt-6">

        <Text className="mb-2 text-center text-2xl font-bold text-white">
          Registrar asistencia 📸
        </Text>

        <Text className="mb-5 text-center text-base text-white">
          Coloca tu rostro frente a la cámara.
        </Text>

        <TouchableOpacity
          onPress={takeAttendance}
          disabled={loading}
          className="rounded-xl bg-primary p-5"
        >
          {loading ? (
            <>
              <ActivityIndicator color="#ffffff" />

              <Text className="mt-2 text-center font-semibold text-white">
                Verificando rostro...
              </Text>
            </>
          ) : (
            <Text className="text-center text-lg font-bold text-white">
              Registrar asistencia
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
          className="mt-3 rounded-xl bg-white/20 p-4"
        >
          <Text className="text-center font-semibold text-white">
            Cancelar
          </Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
