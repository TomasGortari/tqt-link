export default ({ app }) => {
  if (process.client) {
    // Google Analytics - Initialisation
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', 'G-Z60Q3CH3EP');

    // Injecter le script Google Tag Manager dans le <head>
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-Z60Q3CH3EP';
    document.head.appendChild(script);

    // 🎯 Suivi des clics sur les liens d'affiliation
    document.addEventListener('click', function (event) {
      let target = event.target.closest('a'); // Vérifie si l'élément cliqué est un lien
      if (target) {
        const affiliateDomains = ['amazon', 'amzn']; // Ajoute d'autres domaines si nécessaire

        if (affiliateDomains.some((domain) => target.href.includes(domain))) {
          gtag('event', 'click_affiliate', {
            event_category: 'Affiliate',
            event_label: target.href,
          });

          console.log(`🛒 Lien affilié cliqué : ${target.href}`); // Debugging
        }
      }
    });
  }
};
