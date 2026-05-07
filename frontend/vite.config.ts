import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'node:path'

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    plugins: [
      vue(),
      ...(isLib ? [dts({ include: ['src'], tsconfigPath: './tsconfig.json', rollupTypes: true })] : []),
    ],
    server: {
      port: 4000,
      strictPort: false,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: isLib
      ? {
          outDir: 'dist-lib',
          emptyOutDir: true,
          cssCodeSplit: false,
          lib: {
            entry: resolve(__dirname, 'src/lib.ts'),
            name: 'WemakeUI',
            formats: ['es', 'umd'],
            fileName: (format) => `wemake-ui.${format}.js`,
          },
          rollupOptions: {
            external: ['vue', 'vue-router', 'pinia', '@vueuse/core', 'lucide-vue-next'],
            output: {
              globals: {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                pinia: 'Pinia',
                '@vueuse/core': 'VueUse',
                'lucide-vue-next': 'LucideVue',
              },
            },
          },
        }
      : {
          outDir: 'dist',
          emptyOutDir: true,
        },
  }
})
