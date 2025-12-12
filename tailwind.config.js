/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // 食物主题色彩体系
                'food': {
                    // 主色调 - 温暖食欲系
                    'orange': '#FF6B35',
                    'red': '#DC143C',
                    'gold': '#FFD700',
                    'green': '#4CAF50',
                    'cream': '#FFF8DC',
                    'brown': '#8B4513',
                    
                    // 渐变色
                    'gradient-start': '#FF6B35',
                    'gradient-end': '#F7931E',
                    
                    // 功能色
                    'primary': '#FF6B35',
                    'secondary': '#4CAF50',
                    'accent': '#FFD700',
                    'danger': '#DC143C',
                    'warning': '#FFA500',
                    'success': '#4CAF50',
                    'info': '#2196F3',
                    
                    // 中性色
                    'light': '#FFF8DC',
                    'medium': '#F5F5DC',
                    'dark': '#8B4513',
                    'darker': '#654321',
                },
                
                // 扩展现有色彩
                amber: {
                    50: '#FFF8DC',
                    100: '#FFECB3',
                    200: '#FFE082',
                    300: '#FFD54F',
                    400: '#FFCA28',
                    500: '#FFC107',
                    600: '#FFB300',
                    700: '#FFA000',
                    800: '#FF8F00',
                    900: '#FF6F00',
                },
            },
            fontFamily: {
                'food': ['Noto Sans SC', 'Microsoft YaHei', 'sans-serif'],
                'title': ['Noto Serif SC', 'SimSun', 'serif'],
            },
            backgroundImage: {
                'food-gradient': 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                'warm-gradient': 'linear-gradient(120deg, #FFF8DC 0%, #FFE4B5 100%)',
                'food-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            },
            boxShadow: {
                'food': '0 4px 6px -1px rgba(255, 107, 53, 0.3), 0 2px 4px -1px rgba(255, 107, 53, 0.2)',
                'food-lg': '0 10px 15px -3px rgba(255, 107, 53, 0.3), 0 4px 6px -2px rgba(255, 107, 53, 0.2)',
                'warm': '0 4px 6px -1px rgba(255, 215, 0, 0.2), 0 2px 4px -1px rgba(255, 215, 0, 0.1)',
            },
            animation: {
                'bounce-slow': 'bounce 2s infinite',
                'pulse-slow': 'pulse 3s infinite',
                'wiggle': 'wiggle 1s ease-in-out infinite',
            },
            keyframes: {
                wiggle: {
                    '0%, 100%': { transform: 'rotate(-3deg)' },
                    '50%': { transform: 'rotate(3deg)' },
                }
            }
        },
    },
    plugins: [],
}
