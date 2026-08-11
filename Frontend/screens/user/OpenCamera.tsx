import React, { useEffect, useRef, useState } from 'react';
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

export default function OpenCamera({ navigation }: any) {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);

  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const takePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'La cámara no está disponible.');
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

      console.log('📸 Foto tomada:', photo.uri);

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

      console.log('📡 Respuesta asistencia:', data);

      if (!response.ok) {
        throw new Error(
          data.message || 'No se pudo registrar la asistencia.'
        );
      }

      Alert.alert(
        '¡Asistencia registrada! 🎉',
        data.message,
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.goBack(),
          },
        ]
      );

    } catch (error: any) {
      console.error(
        '❌ ERROR REGISTRANDO ASISTENCIA:',
        error
      );

      Alert.alert(
        'No se pudo registrar',
        error.message ||
          'Ocurrió un error al procesar tu rostro.'
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

        <Text className="mt-4 text-on-surface-variant">
          Preparando cámara...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="mb-4 text-center text-lg font-bold text-on-background">
          Necesitamos acceso a tu cámara 📷
        </Text>

        <Text className="mb-6 text-center text-on-surface-variant">
          Permite el acceso a la cámara para poder registrar
          tu asistencia mediante reconocimiento facial.
        </Text>

        <TouchableOpacity
          onPress={requestPermission}
          className="rounded-xl bg-primary px-6 py-4"
        >
          <Text className="font-bold text-white">
            Permitir cámara
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">

      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="front"
      >

        {/* Encabezado */}
        <View className="px-6 pt-14">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="self-start rounded-full bg-black/50 px-4 py-2"
          >
            <Text className="font-semibold text-white">
              ← Regresar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Guía */}
        <View className="flex-1 items-center justify-center">

          <View
            style={{
              width: 250,
              height: 330,
              borderWidth: 3,
              borderColor: 'white',
              borderRadius: 130,
            }}
          />

          <Text className="mt-6 rounded-xl bg-black/60 px-5 py-3 text-center font-semibold text-white">
            Coloca tu rostro dentro del marco
          </Text>

        </View>

        {/* Botón */}
        <View className="items-center pb-12">

          <TouchableOpacity
            onPress={takePhoto}
            disabled={loading}
            className="h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white"
          >
            {loading ? (
              <ActivityIndicator
                size="large"
                color="#33210d"
              />
            ) : (
              <View className="h-14 w-14 rounded-full bg-primary" />
            )}
          </TouchableOpacity>

          <Text className="mt-4 font-semibold text-white">
            Registrar asistencia
          </Text>

        </View>

      </CameraView>
    </View>
  );
}

