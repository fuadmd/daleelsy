
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  define: {
    // يضمن أن التطبيق يمكنه قراءة API_KEY من Vercel
    'process.env': process.env
  }
});
