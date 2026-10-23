import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';import tw from '@tailwindcss/vite';
export default defineConfig({base:'./',plugins:[react(),tw()]});
