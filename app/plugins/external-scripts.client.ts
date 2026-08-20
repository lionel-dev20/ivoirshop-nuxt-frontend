import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  if (process.client && typeof window !== 'undefined') {
    // Attendre que l'hydratation soit terminée avant de charger les scripts
    setTimeout(() => {
      // Script oct8ne
      const oct8ne = document.createElement("script");
      (oct8ne as any).server = "backoffice.oct8ne.com/";
      oct8ne.type = "text/javascript";
      oct8ne.async = true;
      (oct8ne as any).license = "4C07BCB6B93E50DBE02D9A061BAE86FB";
      oct8ne.src = (document.location.protocol == "https:" ? "https://" : "http://") + "static.oct8ne.com/api/v2/oct8ne.js?" + (Math.round(new Date().getTime() / 86400000));
      (oct8ne as any).locale = "fr-FR";
      (oct8ne as any).baseUrl = "//www.ivoirshop.ci";
      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(oct8ne, firstScript);
      }
    }, 100);
  }
});

