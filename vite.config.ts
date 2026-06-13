import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In sviluppo serviamo dalla root ('/') per comodità.
// In build di produzione usiamo il `base` per GitHub Pages:
//   - se BASE_PATH è impostata (lo fa la GitHub Action col nome del repo) usa quella
//   - altrimenti default '/TavolaPeriodica3D/'
// Override manuale:  vite build --base=/NomeRepo/
export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : process.env.BASE_PATH ?? '/TavolaPeriodica3D/',
  plugins: [react()],
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1500,
  },
}))
