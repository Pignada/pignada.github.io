/* =====================================================================
   BLADE RUNNER 2049 — Page Personnages
   Données des personnages, fiches « dossier », filtres, réseau des
   relations et quiz « Quel personnage es-tu ? ».
   ===================================================================== */
(function () {
	'use strict';

	const $ = (s, c) => (c || document).querySelector(s);
	const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
	const echapper = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

	const TYPES = {
		replicant: 'Réplicant',
		humain: 'Humain',
		ia: 'Intelligence artificielle',
		inconnu: 'Nature incertaine'
	};

	/* ---------- Données ---------- */
	const PERSONNAGES = [
		{
			id: 'k', nom: 'K', alias: 'KD6-3.7, surnommé « Joe »', acteur: 'Ryan Gosling',
			type: 'replicant', modele: 'Nexus-9 (Wallace Corporation)', affiliation: 'LAPD, unité Blade Runner',
			serie: 'KD6-3.7', image: null,
			resume: 'Blade Runner du LAPD chargé de « retirer » les anciens modèles de réplicants. K est lui-même un réplicant de dernière génération, conçu pour obéir. Il vit seul avec Joi, une compagne holographique, et passe après chaque mission un test de référence qui vérifie qu’il ne dévie pas.',
			analyse: 'Son parcours retourne le schéma classique de « l’élu ». K se croit ordinaire, puis se croit unique, puis découvre qu’il ne l’est pas, et choisit malgré tout d’agir. Ce n’est pas sa naissance qui le rend humain, ce sont ses choix.',
			spoiler: 'Le souvenir du cheval de bois est authentique, mais il appartient à Ana Stelline, qui l’a implanté dans sa mémoire. Freysa lui apprend qu’il n’est pas l’enfant. K sauve quand même Deckard des mains de Luv, le conduit jusqu’à sa fille, puis s’allonge sur les marches, sous la neige.',
			citation: null,
			theme: 'humanite'
		},
		{
			id: 'deckard', nom: 'Rick Deckard', alias: 'Ancien Blade Runner', acteur: 'Harrison Ford',
			type: 'inconnu', modele: 'Inconnu : le film ne tranche pas', affiliation: 'Ancien LAPD, en fuite depuis 2019',
			serie: 'DOSSIER 2019', image: null,
			resume: 'Trente ans après le premier film, l’ancien Blade Runner vit caché dans un casino abandonné de Las Vegas, au milieu des statues géantes et des hologrammes en panne, avec un chien pour seule compagnie.',
			analyse: 'Harrison Ford reprend le rôle avec une fatigue et une colère qui donnent du poids au personnage. Deckard porte les questions sans réponse de la saga : sa nature reste volontairement ambiguë. Quand K lui demande si son chien est réel, il lui répond de poser la question au chien.',
			spoiler: 'Deckard est le père de l’enfant né de Rachael. Il s’est éloigné pour protéger sa fille et a laissé la résistance brouiller les pistes. Wallace tente de le faire parler en lui présentant une copie de Rachael ; Deckard la rejette : « ses yeux étaient verts ».',
			citation: null,
			theme: 'solitude'
		},
		{
			id: 'joi', nom: 'Joi', alias: 'Compagne holographique de K', acteur: 'Ana de Armas',
			type: 'ia', modele: 'Hologramme grand public (Wallace Corporation)', affiliation: 'Produit commercial',
			serie: 'PRODUIT WALLACE', image: null,
			resume: 'Joi est une intelligence artificielle vendue comme la compagne idéale. Elle partage l’appartement de K, lui donne un prénom, Joe, et l’encourage à croire qu’il est unique. Grâce à un émanateur portable, elle peut enfin le suivre hors de chez lui.',
			analyse: 'Joi est sans doute le personnage le plus troublant du film : son amour paraît sincère, mais il pourrait n’être qu’une fonction prévue par le produit. Le film ne tranche pas et laisse la question au spectateur : un sentiment programmé est-il moins réel ?',
			spoiler: 'Pour être pleinement avec K, elle se « synchronise » avec le corps de Mariette. Quand Luv écrase l’émanateur, Joi est effacée. Plus tard, une publicité géante de Joi interpelle K et l’appelle « Joe » : le doute s’installe sur ce qu’ils ont vécu.',
			citation: null,
			theme: 'amour'
		},
		{
			id: 'luv', nom: 'Luv', alias: 'Bras droit de Niander Wallace', acteur: 'Sylvia Hoeks',
			type: 'replicant', modele: 'Nexus-9 (Wallace Corporation)', affiliation: 'Wallace Corporation',
			serie: 'N9 · WALLACE', image: null,
			resume: 'Réplicante de confiance de Wallace, Luv gère ses affaires et exécute ses ordres. Élégante, méthodique et redoutable au combat, elle traque le même secret que K.',
			analyse: 'Luv est le reflet sombre de K : un modèle obéissant qui veut prouver sa valeur à son créateur. Elle pleure pourtant plusieurs fois devant la cruauté de Wallace, signe d’une émotion qu’elle n’a pas le droit de montrer.',
			spoiler: 'Elle tue la lieutenante Joshi, détruit l’émanateur de Joi et enlève Deckard. K l’affronte au pied du mur marin et la noie dans un spinner submergé.',
			citation: null,
			theme: 'esclavage'
		},
		{
			id: 'wallace', nom: 'Niander Wallace', alias: 'Fondateur de la Wallace Corporation', acteur: 'Jared Leto',
			type: 'humain', modele: 'Humain, aveugle', affiliation: 'PDG de la Wallace Corporation',
			serie: 'WALLACE CORP.', image: null,
			resume: 'Ses cultures synthétiques ont mis fin à la famine des années 2020. Il a racheté les restes de la Tyrell Corporation et fabrique désormais les Nexus-9, des réplicants conçus pour obéir. Aveugle, il voit grâce à de petits drones-caméras.',
			analyse: 'Wallace se rêve en dieu créateur. Son obsession : rendre les réplicants capables d’enfanter, pour fournir une main-d’œuvre illimitée à la conquête des colonies. Il dit tout haut ce que le film dénonce : une civilisation bâtie sur des êtres jetables.',
			spoiler: 'Wallace ignore comment Tyrell a rendu la naissance possible. Il veut retrouver l’enfant pour percer ce secret. Le film le laisse en vie, sans résoudre son histoire.',
			citation: null,
			theme: 'esclavage'
		},
		{
			id: 'joshi', nom: 'Lieutenante Joshi', alias: 'Supérieure de K', acteur: 'Robin Wright',
			type: 'humain', modele: 'Humaine', affiliation: 'LAPD',
			serie: 'LAPD', image: null,
			resume: 'La supérieure de K au LAPD. Dure, pragmatique, mais pas dénuée d’affection pour lui, elle lui confie l’enquête qui lance le film.',
			analyse: 'Joshi défend l’ordre établi : la société repose selon elle sur un mur entre humains et réplicants. Révéler qu’un réplicant peut naître, c’est risquer la guerre. Elle choisit d’effacer la vérité.',
			spoiler: 'Elle ordonne à K de détruire toute trace de l’enfant. K lui ment pour la première fois. Luv la tue dans son bureau pour retrouver la trace de K.',
			citation: null,
			theme: 'naissance'
		},
		{
			id: 'ana', nom: 'Dr Ana Stelline', alias: 'Conceptrice de souvenirs', acteur: 'Carla Juri',
			type: 'humain', modele: 'Humaine', affiliation: 'Laboratoires Stelline, sous-traitant de Wallace',
			serie: 'STELLINE LAB', image: null,
			resume: 'Ana Stelline conçoit les souvenirs implantés dans les réplicants. Son système immunitaire est trop fragile pour le monde extérieur : elle vit enfermée dans une bulle stérile, où elle recrée des anniversaires, des forêts ou des journées de neige.',
			analyse: 'Ana pense qu’un souvenir sincère rend les réplicants plus stables, plus humains. Elle est la seule à pouvoir dire à K si un souvenir a été vécu par quelqu’un. Contrairement à ce qu’on lit souvent, elle n’est pas une réplicante.',
			spoiler: 'Ana est la fille de Deckard et de Rachael, cachée depuis l’enfance. Le souvenir du cheval de bois est le sien : elle l’a placé dans la mémoire de K. Le film se termine sur sa rencontre avec son père, sous la neige artificielle de sa bulle.',
			citation: null,
			theme: 'memoire'
		},
		{
			id: 'mariette', nom: 'Mariette', alias: 'Membre de la résistance', acteur: 'Mackenzie Davis',
			type: 'replicant', modele: 'Réplicante d’ancienne génération', affiliation: 'Résistance des réplicants',
			serie: 'RÉSISTANCE', image: null,
			resume: 'Travailleuse du sexe dans les rues de Los Angeles, Mariette croise K par hasard, en apparence. Elle appartient en réalité à un réseau clandestin de réplicants qui le surveille.',
			analyse: 'Mariette est l’un des rares personnages libres du film : elle ne sert ni la police ni Wallace. Sa scène avec Joi, où deux corps se superposent pour n’en former qu’un, est l’une des images les plus commentées du film.',
			spoiler: 'Elle place un traceur sur K pendant la nuit passée avec Joi. Après l’attaque de Las Vegas, elle le retrouve blessé et le conduit auprès de Freysa.',
			citation: null,
			theme: 'amour'
		},
		{
			id: 'sapper', nom: 'Sapper Morton', alias: 'Ancien médecin de combat', acteur: 'Dave Bautista',
			type: 'replicant', modele: 'Nexus-8 (Tyrell), durée de vie illimitée', affiliation: 'Fermier, en marge de la société',
			serie: 'N8 · MORTON', image: null,
			resume: 'Ancien médecin militaire devenu éleveur de larves protéinées, Sapper vit retiré dans une ferme isolée sous un ciel gris. K vient l’y « retirer » dans la scène d’ouverture.',
			analyse: 'En quelques minutes, Sapper pose les grandes questions du film. Avant de mourir, il reproche à K de faire le sale travail des humains et lui lance qu’il n’a jamais vu de miracle. Le court-métrage 2048 : Nowhere to Run raconte ses derniers jours.',
			spoiler: 'Sapper a assisté à la naissance de l’enfant de Rachael. Il a enterré Rachael, morte en couches, au pied de l’arbre mort de sa ferme. Ce sont ses ossements que K découvre.',
			citation: null,
			theme: 'naissance'
		},
		{
			id: 'freysa', nom: 'Freysa', alias: 'Cheffe de la résistance', acteur: 'Hiam Abbass',
			type: 'replicant', modele: 'Réplicante d’ancienne génération', affiliation: 'Résistance des réplicants',
			serie: 'RÉSISTANCE', image: null,
			resume: 'Freysa dirige une armée clandestine de réplicants qui prépare un soulèvement. Elle fait partie de ceux qui ont aidé Rachael, des années plus tôt.',
			analyse: 'Freysa fait de la naissance un symbole politique : si les réplicants peuvent naître, ils ne sont plus des objets. Pour elle, mourir pour une juste cause est ce qu’il y a de plus humain.',
			spoiler: 'Elle révèle à K qu’il n’est pas l’enfant, comme beaucoup d’autres réplicants l’ont espéré avant lui, et lui demande de tuer Deckard avant que Wallace ne le fasse parler.',
			citation: null,
			theme: 'naissance'
		},
		{
			id: 'gaff', nom: 'Gaff', alias: 'Ancien partenaire de Deckard', acteur: 'Edward James Olmos',
			type: 'humain', modele: 'Humain', affiliation: 'Ancien LAPD, retraité',
			serie: 'LAPD 2019', image: null,
			resume: 'Le collègue de Deckard dans le premier film vit aujourd’hui dans une maison de retraite. K vient l’interroger sur la disparition de Deckard et de Rachael.',
			analyse: 'Une seule scène, mais un pont direct avec 1982 : Gaff plie toujours des figurines en papier. Cette fois, c’est un mouton, clin d’œil au titre du roman de Philip K. Dick et à la licorne qu’il laissait dans le premier film.',
			spoiler: null,
			citation: null,
			theme: 'memoire'
		},
		{
			id: 'rachael', nom: 'Rachael', alias: 'Prototype de la Tyrell Corporation', acteur: 'Sean Young (image recréée numériquement)',
			type: 'replicant', modele: 'Nexus-7 expérimental (Tyrell)', affiliation: 'Tyrell Corporation, en fuite depuis 2019',
			serie: 'TYRELL', image: null,
			resume: 'Héroïne du premier film, Rachael est une réplicante expérimentale créée par Eldon Tyrell, dotée de souvenirs implantés qu’elle croyait siens. En 2019, elle s’enfuit avec Deckard.',
			analyse: 'Absente mais au centre de tout, Rachael est le cœur caché de l’intrigue. Son apparition dans 2049, recréée numériquement à partir des traits de Sean Young, est l’une des prouesses techniques du film.',
			spoiler: 'Rachael est tombée enceinte de Deckard et est morte en couches. Ses ossements, retrouvés sous l’arbre de Sapper, portent la trace d’une césarienne. Wallace en présente une copie à Deckard pour le manipuler.',
			citation: null,
			theme: 'naissance'
		}
	];
	window.BRPersonnages = PERSONNAGES;

	const TYPES_COURTS = { replicant: 'Réplicant', humain: 'Humain', ia: 'IA', inconnu: 'Incertain' };

	const THEMES = {
		humanite: 'Humanité et identité', memoire: 'Mémoire et souvenirs', amour: 'Amour homme-machine',
		naissance: 'Naissance et miracle', esclavage: 'Travail jetable', solitude: 'Solitude'
	};

	/* ---------- Cartes ---------- */
	const grille = $('#grille-personnages');
	const vignette = p => p.image
		? '<img src="' + p.image + '" alt="' + echapper(p.nom) + ', interprété par ' + echapper(p.acteur) + '" loading="lazy" style="--pos:' + (p.pos || 'center') + '">'
		: '<div class="classifie" aria-hidden="true"><div class="silhouette"></div><span class="tampon">IMAGE CLASSIFIÉE</span></div>';

	grille.innerHTML = PERSONNAGES.map((p, i) =>
		'<button class="personnage reveal" type="button" data-type="' + p.type + '" data-index="' + i + '" aria-haspopup="dialog">' +
			'<div class="personnage-img"><span class="serie">' + echapper(p.serie) + '</span>' + vignette(p) + '</div>' +
			'<div class="corps">' +
				'<span class="puce puce--' + p.type + '" title="' + TYPES[p.type] + '">' + TYPES_COURTS[p.type] + '</span>' +
				'<h3>' + echapper(p.nom) + '</h3>' +
				'<span class="acteur">' + echapper(p.acteur) + '</span>' +
				'<span class="ouvrir">Ouvrir le dossier →</span>' +
			'</div>' +
		'</button>'
	).join('');
	$$('.personnage', grille).forEach(el => el.classList.add('in'));

	/* ---------- Filtres ---------- */
	const filtres = $$('[data-filtre]');
	filtres.forEach(f => {
		const t = f.dataset.filtre;
		const n = t === 'tous' ? PERSONNAGES.length : PERSONNAGES.filter(p => p.type === t).length;
		f.insertAdjacentHTML('beforeend', '<span class="compte">' + n + '</span>');
		f.addEventListener('click', () => {
			filtres.forEach(x => x.setAttribute('aria-pressed', String(x === f)));
			$$('.personnage', grille).forEach(c => { c.hidden = !(t === 'tous' || c.dataset.type === t); });
		});
	});

	/* ---------- Fenêtre « dossier » ---------- */
	const dialogue = $('#dossier');
	let courant = 0;
	function remplirDossier(i) {
		courant = (i + PERSONNAGES.length) % PERSONNAGES.length;
		const p = PERSONNAGES[courant];
		$('.dossier-image', dialogue).innerHTML = p.image
			? '<img src="' + p.image + '" alt="" style="--pos:' + (p.pos || 'center') + '">'
			: '<div class="classifie" aria-hidden="true"><div class="silhouette"></div><span class="tampon">IMAGE CLASSIFIÉE</span></div>';
		$('.dossier-contenu', dialogue).innerHTML =
			'<div><span class="hud hud--accent">Dossier LAPD · ' + echapper(p.serie) + '</span>' +
			'<h2 id="dossier-titre">' + echapper(p.nom) + '</h2>' +
			'<span class="hud">' + echapper(p.alias) + '</span></div>' +
			'<dl class="dossier-fiche">' +
				'<div><dt>Interprète</dt><dd>' + echapper(p.acteur) + '</dd></div>' +
				'<div><dt>Nature</dt><dd>' + TYPES[p.type] + '</dd></div>' +
				'<div><dt>Modèle / statut</dt><dd>' + echapper(p.modele) + '</dd></div>' +
				'<div><dt>Affiliation</dt><dd>' + echapper(p.affiliation) + '</dd></div>' +
			'</dl>' +
			'<div class="bloc"><h3>Profil</h3><p>' + echapper(p.resume) + '</p></div>' +
			'<div class="bloc"><h3>Analyse</h3><p>' + echapper(p.analyse) + '</p></div>' +
			(p.spoiler ? '<div class="bloc"><h3>Révélations</h3><p class="spoiler" tabindex="0">' + echapper(p.spoiler) + '</p></div>' : '') +
			(p.citation ? '<blockquote><p>« ' + echapper(p.citation.vo) + ' »</p><footer>' + echapper(p.citation.vf) + '</footer></blockquote>' : '') +
			'<p class="hud">Thème lié : <a class="lien" href="themes.html#' + p.theme + '">' + THEMES[p.theme] + '</a></p>' +
			'<div class="dossier-nav">' +
				'<button class="bouton bouton--petit" type="button" data-dossier="-1">← Précédent</button>' +
				'<button class="bouton bouton--petit" type="button" data-dossier="1">Suivant →</button>' +
			'</div>';
	}
	function ouvrirDossier(i) {
		remplirDossier(i);
		if (typeof dialogue.showModal === 'function') dialogue.showModal();
		else dialogue.setAttribute('open', '');
		$('.dossier-fermer', dialogue).focus();
	}
	function fermerDossier() {
		if (typeof dialogue.close === 'function') dialogue.close();
		else dialogue.removeAttribute('open');
	}
	grille.addEventListener('click', e => {
		const c = e.target.closest('.personnage');
		if (c) ouvrirDossier(parseInt(c.dataset.index, 10));
	});
	dialogue.addEventListener('click', e => {
		if (e.target === dialogue) fermerDossier();
		const nav = e.target.closest('[data-dossier]');
		if (nav) remplirDossier(courant + parseInt(nav.dataset.dossier, 10));
	});
	$('.dossier-fermer', dialogue).addEventListener('click', fermerDossier);
	dialogue.addEventListener('keydown', e => {
		if (e.key === 'ArrowRight') remplirDossier(courant + 1);
		if (e.key === 'ArrowLeft') remplirDossier(courant - 1);
	});

	/* ---------- Réseau des relations (SVG généré) ---------- */
	const reseau = $('#reseau');
	if (reseau) {
		const N = {
			k: [480, 300], joi: [290, 165], joshi: [270, 440], sapper: [100, 300], gaff: [330, 55],
			mariette: [620, 110], freysa: [820, 85], deckard: [770, 300], rachael: [940, 190],
			ana: [920, 440], luv: [610, 500], wallace: [400, 545]
		};
		const LIENS = [
			['k', 'joi', 'compagne'], ['k', 'joshi', 'supérieure'], ['k', 'sapper', 'le retire'],
			['k', 'gaff', 'l’interroge'], ['k', 'mariette', 'le surveille'], ['k', 'luv', 'le traque'],
			['k', 'deckard', 'le retrouve'], ['k', 'ana', 'la consulte'], ['luv', 'wallace', 'bras droit'],
			['mariette', 'freysa', 'résistance'], ['deckard', 'rachael', 'amour'], ['gaff', 'deckard', 'ancien partenaire'],
			['luv', 'joshi', 'la tue', 1], ['luv', 'deckard', 'l’enlève', 1], ['deckard', 'ana', 'père', 1],
			['rachael', 'ana', 'mère', 1], ['freysa', 'k', 'lui dit la vérité', 1]
		];
		const parId = Object.fromEntries(PERSONNAGES.map(p => [p.id, p]));
		const couleur = { replicant: '#ff4141', humain: '#8fb4dc', ia: '#e87fd6', inconnu: '#e28212' };
		let svg = '<svg viewBox="0 0 1040 610" role="img" aria-labelledby="reseau-titre reseau-desc">' +
			'<title id="reseau-titre">Réseau des personnages</title>' +
			'<desc id="reseau-desc">Les liens entre K et les autres personnages. Les liens qui révèlent l’intrigue n’apparaissent qu’en mode spoiler.</desc><defs>';
		Object.keys(N).forEach(id => {
			svg += '<clipPath id="clip-' + id + '"><circle cx="' + N[id][0] + '" cy="' + N[id][1] + '" r="31"/></clipPath>';
		});
		svg += '</defs><g class="liens">';
		LIENS.forEach(([a, b, label, sp]) => {
			const [x1, y1] = N[a], [x2, y2] = N[b];
			const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
			const w = label.length * 7 + 14;
			svg += '<g class="' + (sp ? 'lien-spoiler' : 'lien') + '">' +
				'<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + (sp ? '#ff4141' : 'rgba(234,234,234,0.28)') + '" stroke-width="1.2"' + (sp ? ' stroke-dasharray="5 4"' : '') + '/>' +
				'<rect x="' + (mx - w / 2) + '" y="' + (my - 10) + '" width="' + w + '" height="20" fill="#070707"/>' +
				'<text x="' + mx + '" y="' + (my + 4) + '" text-anchor="middle" font-size="11" fill="' + (sp ? '#ff4141' : '#9ea3ab') + '" letter-spacing="0.5">' + echapper(label) + '</text></g>';
		});
		svg += '</g><g class="noeuds">';
		Object.keys(N).forEach(id => {
			const p = parId[id], [x, y] = N[id];
			const c = couleur[p.type];
			const nom = p.nom.replace('Lieutenante ', '').replace('Dr ', '').replace('Niander ', '').replace('Rick ', '').replace(' Morton', '').replace(' Stelline', '');
			svg += '<g class="noeud" data-index="' + PERSONNAGES.indexOf(p) + '" tabindex="0" role="button" aria-label="Ouvrir le dossier de ' + echapper(p.nom) + '" style="cursor:pointer">' +
				'<circle cx="' + x + '" cy="' + y + '" r="35" fill="#0d0d0d" stroke="' + c + '" stroke-width="2"/>' +
				(p.image
					? '<image href="' + p.image + '" x="' + (x - 31) + '" y="' + (y - 31) + '" width="62" height="62" preserveAspectRatio="xMidYMid slice" clip-path="url(#clip-' + id + ')"/>'
					: '<text x="' + x + '" y="' + (y + 6) + '" text-anchor="middle" font-size="18" fill="' + c + '">' + nom.charAt(0) + '</text>') +
				'<text x="' + x + '" y="' + (y + 54) + '" text-anchor="middle" font-size="13" fill="#ffffff" letter-spacing="1">' + echapper(nom.toUpperCase()) + '</text></g>';
		});
		svg += '</g></svg>';
		reseau.innerHTML = svg;
		const majSpoilers = v => $$('.lien-spoiler', reseau).forEach(g => { g.style.display = v ? '' : 'none'; });
		majSpoilers(window.BRSpoilers ? window.BRSpoilers.visibles : false);
		document.addEventListener('br:spoilers', e => majSpoilers(e.detail));
		reseau.addEventListener('click', e => {
			const n = e.target.closest('.noeud');
			if (n) ouvrirDossier(parseInt(n.dataset.index, 10));
		});
		reseau.addEventListener('keydown', e => {
			const n = e.target.closest('.noeud');
			if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); ouvrirDossier(parseInt(n.dataset.index, 10)); }
		});
	}

	/* ---------- Quiz : Quel personnage de Blade Runner 2049 es-tu ? ---------- */
	const QUESTIONS = [
		{ q: 'Un soir de pluie à Los Angeles. Tu…', r: [
			['rentres seul·e, la tête pleine de questions.', { k: 2, deckard: 1 }],
			['attends quelqu’un pour lui demander comment s’est passée sa journée.', { joi: 2, ana: 1 }],
			['descends dans les bas quartiers, là où la ville vit vraiment.', { mariette: 2, k: 1 }],
			['restes au bureau : le travail n’est pas fini.', { joshi: 2, luv: 1, wallace: 1 }]
		] },
		{ q: 'Qu’est-ce qui te fait avancer ?', r: [
			['Comprendre qui je suis vraiment.', { k: 2, ana: 1 }],
			['Protéger ceux que j’aime, même de loin.', { deckard: 2, joi: 1 }],
			['Être le ou la meilleur·e, et que ça se sache.', { luv: 2, joshi: 1 }],
			['Bâtir quelque chose qui me survivra.', { wallace: 2, mariette: 1 }]
		] },
		{ q: 'On te donne un ordre que tu trouves injuste.', r: [
			['J’obéis… puis je doute.', { k: 2, luv: 1 }],
			['J’obéis. Les états d’âme, c’est pour les autres.', { luv: 2, joshi: 1 }],
			['Je fais semblant d’obéir et j’agis à ma façon.', { ana: 2, deckard: 1 }],
			['Je rejoins ceux qui refusent.', { mariette: 2, k: 1 }]
		] },
		{ q: 'Ton refuge idéal ?', r: [
			['Un casino désert, un chien, une bouteille.', { deckard: 2 }],
			['Un atelier silencieux où j’invente des mondes.', { ana: 2, wallace: 1 }],
			['Une tour au-dessus des nuages, baignée de lumière dorée.', { wallace: 2, luv: 1 }],
			['N’importe où, tant que je suis avec la personne que j’aime.', { joi: 2, k: 1 }]
		] },
		{ q: 'Un souvenir d’enfance te revient. Ta première pensée ?', r: [
			['Est-ce vraiment le mien ?', { k: 2 }],
			['Je pourrais le reconstituer dans les moindres détails.', { ana: 2 }],
			['Le passé m’intéresse peu, je vis l’instant présent.', { mariette: 2, joi: 1 }],
			['Je préfère ne pas y repenser.', { deckard: 2, joshi: 1 }]
		] },
		{ q: 'La vérité, pour toi, c’est…', r: [
			['quelque chose qu’il faut parfois enterrer pour éviter le chaos.', { joshi: 2 }],
			['un outil : celui qui la contrôle a le pouvoir.', { wallace: 2, luv: 1 }],
			['ce que je cherche, même si je dois m’y perdre.', { k: 2 }],
			['ce que les gens ont besoin d’entendre pour être heureux.', { joi: 2 }]
		] },
		{ q: 'Tes proches te reprochent surtout d’être…', r: [
			['trop distant·e.', { deckard: 2, k: 1 }],
			['trop dévoué·e.', { joi: 2, luv: 1 }],
			['trop exigeant·e.', { joshi: 2, wallace: 1, luv: 1 }],
			['trop franc·he.', { mariette: 2, ana: 1 }]
		] }
	];
	const RESULTATS = {
		k: 'Discret, loyal, tu doutes de tout, surtout de toi. Tu ne te crois pas spécial·e, et c’est justement ce qui te rend précieux·se : tes choix comptent plus que tes origines.',
		joi: 'Attentionné·e et lumineux·se, tu sais exactement ce dont les autres ont besoin. Reste à savoir si tu le fais par amour… ou parce que c’est dans ta nature.',
		deckard: 'Bourru·e et solitaire, tu caches un grand cœur derrière une porte blindée. Tu protèges ceux que tu aimes, même si cela veut dire disparaître.',
		luv: 'Perfectionniste, efficace, redoutable. Tu veux être la meilleure version de toi-même, quitte à tout sacrifier. Attention : servir quelqu’un ne garantit pas d’en être aimé·e.',
		wallace: 'Visionnaire et ambitieux·se, tu penses à l’échelle des planètes. Tes idées impressionnent autant qu’elles inquiètent. Pense parfois aux gens, pas seulement aux projets.',
		ana: 'Créatif·ve et sensible, tu vis un peu dans ta bulle, et c’est là que naissent tes plus belles idées. Tu offres aux autres des souvenirs qui les aident à tenir.',
		mariette: 'Libre, directe, débrouillarde : tu connais la rue et personne ne te dicte ta conduite. Tu sers une cause plus grande que toi, sans jamais t’en vanter.',
		joshi: 'Lucide et responsable, tu portes le poids des décisions difficiles. Tu crois à l’ordre, parfois au prix de la vérité, mais tu restes loyal·e envers les tiens.'
	};

	const quiz = $('#quiz');
	if (quiz) {
		const zone = $('.quiz-zone', quiz);
		const oeil = $('.oeil', quiz);
		const mesureD = $('[data-mesure="dilatation"]', quiz);
		const mesureT = $('[data-mesure="temps"]', quiz);
		let etape = 0, scores = {}, debut = 0;

		function pupille(v) { oeil.style.setProperty('--pupille', v + '%'); }

		function accueil() {
			zone.innerHTML =
				'<span class="hud hud--accent">Test d’empathie · 7 questions</span>' +
				'<p class="quiz-question">Quel personnage de Blade Runner 2049 es-tu ? Réponds sans trop réfléchir : la machine mesure ton temps de réaction.</p>' +
				'<div><button class="bouton bouton--plein" type="button" data-quiz-start>Commencer le test</button></div>';
			pupille(22);
		}
		function question() {
			const Q = QUESTIONS[etape];
			zone.innerHTML =
				'<div class="quiz-progress" aria-hidden="true"><i style="--p:' + (etape / QUESTIONS.length * 100) + '%"></i></div>' +
				'<span class="hud hud--accent">Question ' + (etape + 1) + ' / ' + QUESTIONS.length + '</span>' +
				'<p class="quiz-question" id="quiz-q">' + echapper(Q.q) + '</p>' +
				'<div class="quiz-reponses" role="group" aria-labelledby="quiz-q">' +
				Q.r.map((r, i) => '<button class="quiz-reponse" type="button" data-rep="' + i + '"><span class="lettre">' + 'ABCD'[i] + '</span><span>' + echapper(r[0]) + '</span></button>').join('') +
				'</div>';
			debut = performance.now();
			$('.quiz-reponse', zone).focus({ preventScroll: true });
		}
		function resultat() {
			const classement = Object.entries(scores).sort((a, b) => b[1] - a[1]);
			const gagnant = classement[0][0];
			const p = PERSONNAGES.find(x => x.id === gagnant);
			const total = classement.reduce((s, x) => s + x[1], 0);
			pupille(34);
			zone.innerHTML =
				'<div class="quiz-progress" aria-hidden="true"><i style="--p:100%"></i></div>' +
				'<span class="hud hud--accent">Analyse terminée</span>' +
				'<div class="quiz-resultat" aria-live="polite">' +
					(p.image ? '<img src="' + p.image + '" alt="" style="object-position:' + (p.pos || 'center') + '">' : '') +
					'<div><span class="hud">Tu es…</span><h3>' + echapper(p.nom) + '</h3><p>' + RESULTATS[gagnant] + '</p>' +
					'<div class="quiz-repartition">' + classement.slice(0, 3).map(([id, s]) => {
						const pp = PERSONNAGES.find(x => x.id === id);
						const pct = Math.round(s / total * 100);
						return '<div class="note-ligne"><span class="nom">' + echapper(pp.nom.split(' ').pop()) + '</span><div class="jauge jauge--vous"><i style="--v:' + pct + '%"></i></div><span class="val">' + pct + '%</span></div>';
					}).join('') + '</div></div>' +
				'</div>' +
				'<div class="groupe-boutons"><button class="bouton bouton--plein" type="button" data-quiz-start>Refaire le test</button>' +
				'<button class="bouton" type="button" data-quiz-dossier="' + PERSONNAGES.indexOf(p) + '">Voir son dossier</button></div>';
		}
		zone.addEventListener('click', e => {
			if (e.target.closest('[data-quiz-start]')) {
				etape = 0; scores = {}; question(); return;
			}
			const d = e.target.closest('[data-quiz-dossier]');
			if (d) { ouvrirDossier(parseInt(d.dataset.quizDossier, 10)); return; }
			const r = e.target.closest('[data-rep]');
			if (!r) return;
			const temps = (performance.now() - debut) / 1000;
			const poids = QUESTIONS[etape].r[parseInt(r.dataset.rep, 10)][1];
			Object.entries(poids).forEach(([id, v]) => { scores[id] = (scores[id] || 0) + v; });
			const dil = 16 + Math.random() * 18;
			pupille(dil);
			mesureD.textContent = 'Pupille ' + (dil / 6).toFixed(1).replace('.', ',') + ' mm';
			mesureT.textContent = 'Réaction ' + temps.toFixed(2).replace('.', ',') + ' s';
			etape++;
			etape < QUESTIONS.length ? question() : resultat();
		});
		accueil();
	}
})();
