var _a;
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Per GitHub Pages: imposta `base` al nome del repository.
// Se pubblichi su https://<utente>.github.io/<repo>/ usa '/<repo>/'.
// Puoi sovrascriverlo da CLI:  vite build --base=/NomeRepo/
// oppure via env var BASE_PATH durante la build in CI.
var base = (_a = process.env.BASE_PATH) !== null && _a !== void 0 ? _a : '/TavolaPeriodica3D/';
export default defineConfig({
    base: base,
    plugins: [react()],
    build: {
        target: 'es2020',
        chunkSizeWarningLimit: 1500,
    },
});
