import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.REACT_APP_STRAVA_CLIENT_ID': JSON.stringify(env.REACT_APP_STRAVA_CLIENT_ID),
        'process.env.REACT_APP_STRAVA_CLIENT_SECRET': JSON.stringify(env.REACT_APP_STRAVA_CLIENT_SECRET),
        'process.env.REACT_APP_STRAVA_REFRESH_TOKEN': JSON.stringify(env.REACT_APP_STRAVA_REFRESH_TOKEN),
        'process.env.REACT_APP_STRAVA_ATHLETE_ID': JSON.stringify(env.REACT_APP_STRAVA_ATHLETE_ID),
        'process.env.REACT_APP_INTERVALS_ATHLETE_ID': JSON.stringify(env.REACT_APP_INTERVALS_ATHLETE_ID),
        'process.env.REACT_APP_INTERVALS_API_KEY': JSON.stringify(env.REACT_APP_INTERVALS_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
