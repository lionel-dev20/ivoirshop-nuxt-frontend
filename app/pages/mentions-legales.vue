<!-- pages/mentions-legales.vue -->
<template>
  <div class="bg-gray-50">
    <!-- En-tête / Hero -->
    <section class="relative overflow-hidden bg-gradient-to-r from-[#f56100] to-[#f77f00] text-white">
      <!-- Décor SVG animé : thème justice / documents -->
      <div class="hero-deco pointer-events-none absolute inset-0" aria-hidden="true">
        <!-- Balance de la justice -->
        <svg class="deco deco-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.4 48.4 0 0 0 12 4.5c-2.29 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.99 5.99 0 0 1-2.031.352 5.99 5.99 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.99 5.99 0 0 1-2.031.352 5.99 5.99 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
        </svg>
        <!-- Bouclier vérifié -->
        <svg class="deco deco-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.96 11.96 0 0 1 3.6 6 12 12 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
        <!-- Document -->
        <svg class="deco deco-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
        <!-- Livre ouvert (loi) -->
        <svg class="deco deco-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 6.042A8.97 8.97 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.99 8.99 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.97 8.97 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.99 8.99 0 0 0 18 18a8.97 8.97 0 0 0-6 2.292m0-14.25v14.25" />
        </svg>
        <!-- Cadenas (données) -->
        <svg class="deco deco-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
        <!-- Sceau / check -->
        <svg class="deco deco-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <nav class="flex items-center gap-2 text-sm text-white/80 mb-6">
          <NuxtLink to="/" class="hover:text-white transition-colors">Accueil</NuxtLink>
          <span>/</span>
          <span class="text-white font-medium">Mentions légales</span>
        </nav>
        <h1 class="text-3xl md:text-5xl font-bold tracking-tight">
          Informations légales
        </h1>
        <p class="mt-4 text-white/90 max-w-2xl text-sm md:text-base leading-relaxed">
          Conditions d'utilisation, propriété intellectuelle, gestion des données
          personnelles et informations sur l'éditeur du site
          <span class="font-semibold">ivoirshop.ci</span>.
        </p>
        <p class="mt-6 inline-flex items-center gap-2 text-xs md:text-sm bg-white/15 rounded-full px-4 py-1.5">
          <!-- <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg> -->
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

          <!-- 1. Présentation du site -->
          <article id="presentation" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">1</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Présentation du site</h2>
            </header>
            <dl class="divide-y divide-gray-100">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3">
                <dt class="text-sm font-semibold text-gray-500">Propriétaire</dt>
                <dd class="sm:col-span-2 text-sm text-gray-700 leading-relaxed">
                  <span class="font-semibold text-gray-900">SPARK GROUP SARL</span> au capital de 1 000 000 F CFA,
                  dont le siège social est sis à Abidjan Cocody, Riviera Faya route Abatta, 31 BP 237 Abidjan 31.
                </dd>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3">
                <dt class="text-sm font-semibold text-gray-500">Immatriculation</dt>
                <dd class="sm:col-span-2 text-sm text-gray-700 leading-relaxed">
                  RCCM CI n° <span class="font-medium text-gray-900">ABJ-2019-B-8112</span> — CC : <span class="font-medium text-gray-900">1921349 B</span>.
                </dd>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3">
                <dt class="text-sm font-semibold text-gray-500">Créateur</dt>
                <dd class="sm:col-span-2 text-sm text-gray-700">Ivoirshop.ci</dd>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3">
                <dt class="text-sm font-semibold text-gray-500">Responsable publication</dt>
                <dd class="sm:col-span-2 text-sm text-gray-700">
                  Ivoirshop.ci —
                  <a href="mailto:contact@ivoirshop.ci" class="text-[#f56100] hover:underline">contact@ivoirshop.ci</a>.
                  Le responsable publication est une personne physique ou une personne morale.
                </dd>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3">
                <dt class="text-sm font-semibold text-gray-500">Webmaster</dt>
                <dd class="sm:col-span-2 text-sm text-gray-700">
                  Ivoirshop.ci —
                  <a href="mailto:contact@ivoirshop.ci" class="text-[#f56100] hover:underline">contact@ivoirshop.ci</a>
                </dd>
              </div>
            </dl>
          </article>

          <!-- 2. Conditions générales d'utilisation -->
          <article id="cgu" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">2</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Conditions générales d'utilisation du site et des services proposés</h2>
            </header>
            <div class="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                L'utilisation du site <span class="font-medium text-gray-900">https://ivoirshop.ci</span> implique l'acceptation
                pleine et entière des conditions générales d'utilisation ci-après décrites. Ces conditions d'utilisation sont
                susceptibles d'être modifiées ou complétées à tout moment ; les utilisateurs du site sont donc invités à les
                consulter de manière régulière.
              </p>
              <p>
                Ce site est normalement accessible à tout moment aux utilisateurs. Une interruption pour raison de maintenance
                technique peut toutefois être décidée par Ivoirshop.ci, qui s'efforcera alors de communiquer préalablement aux
                utilisateurs les dates et heures de l'intervention.
              </p>
              <p>
                Le site est mis à jour régulièrement par Ivoirshop.ci. De la même façon, les mentions légales peuvent être
                modifiées à tout moment : elles s'imposent néanmoins à l'utilisateur, qui est invité à s'y référer le plus
                souvent possible afin d'en prendre connaissance.
              </p>
            </div>
          </article>

          <!-- 3. Description des services -->
          <article id="services" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">3</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Description des services fournis</h2>
            </header>
            <div class="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                Le site <span class="font-medium text-gray-900">https://ivoirshop.ci</span> a pour objet de fournir une
                information concernant l'ensemble des activités de la société. Ivoirshop.ci s'efforce de fournir des informations
                aussi précises que possible. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et
                des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui
                fournissent ces informations.
              </p>
              <p>
                Toutes les informations indiquées sur le site sont données à titre indicatif et sont susceptibles d'évoluer. Par
                ailleurs, les renseignements figurant sur le site ne sont pas exhaustifs. Ils sont donnés sous réserve de
                modifications ayant été apportées depuis leur mise en ligne.
              </p>
            </div>
          </article>

          <!-- 4. Limitations contractuelles sur les données techniques -->
          <article id="donnees-techniques" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">4</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Limitations contractuelles sur les données techniques</h2>
            </header>
            <div class="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>Le site utilise la technologie JavaScript.</p>
              <p>
                Le site Internet ne pourra être tenu responsable de dommages matériels liés à son utilisation. De plus,
                l'utilisateur du site s'engage à y accéder en utilisant un matériel récent, ne contenant pas de virus et avec un
                navigateur de dernière génération mis à jour.
              </p>
            </div>
          </article>

          <!-- 5. Propriété intellectuelle -->
          <article id="propriete-intellectuelle" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">5</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Propriété intellectuelle et contrefaçons</h2>
            </header>
            <div class="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                Ivoirshop.ci est propriétaire des droits de propriété intellectuelle ou détient les droits d'usage sur tous les
                éléments accessibles sur le site, notamment les textes, images, graphismes, logo, icônes, sons et logiciels.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du
                site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable
                d'Ivoirshop.ci.
              </p>
              <p>
                Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme
                constitutive d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants du
                Code de la Propriété Intellectuelle.
              </p>
            </div>
          </article>

          <!-- 6. Limitations de responsabilité -->
          <article id="responsabilite" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">6</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Limitations de responsabilité</h2>
            </header>
            <div class="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                Ivoirshop.ci ne pourra être tenu responsable des dommages directs et indirects causés au matériel de
                l'utilisateur lors de l'accès au site, et résultant soit de l'utilisation d'un matériel ne répondant pas aux
                spécifications indiquées au point 4, soit de l'apparition d'un bug ou d'une incompatibilité.
              </p>
              <p>
                Ivoirshop.ci ne pourra également être tenu responsable des dommages indirects (tels, par exemple, qu'une perte
                de marché ou perte d'une chance) consécutifs à l'utilisation du site.
              </p>
              <p>
                Des espaces interactifs (possibilité de poser des questions dans l'espace contact) sont à la disposition des
                utilisateurs. Ivoirshop.ci se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé
                dans cet espace qui contreviendrait à la législation applicable en Côte d'Ivoire, en particulier aux
                dispositions relatives à la protection des données. Le cas échéant, Ivoirshop.ci se réserve également la
                possibilité de mettre en cause la responsabilité civile et/ou pénale de l'utilisateur, notamment en cas de
                message à caractère raciste, injurieux, diffamant ou pornographique, quel que soit le support utilisé (texte,
                photographie…).
              </p>
            </div>
          </article>

          <!-- 7. Gestion des données personnelles -->
          <article id="donnees-personnelles" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">7</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Gestion des données personnelles</h2>
            </header>
            <div class="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                À l'occasion de l'utilisation du site, peuvent être recueillies : l'URL des liens par l'intermédiaire desquels
                l'utilisateur a accédé au site, le fournisseur d'accès de l'utilisateur et l'adresse de protocole Internet (IP)
                de l'utilisateur.
              </p>
              <p>
                En tout état de cause, Ivoirshop.ci ne collecte des informations personnelles relatives à l'utilisateur que pour
                le besoin de certains services proposés par le site. L'utilisateur fournit ces informations en toute
                connaissance de cause, notamment lorsqu'il procède par lui-même à leur saisie. Il est alors précisé à
                l'utilisateur l'obligation ou non de fournir ces informations.
              </p>
              <p>
                Nous avons mis en place des mesures de sécurité pour éviter que vos données personnelles ne soient
                accidentellement perdues, utilisées ou consultées de manière non autorisée, modifiées ou divulguées.
              </p>
              <p>
                En outre, nous limitons l'accès à vos données à caractère personnel aux employés, agents, sous-traitants et
                autres tiers qui ont un besoin professionnel de les connaître. Ils ne traiteront vos données personnelles que
                sur nos instructions et sont soumis à un devoir de confidentialité.
              </p>
              <p>
                Nous avons mis en place des procédures pour faire face à toute suspicion de violation de données à caractère
                personnel et nous vous notifierons, ainsi qu'à tout régulateur applicable, une violation lorsque nous sommes
                légalement tenus de le faire.
              </p>
              <p>
                Aucune information personnelle de l'utilisateur n'est publiée à son insu, échangée, transférée, cédée ou vendue
                sur un support quelconque à des tiers. Seule l'hypothèse du rachat d'Ivoirshop.ci et de ses droits permettrait
                la transmission desdites informations à l'éventuel acquéreur, qui serait à son tour tenu de la même obligation de
                conservation et de modification des données vis-à-vis de l'utilisateur du site.
              </p>
            </div>
          </article>

          <!-- 8. Liens hypertextes et cookies -->
          <article id="cookies" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">8</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Liens hypertextes et cookies</h2>
            </header>
            <div class="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                Le site contient un certain nombre de liens hypertextes vers d'autres sites, mis en place avec l'autorisation
                d'Ivoirshop.ci. Cependant, Ivoirshop.ci n'a pas la possibilité de vérifier le contenu des sites ainsi visités et
                n'assumera en conséquence aucune responsabilité de ce fait.
              </p>
              <p>
                La navigation sur le site est susceptible de provoquer l'installation de cookie(s) sur l'ordinateur de
                l'utilisateur. Un cookie est un fichier de petite taille, qui ne permet pas l'identification de l'utilisateur,
                mais qui enregistre des informations relatives à la navigation d'un ordinateur sur un site. Les données ainsi
                obtenues visent à faciliter la navigation ultérieure sur le site et ont également vocation à permettre diverses
                mesures de fréquentation.
              </p>
              <p>
                Le refus d'installation d'un cookie peut entraîner l'impossibilité d'accéder à certains services. L'utilisateur
                peut toutefois configurer son ordinateur de la manière suivante pour refuser l'installation des cookies :
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-1">Internet Explorer</h3>
                  <p class="text-[13px] text-gray-600 leading-relaxed">
                    Onglet Outils (pictogramme en forme de rouage en haut à droite) / Options Internet. Cliquez sur
                    Confidentialité et choisissez Bloquer tous les cookies. Validez sur OK.
                  </p>
                </div>
                <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-1">Firefox</h3>
                  <p class="text-[13px] text-gray-600 leading-relaxed">
                    En haut de la fenêtre, cliquez sur le bouton Firefox, puis Options / Vie privée. Paramétrez les Règles de
                    conservation sur « utiliser les paramètres personnalisés pour l'historique » et décochez la case pour
                    désactiver les cookies.
                  </p>
                </div>
                <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-1">Safari</h3>
                  <p class="text-[13px] text-gray-600 leading-relaxed">
                    Cliquez sur le pictogramme de menu (rouage) en haut à droite, puis Paramètres / Afficher les paramètres
                    avancés. Dans « Confidentialité » / Paramètres de contenu, section « Cookies », vous pouvez bloquer les
                    cookies.
                  </p>
                </div>
                <div class="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <h3 class="text-sm font-semibold text-gray-900 mb-1">Chrome</h3>
                  <p class="text-[13px] text-gray-600 leading-relaxed">
                    Cliquez sur le pictogramme de menu (trois lignes horizontales) en haut à droite, puis Paramètres / Afficher
                    les paramètres avancés. Dans « Confidentialité » / Préférences, onglet « Confidentialité », vous pouvez
                    bloquer les cookies.
                  </p>
                </div>
              </div>
            </div>
          </article>

          <!-- 9. Droit applicable -->
          <article id="droit-applicable" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 scroll-mt-6">
            <header class="flex items-center gap-4 mb-6">
              <span class="shrink-0 w-11 h-11 rounded-xl bg-[#f56100] text-white font-bold flex items-center justify-center">9</span>
              <h2 class="text-xl md:text-2xl font-bold text-gray-900">Droit applicable et attribution de juridiction</h2>
            </header>
            <div class="space-y-4 text-sm md:text-[15px] text-gray-700 leading-relaxed">
              <p>
                Tout litige en relation avec l'utilisation du site <span class="font-medium text-gray-900">https://ivoirshop.ci</span>
                est soumis au droit français. Il est fait attribution exclusive de juridiction aux tribunaux compétents de Paris.
              </p>
            </div>
          </article>

          <!-- Bloc contact -->
          <div class="rounded-2xl bg-gradient-to-r from-[#f56100] to-[#f77f00] text-white p-6 md:p-8">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 class="text-lg md:text-xl font-bold">Une question sur ces mentions ?</h2>
                <p class="text-white/90 text-sm mt-1">Notre équipe reste à votre disposition.</p>
              </div>
              <a
                href="mailto:contact@ivoirshop.ci"
                class="inline-flex items-center justify-center gap-2 bg-white text-[#f56100] font-semibold text-sm rounded-full px-6 py-3 hover:bg-gray-100 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contact@ivoirshop.ci
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
  title: 'Mentions légales — IvoirShop CI',
  meta: [
    {
      name: 'description',
      content:
        "Mentions légales du site ivoirshop.ci : éditeur, conditions générales d'utilisation, propriété intellectuelle, gestion des données personnelles et cookies.",
    },
  ],
})

const lastUpdate = '13 juillet 2026'

const sections = [
  { id: 'presentation', number: 1, title: 'Présentation du site' },
  { id: 'cgu', number: 2, title: "Conditions générales d'utilisation" },
  { id: 'services', number: 3, title: 'Description des services fournis' },
  { id: 'donnees-techniques', number: 4, title: 'Limitations sur les données techniques' },
  { id: 'propriete-intellectuelle', number: 5, title: 'Propriété intellectuelle et contrefaçons' },
  { id: 'responsabilite', number: 6, title: 'Limitations de responsabilité' },
  { id: 'donnees-personnelles', number: 7, title: 'Gestion des données personnelles' },
  { id: 'cookies', number: 8, title: 'Liens hypertextes et cookies' },
  { id: 'droit-applicable', number: 9, title: 'Droit applicable et juridiction' },
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
        // Section la plus visible = section active
        const top = [...visible.entries()].sort((a, b) => b[1] - a[1])[0]
        if (top) activeSection.value = top[0]
      }
    },
    {
      // Zone d'observation centrée : la section active est celle au milieu de l'écran
      rootMargin: '-30% 0px -55% 0px',
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
/* Décor SVG animé du hero */
.deco {
  position: absolute;
  color: #fff;
  opacity: 0.14;
  will-change: transform;
}
.deco-1 { width: 130px; height: 130px; top: -10px;   right: 6%;   animation: float 9s ease-in-out infinite; }
.deco-2 { width: 84px;  height: 84px;  top: 42%;      right: 22%;  opacity: 0.10; animation: floatSlow 11s ease-in-out infinite; }
.deco-3 { width: 72px;  height: 72px;  bottom: 8%;    right: 12%;  opacity: 0.12; animation: drift 13s ease-in-out infinite; }
.deco-4 { width: 100px; height: 100px; top: 20%;      left: 4%;    opacity: 0.10; animation: floatSlow 10s ease-in-out infinite; }
.deco-5 { width: 60px;  height: 60px;  bottom: 12%;   left: 20%;   opacity: 0.12; animation: float 8s ease-in-out infinite; }
.deco-6 { width: 48px;  height: 48px;  top: 12%;      left: 40%;   opacity: 0.09; animation: spinSlow 26s linear infinite; }

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
@keyframes spinSlow {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .deco { animation: none !important; }
}
</style>
