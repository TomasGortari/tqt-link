import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: '#2E7D32', // 🌿 Vert forêt
        secondary: '#FF9800', // 🔥 Orange feu de camp
      },
    },
  },
};
