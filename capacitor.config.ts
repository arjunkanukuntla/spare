import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.spare.app',
  appName: 'SPARE',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#0F172A",
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0F172A',
    }
  }
};

export default config;
