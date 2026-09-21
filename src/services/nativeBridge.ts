import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const triggerHapticFeedback = async () => {
  if (isNativePlatform()) {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
      // Ignore fallback
    }
  }
};

export const getNativeDeviceLocation = async (): Promise<{ lat: number; lng: number } | null> => {
  try {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 5000,
    });
    return {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude,
    };
  } catch (e) {
    return null;
  }
};

export const captureNativeCameraPhoto = async (): Promise<string | null> => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    return image.webPath || null;
  } catch (e) {
    return null;
  }
};
