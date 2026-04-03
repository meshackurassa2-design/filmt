import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.filamutimes.app',
  appName: 'Filamu Times Premium',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: true,
      backgroundColor: "#000000"
    },
  },
  server: {
    androidScheme: 'https',
    iosScheme: 'https'
  }
};

export default config;
