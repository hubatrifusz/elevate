/// <reference types="@capacitor/status-bar" />

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Elevate',
  webDir: 'www',
  plugins: {
    StatusBar: {
      overlaysWebView: false
    },
  },
};

export default config;
