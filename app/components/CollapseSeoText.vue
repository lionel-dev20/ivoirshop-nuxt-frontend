<template>
    <div class="max-w-full mx-auto md:p-6 p-4">
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
            🛒 IvoirShop.ci – Le meilleur du shopping en ligne en Côte d’Ivoire 🇨🇮
        </h2>
        
        <p class="text-gray-600 leading-relaxed mb-4">
            Boutique en ligne ivoirienne • Livraison rapide partout en Côte d’Ivoire • Paiement sécurisé
            <nav class="space-x-4 mt-2 ">
      <NuxtLink class="text-sky-600 hover:text-sky-800" to="https://ivoirshop.ci/categorie">Électroménager</NuxtLink>
      <NuxtLink class="text-sky-600 hover:text-sky-800" to="https://ivoirshop.ci/categorie/electronique/televisions">Télévisions</NuxtLink>
      <NuxtLink class="text-sky-600 hover:text-sky-800" to="https://ivoirshop.ci/categorie/ordinateurs-accessoires-informatique">Ordinateurs</NuxtLink>
      <NuxtLink class="text-sky-600 hover:text-sky-800" to="https://ivoirshop.ci/categorie/mode">Mode & Beauté</NuxtLink>
      <NuxtLink class="text-sky-600 hover:text-sky-800" to="https://ivoirshop.ci/categorie/ventes-flash">Promotions</NuxtLink>
    </nav>
            <p class="mt-6">Bienvenue sur <strong>IvoirShop.ci</strong>, votre plateforme ivoirienne de référence pour le shopping en ligne. Retrouvez en un clic vos produits préférés à prix imbattables, avec livraison rapide partout en Côte d’Ivoire et un service client disponible 7j/7</p>
        </p>

  
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-96"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="opacity-100 max-h-96"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-if="isExpanded" class="text-gray-600 leading-relaxed space-y-4 overflow-hidden">

            <div class="contentSEO">
      <mainSEO class="mainSEO">

        <section id="intro">
          <p>Bienvenue sur <strong>IvoirShop.ci</strong>, votre plateforme ivoirienne de référence pour le shopping en ligne. Retrouvez en un clic vos produits préférés à prix imbattables, avec livraison rapide partout en Côte d’Ivoire et un service client disponible 7j/7.</p>
        </section>

        <section id="electromenager">
          <h2>🏠 Électroménager de qualité à petit prix</h2>
          <p>Simplifiez votre quotidien avec notre sélection d’appareils électroménagers modernes et économiques. Sur IvoirShop, vous trouverez les meilleures marques du marché :</p>
          <p class="brandsSEO">Ilux, Leaddder, Binatone, Smart Technology, Nasco</p>
          <p>Réfrigérateurs, congélateurs, cuisinières, ventilateurs, mixeurs, bouilloires, machines à laver et climatiseurs — équipez-vous pour un confort optimal à la maison.</p>
        </section>

        <section id="televisions">
          <h2>📺 Télévisions et home cinéma pour tous les budgets</h2>
          <p>Vivez le divertissement autrement avec des Smart TV et TV LED de qualité. Retrouvez des modèles des marques :</p>
          <p class="brands">Nasco, Smart Technology, Roch, Ilux, TCL, Hisense</p>
          <p>Qualité d’image exceptionnelle, son immersif et prix attractifs — idéal pour votre salon ou votre espace multimédia.</p>
        </section>

        <section id="ordinateurs">
          <h2>💻 Ordinateurs & accessoires informatiques</h2>
          <p>Travaillez, étudiez et divertissez-vous efficacement grâce à notre gamme d’ordinateurs portables et accessoires. Les marques de confiance :</p>
          <p class="brandsSOEO">HP, Lenovo, Asus, Toshiba</p>
          <p>Nous proposons également imprimantes, claviers, souris, disques durs externes et supports pour un espace de travail complet.</p>
        </section>

        <section id="mode">
          <h2>👗 Mode, Beauté & Accessoires</h2>
          <p>Découvrez des vêtements tendance pour homme, femme et enfant, ainsi qu’une sélection d’articles de beauté et soins corporels :</p>
          <p class="brandsSEO">Sivop, Nivea, Gandour, Yves Rocher</p>
          <p>Style, qualité et livraison rapide — tout pour prendre soin de vous et de votre famille.</p>
        </section>

        <section id="promos">
          <h2>🎉 Promotions & offres spéciales</h2>
          <p>Ne ratez pas nos ventes flash et événements annuels :</p>
          <ul>
            <li><strong>Février</strong> : Saint‑Valentin — cadeaux & promotions</li>
            <li><strong>Avril</strong> : Anniversaire IvoirShop — jusqu’à -70%</li>
            <li><strong>Novembre</strong> : Black Friday ivoirien — offres exceptionnelles</li>
          </ul>
        </section>

        <section id="faqSEO">
          <h2>❓ Questions fréquentes</h2>
          <p><strong>Délais de livraison :</strong> En règle générale 2 à 5 jours ouvrables selon la localisation.</p>
          <p><strong>Modes de paiement :</strong> Mobile Money (Orange Money, MoMo, Wave), carte bancaire ou paiement à la livraison.</p>
          <p><strong>Retours :</strong> Retours possibles selon la politique produit — consultez nos conditions de remboursement.</p>
        </section>

      </mainSEO>

      <aside class="asideSEO">
        <h3>Notre promesse</h3>
        <p>Produits authentiques • Paiement sécurisé • Livraison fiable</p>

        <h3>Top catégories</h3>
        <ul>
          <li><a href="https://ivoirshop.ci/categorie/electromenager">Électroménager</a></li>
          <li><a href="https://ivoirshop.ci/categorie/electronique/televisions">TV & Home cinéma</a></li>
          <li><a href="https://ivoirshop.ci/categorie/ordinateurs-accessoires-informatique">Ordinateurs</a></li>
          <li><a href="https://ivoirshop.ci/categorie/mode">Mode & Beauté</a></li>
        </ul>

        <h3>Contact</h3>
        <p>support@ivoirshop.ci<br>+225 0701518845</p>
      </aside>
    </div>

          </div>
        </Transition>
  
        <button
          @click="isExpanded = !isExpanded"
          class="cursor-pointer mt-4 flex items-center font-black gap-2 text-gray-600 hover:text-blue-700  transition-colors"
        >
          <span>{{ isExpanded ? 'Voir moins' : 'Voir plus' }}</span>
          <svg 
            class="w-5 h-5 transition-transform duration-200"
            :class="{ 'rotate-180': isExpanded }"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const isExpanded = ref(false)
  </script>

  <style scoped>
     :root{--accent:#ff9900;--muted:#666}
    .pageSEO{max-width:980px;margin:28px auto;padding:26px;background:#fff;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.06)}
    headerSEO{display:flex;align-items:center;justify-content:space-between;gap:20px}
    .brandSEO{display:flex;flex-direction:column}
    h1{font-size:20px;margin:0 0 6px}
    p.leadSEO{margin:0;color:var(--muted);font-size:14px;margin-bottom: 22px;}
    .ctaSEO{background:var(--accent);color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none;font-weight:600}

    navSEO{margin-top:18px;border-top:1px solid #eee;padding-top:14px}
    navSEO a{color:var(--accent);text-decoration:none;margin-right:12px;font-size:13px}

    .contentSEO{display:flex;gap:28px;margin-top:18px}
    .mainSEO{flex:1}
    .asideSEO{width:260px;border-left:1px solid #f0f0f0;padding-left:20px}

    h2{font-size:16px;color:#0b603d;margin:18px 0 8px}
    h3{font-size:14px;margin:12px 0 6px}
    p{font-size:13px;line-height:1.45;color:#222;margin:8px 0}
    ul{margin:8px 0 12px 20px}
    .brandsSEO{font-weight:600;color:#0b603d}

    @media (max-width:800px){.contentSEO{flex-direction:column}.asideSEO{width:auto;border-left:0;padding-left:0}}
</style>