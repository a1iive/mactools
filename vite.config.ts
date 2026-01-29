
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // The third parameter '' is important to load all variables from process.env without prefix requirement.
  // Fix: Casting process to any to access cwd() which might be missing in some TypeScript environments during build/linting
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Vercel or other CI environments might have API_KEY directly in process.env
  const apiKey = env.API_KEY || process.env.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Use JSON.stringify to ensure it's treated as a string literal in the source code
      'process.env.API_KEY': JSON.stringify(apiKey)
    }
  };
});
