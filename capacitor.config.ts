import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.iscim.app',
  appName: 'iscim_player_app',
  webDir: '.output/public',
  server: {
    androidScheme: 'https'
  }
};

export default config;
