export default defineAppConfig({
  ui: {
    primary: '#2E7D32', // 🌿 Vert forêt
    secondary: '#FF9800', // 🔥 Orange feu de camp
    gray: 'cool',
    button: {
      rounded: 'rounded-full',
      default: {
        size: 'md',
        color: 'primary',
      },
    },
    input: {
      default: {
        size: 'md',
        color: 'primary',
      },
    },
    card: {
      rounded: 'rounded-xl',
      default: {
        color: 'secondary',
      },
    },
    footer: {
      top: {
        wrapper: 'border-t border-gray-200 dark:border-gray-800',
        container: 'py-8 lg:py-16',
      },
      bottom: {
        wrapper: 'border-t border-gray-200 dark:border-gray-800',
      },
    },
    page: {
      hero: {
        wrapper: 'lg:py-24',
      },
    },
  },
});
