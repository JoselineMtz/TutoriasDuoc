import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'ConectaTutor',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      iosContentMode: 'scaleAspectFill',
    }
  },
  server: {
    cleartext: true, // Si usas HTTP en lugar de HTTPS
  }
};

export default config;
