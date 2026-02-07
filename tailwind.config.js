/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['Georgia', 'Times New Roman', 'serif'],
                sans: ['Noto Sans JP', 'Hiragino Sans', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 30s linear infinite',
            },
        },
    },
    plugins: [],
}
