import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';

const API_URL = 'http://192.168.0.10:5000';

export default function RegisterFaceScreen({ route, navigation }: any) {
  const { userId, userName } = route.params;

  const cameraRef = useRef<CameraView>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null); 

  // solo toma la foto y la guarda temporalmente en el estado
  const takePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert('Error', 'La cámara todavía no está disponible.');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (!photo?.uri) {
        throw new Error('No se pudo obtener la fotografía.');
      }

      setPhotoUri(photo.uri); 
    } catch (error: any) {
      console.log('ERROR TOMANDO FOTO:', error);
      Alert.alert('Error', 'No fue posible capturar la fotografía.');
    }
  };

  // envía la foto seleccionada al backend
  const sendPhotoToBackend = async () => {
    if (!photoUri) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('user_id', String(userId));
      formData.append('image', {
        uri: photoUri,
        name: 'face.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch(`${API_URL}/face/register`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'No se pudo registrar el rostro.'
        );
      }

      Alert.alert(
        '¡Rostro registrado! 📸',
        `El rostro de ${userName} fue registrado correctamente.`,
        [
          {
            text: 'Continuar',
            onPress: () => navigation.navigate('Users'),
          },
        ]
      );
    } catch (error: any) {
      console.log('ERROR REGISTRANDO ROSTRO:', error);
      Alert.alert(
        'Error',
        error.message || 'No fue posible registrar el rostro.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#33210d" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="mb-4 text-center text-xl font-bold text-primary">
          Necesitamos acceso a la cámara 📸
        </Text>

        <Text className="mb-6 text-center text-base text-on-surface-variant">
          Para registrar el rostro de {userName}, necesitamos utilizar
          la cámara de tu dispositivo.
        </Text>

        <TouchableOpacity
          onPress={requestPermission}
          className="rounded-xl bg-primary px-8 py-4"
        >
          <Text className="text-center font-bold text-white">
            Permitir cámara
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {photoUri ? (

        <View className="flex-1 bg-black">
          <Image source={{ uri: photoUri }} className="flex-1" resizeMode="cover" />

          <View className="absolute bottom-0 left-0 right-0 bg-black/70 px-6 pb-10 pt-6">
            <Text className="mb-2 text-center text-xl font-bold text-white">
              ¿Qué tal salió la foto? 🔍
            </Text>
            <Text className="mb-5 text-center text-base text-white/80">
              Verifica que el rostro se vea claro y con buena iluminación.
            </Text>

            {/* Botón para confirmar y guardar */}
            <TouchableOpacity
              onPress={sendPhotoToBackend}
              disabled={loading}
              className="rounded-xl bg-primary p-5 mb-3"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-center text-lg font-bold text-white">
                  ✅ Usar esta foto y Guardar
                </Text>
              )}
            </TouchableOpacity>

            {/* Botón para repetir */}
            <TouchableOpacity
              onPress={() => setPhotoUri(null)}
              disabled={loading}
              className="rounded-xl bg-white/20 p-4"
            >
              <Text className="text-center font-semibold text-white">
                🔄 Repetir foto
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (

        <View className="flex-1">
          <CameraView
            ref={cameraRef}
            facing="front"
            className="flex-1"
          />

          <View className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 pb-10 pt-6">
            <Text className="mb-2 text-center text-xl font-bold text-white">
              Registrar rostro 📸
            </Text>

            <Text className="mb-5 text-center text-base text-white">
              Coloca el rostro de {userName} frente a la cámara.
            </Text>

            <TouchableOpacity
              onPress={takePhoto}
              className="rounded-xl bg-primary p-5"
            >
              <Text className="text-center text-lg font-bold text-white">
                Tomar fotografía
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('Users')}
              className="mt-3 rounded-xl bg-white/20 p-4"
            >
              <Text className="text-center font-semibold text-white">
                Registrar después
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}