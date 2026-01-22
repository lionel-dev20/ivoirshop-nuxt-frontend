import { defineNuxtPlugin } from "#app";

declare global {
  interface Window {
    OneSignalDeferred?: Array<(OneSignal: any) => void>;
  }
}

export default defineNuxtPlugin(() => {
  if (process.client && typeof window !== 'undefined') {
    // Attendre que l'hydratation soit terminée avant de charger les scripts
    setTimeout(() => {
      // Script OneSignal - Charger le SDK
      const oneSignalScript = document.createElement('script');
      oneSignalScript.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
      oneSignalScript.async = true;
      oneSignalScript.defer = true;
      document.head.appendChild(oneSignalScript);

      // Initialisation OneSignal
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      oneSignalScript.onload = () => {
        if (window.OneSignalDeferred) {
          window.OneSignalDeferred.push(async function(OneSignal: any) {
            // Vérifier que nous sommes sur le domaine autorisé
            if (window.location.hostname === 'www.ivoirshop.ci' || window.location.hostname === 'ivoirshop.ci') {
              try {
                await OneSignal.init({
                  appId: "c16c70ab-fa4c-429b-9cd0-84ed90343914",
                });
              } catch (error) {
                console.warn('OneSignal initialization skipped:', error);
              }
            }
          });
        }
      };

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

