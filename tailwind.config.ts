// tailwind.config.ts
import type { Config } from 'tailwindcss'
import PrimeUI from 'tailwindcss-primeui'

const config: Partial<Config> = {
    darkMode: ['class', '[class*="app-dark"]'],
    content: [
        './components/**/*.{vue,js,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
    ],
    theme: {
        extend: {},
    },
    plugins: [PrimeUI],
}

export default config
