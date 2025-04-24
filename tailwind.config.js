module.exports = {
    content: [
        "./index.html",
        "./app.js",
        "./*.html",
    ],
    theme: {
        screens: {
            xs: '300px',
            sm: '640px',
            md: '768px',
            lg: '1097px',
            xl: '1280px',
            xxl: '1536px',

        },
        extend: {
            colors: {
                customBlue: '#3AB8EB',
                gray: '#3D3C3C',
                lightGray: '#676767',
                yellow: '#FDBF0F',
                Orange: '#F9784B'
            },
            fontFamily: {
                'unica': ['Unica One', 'sans-serif'],
                'syne': ['Syne', 'sans-serif']
            },
            borderRadius: {
                'custom': '0px 20px',
            },
            boxShadow: {
                'myshadow': '10px 12px 10px -6px rgba(61, 60, 60, 0.36)',
            },

        },
    },
    plugins: [
        function ({ addUtilities }) {
            addUtilities({
                '.scrollbar-none': {
                    'scrollbar-width': 'none',  /* Для Firefox */
                    '-ms-overflow-style': 'none', /* Для IE */
                },
                '.scrollbar-hidden': {
                    '::-webkit-scrollbar': {
                        display: 'none',  /* Приховує скролбар у Webkit-браузерах (Chrome, Safari) */
                    },
                },
            })
        }
    ],
}
