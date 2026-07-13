<!-- pages/cgv.vue -->
<template>
  <div class="bg-gray-50">
    <!-- En-tête / Hero -->
    <section class="relative overflow-hidden bg-gradient-to-r from-[#f56100] to-[#f77f00] text-white">
      <!-- Décor SVG animé : thème commerce / livraison -->
      <div class="hero-deco pointer-events-none absolute inset-0" aria-hidden="true">
        <!-- Sac de shopping -->
        <svg class="deco deco-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <!-- Camion de livraison -->
        <svg class="deco deco-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.9 17.9 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.55 48.55 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
        <!-- Carton / colis -->
        <svg class="deco deco-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
        <!-- Flèche retour / remboursement -->
        <svg class="deco deco-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
        <!-- Étiquette / réduction -->
        <svg class="deco deco-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.1 18.1 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
          <path d="M6 6h.008v.008H6V6Z" />
        </svg>
        <!-- Carte bancaire -->
        <svg class="deco deco-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
        </svg>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <nav class="flex items-center gap-2 text-sm text-white/80 mb-6">
          <NuxtLink to="/" class="hover:text-white transition-colors">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-white font-medium">CGV</span>
        </nav>
        <h1 class="text-3xl md:text-5xl font-bold tracking-tight">
          Conditions générales de vente
        </h1>
        <p class="mt-4 text-white/90 max-w-2xl text-sm md:text-base leading-relaxed">
          Politique de retour et de remboursement, conditions d'utilisation, protection
          des données, livraison et informations sur <span class="font-semibold">ivoirshop.ci</span>.
        </p>
        <p class="mt-6 inline-flex items-center gap-2 text-xs md:text-sm bg-white/15 rounded-full px-4 py-1.5">
          Dernière mise à jour : {{ lastUpdate }}
        </p>
      </div>
    </section>

    <!-- Contenu -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">

        <!-- Sommaire (Table des matières) -->
        <aside class="lg:col-span-1">
          <div class="lg:sticky lg:top-6">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 class="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">
                Sommaire
              </h2>
              <nav>
                <ul class="space-y-1">
                  <li v-for="section in sections" :key="section.id">
                    <a
                      :href="`#${section.id}`"
                      @click="activeSection = section.id"
                      class="group flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
                      :class="activeSection === section.id
                        ? 'bg-orange-50 text-[#f56100] font-medium'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-[#f56100]'"
                    >
                      <span
                        class="shrink-0 w-6 h-6 rounded-md text-xs font-semibold flex items-center justify-center transition-colors"
                        :class="activeSection === section.id
                          ? 'bg-[#f56100] text-white'
                          : 'bg-gray-100 text-gray-500 group-hover:bg-[#f56100] group-hover:text-white'"
                      >
                        {{ section.number }}
                      </span>
                      <span class="leading-snug">{{ section.title }}</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </aside>

        <!-- Articles -->
        <div class="lg:col-span-3 space-y-4">

          <!-- 1. Politique de retour -->
          <article id="retour" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">1</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Politique de retour</h2>
            </header>

            <div class="rounded-xl mb-2 md:mb-8 bg-orange-50 border border-orange-100 p-4 text-sm text-gray-700">
              Vous disposez de <span class="font-semibold text-[#f56100]">7 jours ouvrés</span> après la livraison
              de votre commande pour effectuer le retour d'un article.
            </div>

            <div class="space-y-3">
              <details class="faq group" open>
                <summary class="faq-summary">
                  <span>Comment retourner un produit ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>Faire une demande de retour est simple, il suffit de suivre ces étapes :</p>
                  <ol class="list-decimal pl-5 space-y-2 my-3">
                    <li>
                      <span class="font-medium text-gray-900">Contactez le service client</span> pour vérifier
                      l'éligibilité de votre retour au <span class="font-medium text-gray-900">07 77 28 36 48</span>,
                      du lundi au vendredi de 08h00 à 18h00 et le samedi de 10h00 à 15h00.
                    </li>
                    <li>
                      <span class="font-medium text-gray-900">Déposez votre article</span> au point relais Ivoirshop ou
                      au SAV de nos partenaires agréés pour les articles sous garantie. L'article doit être retourné avec
                      tous ses accessoires et dans son emballage d'origine.
                    </li>
                  </ol>
                  <p>Tous les articles retournés sont soumis à un examen de vérification. Motifs d'acceptation du retour :</p>
                  <ul class="list-disc pl-5 space-y-1 my-3">
                    <li>Défaut de fabrication</li>
                    <li>Pièce manquante</li>
                    <li>Non-conformité avec le produit proposé sur le site</li>
                    <li>Changement d'avis</li>
                  </ul>
                  <div class="rounded-lg bg-red-50 border border-red-100 p-3 text-[13px] text-red-800">
                    <span class="font-semibold">Attention :</span> si le problème découle de l'utilisation du client
                    et/ou que toutes les conditions de retour ne sont pas réunies, le retour sera refusé. L'article devra
                    être retiré au point Ivoirshop choisi préalablement par le client. Aucun retour ne sera accepté au-delà
                    de 7 jours après la réception de la commande.
                  </div>
                </div>
              </details>

              <details class="faq group">
                <summary class="faq-summary">
                  <span>Quel est le délai de retour et de remboursement ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>
                    La procédure de retour commence à partir de la vérification de votre produit en agence. Les
                    remboursements pour les articles retournés sont effectués dans un délai de
                    <span class="font-medium text-gray-900">3 à 10 jours</span>. Les remboursements se font exclusivement
                    par bon d'achat Ivoirshop.
                  </p>
                  <p class="mt-2">
                    Si le remboursement n'est pas effectué dans un délai de 10 jours, contactez le service client au
                    <span class="font-medium text-gray-900">03 03 60 12</span>, du lundi au vendredi de 08h00 à 18h00 et le
                    samedi de 10h00 à 17h00.
                  </p>
                </div>
              </details>

              <details class="faq group">
                <summary class="faq-summary">
                  <span>Quelles sont les conditions et la procédure de retour ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>Pour procéder au retour d'un produit, il faut :</p>
                  <ul class="list-disc pl-5 space-y-1 my-3">
                    <li>Contacter le service client au <span class="font-medium text-gray-900">07 77 28 36 48</span> (lundi au vendredi 08h00–18h00, samedi 10h00–17h00) pour connaître l'éligibilité du retour.</li>
                    <li>Se munir de la facture d'achat présente sur le sac de livraison ou apposée sur le colis.</li>
                    <li>Retourner l'article au point Ivoirshop avec tous ses accessoires et son conditionnement d'origine.</li>
                  </ul>
                  <div class="rounded-lg bg-red-50 border border-red-100 p-3 text-[13px] text-red-800 my-3">
                    <span class="font-semibold">Attention :</span> tous les articles sous scellé ne peuvent pas être
                    retournés pour changement d'avis après avoir été descellés.
                  </div>
                  <p class="font-medium text-gray-900">Ne peuvent pas être retournés :</p>
                  <ul class="list-disc pl-5 space-y-1 my-3">
                    <li>Sous-vêtements, maillots de bain, sextoys</li>
                    <li>Produits de soin, beauté, cosmétique et d'hygiène</li>
                    <li>Accessoires de beauté et d'hygiène (perruques, boucles d'oreilles, peignes, serviettes, tondeuses et rasoirs déjà utilisés, etc.)</li>
                    <li>Alimentaire et consommables (cigares, boissons)</li>
                    <li>Accessoires pour téléphone (films de protection, étuis, covers, coques)</li>
                    <li>Livres, CD, DVD, logiciels et accessoires électroniques (écouteurs, chargeurs, casques audio, …)</li>
                    <li>Meubles</li>
                    <li>Matelas</li>
                    <li>Panneaux solaires</li>
                  </ul>
                  <p class="font-medium text-gray-900">Motifs de retour acceptés :</p>
                  <ul class="list-disc pl-5 space-y-1 my-3">
                    <li>Défaut de fabrication</li>
                    <li>Pièce manquante</li>
                    <li>Non-conformité avec le produit proposé sur le site</li>
                    <li>Changement d'avis</li>
                  </ul>
                  <div class="rounded-lg bg-red-50 border border-red-100 p-3 text-[13px] text-red-800">
                    <span class="font-semibold">Attention :</span> un article non conforme et incomplet sous scellé ne
                    peut pas être retourné après utilisation. Un article défectueux ne peut pas être retourné sans facture.
                  </div>
                </div>
              </details>

              <details class="faq group">
                <summary class="faq-summary">
                  <span>Puis-je effectuer un échange de produit ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>
                    Il n'est pas possible d'effectuer un échange de produit. Tout article retourné est sujet à un
                    remboursement si le retour a été validé par le service après-vente.
                  </p>
                </div>
              </details>

              <details class="faq group">
                <summary class="faq-summary">
                  <span>Mon produit est-il sous garantie ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>
                    Pour vérifier si un article est couvert par une garantie, consultez sa fiche produit sur le site ou le
                    compte client ayant été utilisé lors de la passation de la commande.
                  </p>
                </div>
              </details>

              <details class="faq group">
                <summary class="faq-summary">
                  <span>Que faire si ma demande de retour a été refusée ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>
                    Si la demande de retour est refusée, c'est qu'une ou plusieurs conditions requises n'ont pas été
                    respectées. Le service après-vente contactera alors le client par e-mail, SMS ou téléphone pour
                    apporter plus d'informations sur le refus. Une liste d'agences proches du domicile du client lui sera
                    proposée pour récupérer le produit ; à défaut, le service de livraison déposera l'article à l'adresse
                    indiquée par le client.
                  </p>
                  <p class="mt-2">
                    Un article refusé par le service après-vente reste disponible au retrait durant
                    <span class="font-medium text-gray-900">90 jours</span>. Passé ce délai, l'article partira
                    automatiquement à la destruction.
                  </p>
                </div>
              </details>
            </div>
          </article>

          <!-- 2. Politique de remboursement -->
          <article id="remboursement" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">2</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Politique de remboursement</h2>
            </header>

            <div class="space-y-3">
              <details class="faq group" open>
                <summary class="faq-summary">
                  <span>Si mon retour est accepté, comment et quand serai-je remboursé ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>
                    La procédure de remboursement commence après l'examen de votre produit. Les remboursements pour les
                    articles retournés ne faisant pas l'objet d'un traitement SAV sont effectués dans un délai de
                    <span class="font-medium text-gray-900">3 à 10 jours</span>.
                  </p>
                  <p class="mt-2">
                    Les remboursements se font exclusivement par <span class="font-medium text-gray-900">bon d'achat
                    Ivoirshop, Orange Mobile Money ou MTN Mobile Money</span>. Le remboursement par Orange Money ou MTN
                    Mobile Money se fait exclusivement sur le compte ayant servi au paiement de la commande. Pour des
                    raisons de sécurité, Ivoirshop n'acceptera pas de rembourser le compte d'une tierce personne.
                  </p>
                  <div class="rounded-lg bg-orange-50 border border-orange-100 p-3 text-[13px] text-gray-700 mt-3">
                    <span class="font-semibold text-[#f56100]">Important :</span> pour recevoir votre remboursement sur
                    votre compte Mobile Money, veuillez :
                    <ul class="list-disc pl-5 space-y-1 mt-2">
                      <li>Vérifier que le plafond de votre compte n'est pas déjà atteint (modifiable auprès de votre opérateur mobile).</li>
                      <li>Faire identifier correctement votre ligne auprès de votre opérateur mobile, muni de vos documents d'identification.</li>
                    </ul>
                  </div>
                </div>
              </details>

              <details class="faq group">
                <summary class="faq-summary">
                  <span>Qu'est-ce qu'un bon d'achat ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>
                    Un bon d'achat est un code correspondant au montant de votre remboursement. Vous pouvez l'utiliser
                    comme un code promotionnel pour l'achat d'un produit. Un bon d'achat est valide
                    <span class="font-medium text-gray-900">180 jours</span> ; vous devez l'utiliser pendant cette période.
                  </p>
                </div>
              </details>

              <details class="faq group">
                <summary class="faq-summary">
                  <span>Comment utiliser mon bon d'achat ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>
                    Entrez le code du bon dans la case dédiée, située dans le coin droit du mode de paiement, puis cliquez
                    sur « ajouter le bon d'achat ». Pour retrouver votre code : ouvrez une nouvelle fenêtre, allez sur
                    <span class="font-medium text-gray-900">www.ivoirshop.ci</span>, rendez-vous dans « mon compte » puis,
                    à gauche, cliquez sur « mes réductions ». Copiez le code du bon souhaité et collez-le dans la case
                    dédiée. Cliquez enfin sur « confirmer la commande » pour terminer.
                  </p>
                </div>
              </details>

              <details class="faq group">
                <summary class="faq-summary">
                  <span>Les bons marketing sont-ils remboursables ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>
                    Les bons marketing ne sont pas remboursables. Ivoirshop s'excuse pour les désagréments que cela
                    pourrait occasionner.
                  </p>
                </div>
              </details>

              <details class="faq group">
                <summary class="faq-summary">
                  <span>Si mon produit n'est pas éligible à un remboursement, comment serai-je informé ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>
                    Si votre demande de remboursement est rejetée, Ivoirshop vous contactera pour vous expliquer la raison
                    du refus ; votre produit sera réparé ou renvoyé chez vous selon le cas. Nous essaierons de vous livrer
                    votre produit ; en cas d'échec, il restera à votre disposition dans nos entrepôts pendant
                    <span class="font-medium text-gray-900">60 jours</span>.
                  </p>
                </div>
              </details>

              <details class="faq group">
                <summary class="faq-summary">
                  <span>J'ai acheté un produit en promotion ou avec un code promo : quel montant sera remboursé ?</span>
                  <svg class="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div class="faq-body">
                  <p>
                    Pour les produits en promotion, le montant remboursé correspond au montant payé. Par exemple : si vous
                    avez acheté un produit en promotion à 2 000 F CFA (prix original 4 000 F CFA), vous serez remboursé du
                    montant payé, soit 2 000 F CFA. Si vous avez utilisé un bon d'achat, le montant payé ainsi que le
                    montant du bon d'achat utilisé seront remboursés.
                  </p>
                </div>
              </details>
            </div>
          </article>

          <!-- 3. Conditions générales d'utilisation -->
          <article id="cgu" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">3</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Conditions générales d'utilisation (CGU)</h2>
            </header>

            <div class="space-y-6 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Introduction</h3>
                <p>
                  Bienvenue sur le site internet <span class="font-medium text-gray-900">www.ivoirshop.ci</span> (ci-après
                  « le Site Web »). Ivoirshop est un contenu hébergé sur Internet et exploité par la société
                  <span class="font-medium text-gray-900">Spark Group</span>, société à responsabilité limitée de droit
                  ivoirien, immatriculée au registre de commerce d'Abidjan Plateau sous le Numéro d'Identification Unique
                  (IDU) <span class="font-medium text-gray-900">CI 2019 0004292 K</span>, dont le siège social est situé à
                  Abidjan. Les présentes conditions constituent des clauses contractuelles applicables à tout achat par
                  tout utilisateur sur le Site Web.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Interprétation des termes</h3>
                <p>
                  Les termes « vous » et « utilisateur » désignent l'utilisateur final utilisant le Site Web. Les termes
                  « fournisseurs de services » désignent les prestataires de services tiers. Le pronom « nous » désigne
                  Spark Group, ses franchiseurs, ses affiliés et ses partenaires. Le terme « Site Web » désigne Ivoirshop.
                  Les présentes conditions s'appliquent au singulier comme au pluriel ; tout pronom inclut le masculin et
                  le féminin correspondant. Les termes « notamment », « comprend » et « y compris » sont réputés suivis de
                  l'expression « sans limitation ».
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Indépendance des clauses</h3>
                <p>
                  Si une disposition des CGU est jugée invalide ou inapplicable en tout ou partie, cette invalidité ne
                  s'attache qu'à cette disposition ou partie de disposition. Toutes les autres dispositions restent
                  valables.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Utilisation du Site Web</h3>
                <p>
                  Lors de l'inscription, vous créez un mot de passe et un nom de compte. Vous êtes responsable du maintien
                  de leur confidentialité et de toutes les activités liées à votre compte. À cette fin, vous vous engagez à :
                </p>
                <ul class="list-disc pl-5 space-y-1 my-3">
                  <li>Aviser immédiatement Ivoirshop de toute utilisation frauduleuse de votre compte ou de toute autre violation de sécurité ;</li>
                  <li>Vous assurer de quitter votre compte à la fin de chaque session d'utilisation.</li>
                </ul>
                <p>Vous vous engagez à utiliser le Site Web uniquement pour afficher et télécharger des données appropriées. À titre d'exemple, vous vous engagez à ne pas :</p>
                <ul class="list-disc pl-5 space-y-1 my-3">
                  <li>Diffamer, abuser, harceler, traquer, menacer ou violer les droits individuels ;</li>
                  <li>Publier ou diffuser tout contenu inapproprié, vulgaire, diffamatoire, obscène, indécent ou illégal ;</li>
                  <li>Télécharger des fichiers protégés par les lois de propriété intellectuelle sans en détenir les droits ou consentements ;</li>
                  <li>Télécharger ou distribuer des fichiers contenant des virus ou des logiciels pouvant endommager le Site Web ou un ordinateur ;</li>
                  <li>Mener des enquêtes, concours ou programmes de type « boule de neige » ;</li>
                  <li>Falsifier ou supprimer toute mention d'auteur, avis juridique ou désignation exclusive ;</li>
                  <li>Violer tout code de conduite ou toute loi applicable en vigueur en Côte d'Ivoire ou en dehors.</li>
                </ul>
                <p>
                  L'utilisateur s'engage à ne pas modifier, copier, distribuer, transmettre, reproduire, publier, vendre
                  ou céder toute information ou logiciel obtenu à partir du Site Web. La reproduction massive ou la copie
                  du contenu à des fins commerciales ou non n'est pas autorisée.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Responsabilité de l'utilisateur</h3>
                <p>
                  Les utilisateurs sont seuls responsables du contenu qu'ils téléchargent sur le Site Web. Ivoirshop ne
                  vérifie ni ne cautionne le contenu de l'utilisateur. Les utilisateurs peuvent être tenus légalement
                  responsables de leurs contenus, notamment lorsqu'ils sont diffamatoires ou protégés par droit d'auteur.
                  Si vous constatez un abus ou une violation des conditions, merci de le signaler au service client.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Exactitude des données</h3>
                <p>
                  Vous certifiez être propriétaire du contenu soumis et que celui-ci ne porte pas atteinte aux droits de
                  propriété intellectuelle ou autres. Vous vous engagez à fournir des informations exactes quant à vos
                  coordonnées personnelles et à les mettre à jour régulièrement. Ivoirshop ne garantit pas que l'aspect du
                  produit final soit exactement conforme à vos attentes ; des modifications (taille, couleur) peuvent être
                  nécessaires et vous en serez averti. Vous pourrez alors refuser et retourner le produit pour être
                  remboursé.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Propriété intellectuelle</h3>
                <p>
                  Sauf indication contraire, Ivoirshop possède tous les droits de propriété intellectuelle sur le contenu
                  du Site Web (code source, bases de données, textes, images, etc.). Vous ne devez pas utiliser, reproduire
                  ou distribuer tout contenu du Site Web appartenant à Ivoirshop sans son autorisation. Vous êtes seul
                  responsable du contenu que vous fournissez ou téléchargez.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Liens avec des tiers</h3>
                <p>
                  Le Site Web peut contenir des liens vers d'autres sites (« sites liés »), qui ne sont pas sous le
                  contrôle d'Ivoirshop. Ivoirshop n'est pas responsable de leur contenu ni de leurs mises à jour. Ces liens
                  sont fournis pour votre commodité ; leur inclusion n'implique pas leur approbation par Ivoirshop.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Résiliation</h3>
                <ul class="list-disc pl-5 space-y-1">
                  <li>Ivoirshop peut suspendre ou résilier votre compte s'il estime que vous n'avez pas respecté l'une des présentes conditions.</li>
                  <li>En cas de résiliation, Ivoirshop peut supprimer tout contenu relatif à votre utilisation du service.</li>
                </ul>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Prix et promotions</h3>
                <p>
                  Les prix des produits sont affichés dans l'unité monétaire du pays d'exploitation. Ivoirshop se réserve
                  le droit de modifier les prix, produits et services sans avertir l'utilisateur.
                </p>
                <ul class="list-disc pl-5 space-y-1 my-3">
                  <li>Les rabais s'appliquent sur la valeur totale des marchandises, TVA comprise. L'émission ou le rachat d'un bon s'applique sur la valeur totale de la commande une fois toutes les remises appliquées.</li>
                  <li>Un seul bon ou coupon peut être utilisé par commande, sauf indication contraire.</li>
                  <li>Ivoirshop peut proposer des concours à des périodes limitées, dont les conditions sont disponibles sur le site.</li>
                </ul>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Bons de réduction</h3>
                <p>Notre site accepte l'utilisation des bons de réduction pour les commandes en ligne. Les bons ne sont pas échangeables contre de l'argent liquide, à l'exception des bons de remboursement et de prépaiement. Ivoirshop se réserve le droit d'annuler les bons à tout moment.</p>
                <ul class="list-disc pl-5 space-y-1 my-3">
                  <li>Le bon ne peut être utilisé conjointement avec une autre offre ou un code promotionnel.</li>
                  <li>Bon valable pour une utilisation unique par personne.</li>
                  <li>Un seul bon peut être utilisé par transaction.</li>
                  <li>Les bons ne peuvent pas être transférés.</li>
                  <li>Tout litige sera résolu à la discrétion de la direction.</li>
                </ul>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Responsabilité d'Ivoirshop</h3>
                <p>
                  Ivoirshop s'efforce de faire en sorte que toutes les informations du Site Web soient correctes, mais ne
                  garantit pas la qualité, l'exactitude ou l'exhaustivité des données, informations, produits ou services.
                  En aucun cas Ivoirshop ne sera tenu responsable :
                </p>
                <ul class="list-disc pl-5 space-y-1 my-3">
                  <li>des dommages directs, indirects ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser les services ;</li>
                  <li>de l'altération des transmissions de données (par exemple les mentions 404, 501, etc.).</li>
                </ul>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Droit applicable</h3>
                <p>Ces conditions sont régies conformément aux lois du pays d'exploitation d'Ivoirshop (Côte d'Ivoire).</p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Modification</h3>
                <p>Ces conditions peuvent changer à tout moment, par exemple en incluant ou excluant des clauses.</p>
              </div>
            </div>
          </article>

          <!-- 4. Confidentialité & données personnelles -->
          <article id="confidentialite" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">4</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Confidentialité & données personnelles</h2>
            </header>

            <div class="space-y-6 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                Votre vie privée est importante pour Ivoirshop. Notre politique de confidentialité couvre la façon dont
                nous collectons, utilisons, divulguons, transférons et stockons vos informations. En visitant Ivoirshop,
                vous acceptez les pratiques décrites ci-dessous. En soumettant des données personnelles, vous consentez à
                leur utilisation dans les conditions prévues. Vous pouvez naviguer sur certaines pages sans fournir de
                données personnelles.
              </p>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">1. Récupération des données</h3>
                <p>
                  Nous pouvons collecter des données de nature diverse, notamment pour permettre la commande d'un produit,
                  le paiement et la livraison : nom, sexe, adresse e-mail, adresses postale et de livraison, numéros de
                  téléphone fixe et mobile, informations de paiement (carte ou coordonnées bancaires).
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">2. Utilisation des données</h3>
                <p>
                  Nous stockons et traitons vos données sur des serveurs protégés. Nous pouvons transmettre vos coordonnées
                  à des sociétés tierces afin d'effectuer la livraison, détecter des fraudes ou vous envoyer des
                  informations sur nos produits. Vos données sont anonymisées et utilisées à des fins statistiques. Nous ne
                  partageons, ne vendons ni ne louons vos données à des tiers à des fins de marketing sans votre
                  consentement explicite. Vous pouvez vous désinscrire des newsletters via le lien « désinscription »
                  présent dans nos e-mails ou depuis votre compte.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">3. Exactitude des données</h3>
                <p>
                  Vous vous engagez à fournir des données exactes vous concernant et à les mettre à jour régulièrement.
                  Vous certifiez être propriétaire du contenu soumis et qu'il ne porte atteinte à quiconque ni aux
                  principes de propriété intellectuelle.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">4. Sécurité</h3>
                <p>
                  Nous avons mis en place des mesures techniques pour empêcher l'accès non autorisé à vos données. Les
                  données sont recueillies sur un serveur sécurisé ; pour les informations de paiement, nous utilisons un
                  cryptage basé sur la technologie SSL (Secure Socket Layer). Vous êtes responsable de la protection de
                  votre mot de passe et de votre ordinateur. Nous vous recommandons de ne pas envoyer vos informations de
                  paiement par e-mail.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">5. Cookies</h3>
                <p>
                  L'acceptation des cookies n'est pas obligatoire pour visiter le Site Web, mais elle est nécessaire à sa
                  bonne utilisation. Les cookies sont des fichiers texte qui identifient votre ordinateur lors de vos
                  visites et sont stockés par votre navigateur. Ils permettent notamment de retenir votre adresse IP et de
                  gagner du temps lors de vos prochaines visites. Votre navigateur peut être configuré pour les refuser,
                  ce qui peut restreindre votre utilisation du site. Plus d'informations sur
                  <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener" class="text-[#f56100] hover:underline">allaboutcookies.org</a>.
                  Ivoirshop utilise les services de Google Analytics et Webtrekk GmbH à des fins de marketing et
                  d'optimisation.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">6. Accès aux données</h3>
                <p>
                  Vous pouvez consulter les données que nous conservons en vous connectant à votre compte : commandes,
                  informations de paiement, newsletters auxquelles vous êtes abonné, etc.
                </p>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">7. Modification</h3>
                <p>Cette politique de confidentialité peut changer à tout moment, par exemple en incluant ou excluant des clauses.</p>
              </div>
            </div>
          </article>

          <!-- 5. Livraison & frais -->
          <article id="livraison" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">5</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Livraison & frais</h2>
            </header>

            <div class="space-y-5 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Modes de livraison</h3>
                <ul class="list-disc pl-5 space-y-1">
                  <li><span class="font-medium text-gray-900">Abidjan – Lagunes :</span> livraison à domicile ou en point-relais Ivoirshop.</li>
                  <li><span class="font-medium text-gray-900">Intérieur du pays :</span> livraison en agences Ivoirshop, service courrier des compagnies de transport, agences partenaires ou agences La Poste selon la ville.</li>
                </ul>
              </div>

              <div>
                <h3 class="text-base font-semibold text-gray-900 mb-2">Frais de livraison</h3>
                <p>
                  Les frais sont calculés selon la catégorie de produit, le volume du colis et la destination. Dans la
                  région Abidjan-Lagunes, profitez de frais réduits en choisissant la livraison en point-relais.
                </p>
              </div>

              <div v-for="table in deliveryTables" :key="table.title">
                <h4 class="text-sm font-semibold text-gray-900 mb-3">{{ table.title }}</h4>
                <div class="overflow-x-auto rounded-xl border border-gray-100">
                  <table class="w-full text-left text-[13px]">
                    <thead>
                      <tr class="bg-gray-50 text-gray-500">
                        <th class="px-4 py-3 font-semibold whitespace-nowrap">Taille</th>
                        <th class="px-4 py-3 font-semibold">Catégories</th>
                        <th class="px-4 py-3 font-semibold whitespace-nowrap text-right">Frais / article</th>
                        <th class="px-4 py-3 font-semibold whitespace-nowrap text-right">Max / commande</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                      <tr v-for="row in table.rows" :key="row.size" class="text-gray-700">
                        <td class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{{ row.size }}</td>
                        <td class="px-4 py-3">{{ row.categories }}</td>
                        <td class="px-4 py-3 text-right whitespace-nowrap">{{ row.fee }} F</td>
                        <td class="px-4 py-3 text-right whitespace-nowrap">{{ row.max }} F</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="rounded-lg bg-orange-50 border border-orange-100 p-3 text-[13px] text-gray-700">
                <span class="font-semibold text-[#f56100]">Note :</span> pour certaines commandes d'un montant élevé et à
                destination d'une région éloignée, Ivoirshop est susceptible de vous demander de déposer un acompte de
                50 000 F dans l'une de ses agences de Côte d'Ivoire pour valider l'expédition. Merci de votre compréhension.
              </div>
            </div>
          </article>

          <!-- 6. À propos de nous -->
          <article id="a-propos" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">6</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">À propos de nous</h2>
            </header>
            <div class="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                Avec une équipe jeune, consciencieuse, honnête, dynamique et travailleuse, Ivoirshop veille à vous offrir
                des produits de qualité à des prix défiant toute concurrence. Nous travaillons avec des personnes qui
                adorent partager leurs passions et qui s'investissent pour voir l'Afrique avancer. Notre équipe de
                livraison rapide et efficace est entièrement à votre disposition.
              </p>
              <p>
                Nous offrons un contexte de libre-échange qui permet à tous les fans de mode, d'électronique ou d'art de
                trouver leur bonheur aux meilleurs prix. Grâce à notre Market Place, vous retrouverez une large sélection
                d'articles en tout genre : électroménager, vêtements, chaussures, bijoux, sacs, accessoires, parfums,
                téléphones et bien plus encore.
              </p>
              <p>
                Nous allions la qualité de service et les prix réduits pour toujours vous offrir le meilleur de
                l'expérience en ligne. Notre équipe est toujours à l'écoute ; une boîte à suggestions est disponible sur la
                page d'accueil pour recueillir vos commentaires.
              </p>
              <p class="font-medium text-[#f56100]">
                Ivoirshop, une nouvelle approche du e-commerce et des petits prix rien que pour vous !
              </p>
            </div>
          </article>

          <!-- 7. Mentions légales -->
          <article id="mentions" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">7</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Mentions légales</h2>
            </header>
            <div class="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                Le présent site est la propriété de <span class="font-semibold text-gray-900">SPARK GROUP SARL</span>,
                société à responsabilité limitée, Numéro d'Identification Unique (IDU)
                <span class="font-medium text-gray-900">CI 2019 0004292 K</span>, dont le siège social est situé à Abidjan.
              </p>
              <p>
                Pour toute question relative aux présentes conditions, contactez notre
                <NuxtLink to="/mentions-legales" class="text-[#f56100] hover:underline">page mentions légales</NuxtLink>
                ou écrivez-nous à
                <a href="mailto:contact@ivoirshop.ci" class="text-[#f56100] hover:underline">contact@ivoirshop.ci</a>.
              </p>
            </div>
          </article>

          <!-- Bloc contact -->
          <div class="rounded-2xl bg-gradient-to-r from-[#f56100] to-[#f77f00] text-white p-6 md:p-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 class="text-lg md:text-xl font-bold">Besoin d'aide sur une commande ou un retour ?</h2>
                <p class="text-white/90 text-sm mt-1">Notre service client est à votre écoute.</p>
              </div>
              <a
                href="tel:+2250777283648"
                class="inline-flex items-center justify-center gap-2 bg-white text-[#f56100] font-semibold text-sm rounded-full px-6 py-3 hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                07 77 28 36 48
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Conditions générales de vente — IvoirShop CI',
  meta: [
    {
      name: 'description',
      content:
        "CGV Ivoirshop.ci : politique de retour et de remboursement, conditions générales d'utilisation, protection des données personnelles, livraison et frais.",
    },
  ],
})

const lastUpdate = '13 juillet 2026'

const sections = [
  { id: 'retour', number: 1, title: 'Politique de retour' },
  { id: 'remboursement', number: 2, title: 'Politique de remboursement' },
  { id: 'cgu', number: 3, title: "Conditions générales d'utilisation" },
  { id: 'confidentialite', number: 4, title: 'Confidentialité & données personnelles' },
  { id: 'livraison', number: 5, title: 'Livraison & frais' },
  { id: 'a-propos', number: 6, title: 'À propos de nous' },
  { id: 'mentions', number: 7, title: 'Mentions légales' },
]

const deliveryTables = [
  {
    title: 'Abidjan — Livraison à domicile',
    rows: [
      { size: 'Petit (spécial)', categories: 'Mode / Beauté / Bébé / Épicerie / Supermarché / Sport', fee: '700', max: '1 500' },
      { size: 'Petit', categories: 'Petit électronique / Accessoire / Tablette / PC / Maison', fee: '850', max: '2 500' },
      { size: 'Moyen', categories: 'Petit électroménager / Maison', fee: '1 350', max: '5 300' },
      { size: 'Large', categories: 'Gros électroménager / Meubles / Matelas / TV grande taille', fee: '5 500', max: '55 500' },
      { size: 'Très large', categories: 'Gros électroménager / Meubles / Matelas / TV grande taille', fee: '10 500', max: '105 500' },
    ],
  },
  {
    title: 'Abidjan — Livraison en point-relais',
    rows: [
      { size: 'Petit (spécial)', categories: 'Mode / Beauté / Bébé / Épicerie / Supermarché / Sport', fee: '250', max: '250' },
      { size: 'Petit', categories: 'Petit électronique / Accessoire / Tablette / PC / Maison', fee: '550', max: '1 700' },
      { size: 'Moyen', categories: 'Petit électroménager / Maison', fee: '950', max: '2 800' },
      { size: 'Large', categories: 'Gros électroménager / Meubles / Matelas / TV grande taille', fee: '7 500', max: '70 500' },
      { size: 'Très large', categories: 'Gros électroménager / Meubles / Matelas / TV grande taille', fee: '11 500', max: '110 500' },
    ],
  },
  {
    title: "Hors d'Abidjan (Côte d'Ivoire)",
    rows: [
      { size: 'Petit (spécial)', categories: 'Mode / Beauté / Bébé / Épicerie / Supermarché / Sport', fee: '2 000', max: '2 000' },
      { size: 'Petit', categories: 'Petit électronique / Accessoire / Tablette / PC / Maison', fee: '2 500', max: '3 500' },
      { size: 'Moyen', categories: 'Petit électroménager / Maison', fee: '4 600', max: '8 000' },
      { size: 'Très large', categories: 'Gros électroménager / Meubles / Matelas / TV grande taille', fee: '12 500', max: '120 500' },
    ],
  },
]

// Scrollspy : surligne dans le sommaire la section actuellement visible
const activeSection = ref(sections[0]?.id ?? '')
let observer: IntersectionObserver | null = null

onMounted(() => {
  const visible = new Map<string, number>()

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visible.set(entry.target.id, entry.intersectionRatio)
        } else {
          visible.delete(entry.target.id)
        }
      }

      if (visible.size > 0) {
        const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0]
        if (top) activeSection.value = top[0]
      }
    },
    {
      rootMargin: '-20% 0px -70% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    },
  )

  for (const section of sections) {
    const el = document.getElementById(section.id)
    if (el) observer.observe(el)
  }
})

onBeforeUnmount(() => {
  observer?.disconnect()
})
</script>

<style scoped>
/* Décor SVG animé du hero (thème commerce) */
.deco {
  position: absolute;
  color: #fff;
  opacity: 0.14;
  will-change: transform;
}
.deco-1 { width: 120px; height: 120px; top: -6px;   right: 8%;   animation: floatSlow 10s ease-in-out infinite; }
.deco-2 { width: 140px; height: 140px; bottom: -18px; right: 24%; opacity: 0.10; animation: slide 12s ease-in-out infinite; }
.deco-3 { width: 78px;  height: 78px;  top: 44%;      right: 14%;  opacity: 0.12; animation: drift 11s ease-in-out infinite; }
.deco-4 { width: 96px;  height: 96px;  top: 16%;      left: 5%;    opacity: 0.11; animation: spinSlow 24s linear infinite; }
.deco-5 { width: 64px;  height: 64px;  bottom: 14%;   left: 18%;   opacity: 0.12; animation: float 8s ease-in-out infinite; }
.deco-6 { width: 56px;  height: 56px;  top: 10%;      left: 42%;   opacity: 0.09; animation: floatSlow 9s ease-in-out infinite; }

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(-16px) rotate(4deg); }
}
@keyframes floatSlow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50%      { transform: translateY(14px) rotate(-5deg); }
}
@keyframes drift {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33%      { transform: translate(-12px, 10px) rotate(6deg); }
  66%      { transform: translate(10px, -8px) rotate(-4deg); }
}
@keyframes slide {
  0%, 100% { transform: translateX(0) rotate(0deg); }
  50%      { transform: translateX(24px) rotate(2deg); }
}
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .deco { animation: none !important; }
}

.faq {
  border: 1px solid #f3f4f6;
  border-radius: 0.75rem;
  overflow: hidden;
}
.faq-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1rem;
  cursor: pointer;
  list-style: none;
  font-weight: 600;
  font-size: 0.875rem;
  color: #111827;
  transition: background-color 0.15s;
}
.faq-summary:hover {
  background-color: #fff7ed;
}
.faq[open] .faq-summary {
  background-color: #fff7ed;
  color: #f56100;
}
.faq-summary::-webkit-details-marker {
  display: none;
}
.faq-chevron {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  color: #9ca3af;
}
.faq[open] .faq-chevron {
  transform: rotate(180deg);
  color: #f56100;
}
.faq-body {
  padding: 0 1rem 1rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #374151;
}
</style>
