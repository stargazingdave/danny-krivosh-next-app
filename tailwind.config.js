// tailwind.config.js
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'], // adjust if needed
    theme: {
        extend: {
            keyframes: {
                'fade-out': {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0', visibility: 'hidden' },
                },
            },
            animation: {
                'fade-out': 'fade-out 1s ease-out forwards',
            },
        },
    },
    plugins: [],
}
