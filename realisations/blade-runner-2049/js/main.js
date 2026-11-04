/* =====================================================================
   BLADE RUNNER 2049 — Script commun à toutes les pages
   Chaque module ne s'active que si les éléments dont il a besoin
   existent dans la page.
   ===================================================================== */
(function () {
	'use strict';

	document.documentElement.classList.add('js');
	if (!document.documentElement.lang) document.documentElement.lang = 'fr';

	/* --- Stockage local protégé (navigation privée, stockage bloqué…) --- */
	const stockage = {
		lire(cle, defaut) {
			try { const v = localStorage.getItem('br2049-' + cle); return v === null ? defaut : v; }
			catch (e) { return defaut; }
		},
		ecrire(cle, valeur) {
			try { localStorage.setItem('br2049-' + cle, valeur); } catch (e) { /* ignoré */ }
		}
	};
	window.BRStockage = stockage;

	const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	const $ = (sel, ctx) => (ctx || document).querySelector(sel);
	const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

	/* --- Petite notification --- */
	let toastEl, toastMinuteur;
	function toast(message) {
		if (!toastEl) {
			toastEl = document.createElement('div');
			toastEl.className = 'toast';
			toastEl.setAttribute('role', 'status');
			document.body.appendChild(toastEl);
		}
		toastEl.textContent = message;
		toastEl.classList.add('visible');
		clearTimeout(toastMinuteur);
		toastMinuteur = setTimeout(() => toastEl.classList.remove('visible'), 1800);
	}
	window.BRToast = toast;

	/* =================================================================
	   En-tête : état au défilement, barre de progression, menu mobile
	   ================================================================= */
	const header = $('.site-header');
	const progression = document.createElement('div');
	progression.className = 'progression';
	progression.setAttribute('aria-hidden', 'true');
	document.body.appendChild(progression);

	function surDefilement() {
		const y = window.scrollY;
		if (header) header.classList.toggle('is-scrolled', y > 40);
		const max = document.documentElement.scrollHeight - window.innerHeight;
		progression.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
	}
	window.addEventListener('scroll', surDefilement, { passive: true });
	surDefilement();

	const caseMenu = $('#hamburger-checkbox');
	if (caseMenu) {
		$$('.menu a').forEach(a => a.addEventListener('click', () => { caseMenu.checked = false; document.body.style.overflow = ''; }));
		caseMenu.addEventListener('change', () => {
			document.body.style.overflow = caseMenu.checked ? 'hidden' : '';
		});
		document.addEventListener('keydown', e => {
			if (e.key === 'Escape' && caseMenu.checked) { caseMenu.checked = false; document.body.style.overflow = ''; }
		});
	}

	/* =================================================================
	   Apparition au défilement (le contenu reste lisible sans JS)
	   ================================================================= */
	const aReveler = $$('.reveal');
	if ('IntersectionObserver' in window && !mouvementReduit) {
		const io = new IntersectionObserver(entrees => {
			entrees.forEach(e => {
				if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
			});
		}, { rootMargin: '0px 0px -8% 0px' });
		aReveler.forEach(el => {
			const r = el.getBoundingClientRect();
			if (r.top < window.innerHeight) el.classList.add('in');
			else io.observe(el);
		});
	} else {
		aReveler.forEach(el => el.classList.add('in'));
	}

	/* =================================================================
	   Pluie (canvas)
	   ================================================================= */
	(function pluie() {
		const bouton = $('#btn-pluie');
		const canvas = document.createElement('canvas');
		canvas.id = 'pluie';
		canvas.setAttribute('aria-hidden', 'true');
		document.body.appendChild(canvas);
		const ctx = canvas.getContext('2d');
		let largeur = 0, hauteur = 0, gouttes = [], anim = null;
		let actif = stockage.lire('pluie', mouvementReduit ? '0' : '1') === '1';
		const VENT = -0.11;

		function nouvelleGoutte(depart) {
			const z = Math.random();
			return {
				x: Math.random() * (largeur + 160) - 40,
				y: depart ? Math.random() * hauteur : -30 - Math.random() * 200,
				l: 9 + z * 24,
				v: 7 + z * 15,
				z: z,
				rouge: Math.random() < 0.06
			};
		}
		function dimensionner() {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			largeur = window.innerWidth;
			hauteur = window.innerHeight;
			canvas.width = largeur * dpr;
			canvas.height = hauteur * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			const n = Math.round(Math.min(240, (largeur * hauteur) / 5600));
			gouttes = Array.from({ length: n }, () => nouvelleGoutte(true));
		}
		function image() {
			ctx.clearRect(0, 0, largeur, hauteur);
			ctx.lineCap = 'round';
			for (const g of gouttes) {
				g.y += g.v;
				g.x += g.v * VENT;
				if (g.y - g.l > hauteur) Object.assign(g, nouvelleGoutte(false));
				const a = 0.1 + g.z * 0.32;
				ctx.strokeStyle = g.rouge ? 'rgba(255,90,90,' + a + ')' : 'rgba(190,215,255,' + a + ')';
				ctx.lineWidth = 0.5 + g.z * 0.9;
				ctx.beginPath();
				ctx.moveTo(g.x, g.y);
				ctx.lineTo(g.x - g.l * VENT, g.y - g.l);
				ctx.stroke();
			}
			anim = requestAnimationFrame(image);
		}
		function demarrer() {
			if (anim) return;
			canvas.hidden = false;
			dimensionner();
			anim = requestAnimationFrame(image);
		}
		function arreter() {
			if (anim) cancelAnimationFrame(anim);
			anim = null;
			ctx.clearRect(0, 0, largeur, hauteur);
			canvas.hidden = true;
		}
		function appliquer() {
			if (bouton) bouton.setAttribute('aria-pressed', String(actif));
			actif ? demarrer() : arreter();
		}
		window.addEventListener('resize', () => { if (anim) dimensionner(); });
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) { if (anim) { cancelAnimationFrame(anim); anim = null; } }
			else if (actif) demarrer();
		});
		if (bouton) bouton.addEventListener('click', () => {
			actif = !actif;
			stockage.ecrire('pluie', actif ? '1' : '0');
			appliquer();
			toast(actif ? 'Pluie activée' : 'Pluie coupée');
		});
		appliquer();
	})();

	/* =================================================================
	   Ambiance sonore générative (Web Audio API)
	   Tout est synthétisé en direct : ce n'est PAS la bande originale.
	   Couches : pluie, nappe de synthé (esprit Yamaha CS-80), ville, spinners.
	   ================================================================= */
	const Ambiance = (function () {
		let ctx = null, maitre, analyseur, reverb;
		const couches = {};
		const etat = { pluie: true, nappe: true, ville: true, spinner: true };
		let volume = 0.7, actif = false, minuteurArret = null;
		const abonnes = new Set();
		const prevenir = () => abonnes.forEach(f => f());

		function bruit(secondes, couleur) {
			const n = Math.floor(ctx.sampleRate * secondes);
			const buf = ctx.createBuffer(2, n, ctx.sampleRate);
			for (let c = 0; c < 2; c++) {
				const d = buf.getChannelData(c);
				let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, brun = 0;
				for (let i = 0; i < n; i++) {
					const blanc = Math.random() * 2 - 1;
					if (couleur === 'brun') {
						brun = (brun + 0.02 * blanc) / 1.02;
						d[i] = brun * 3.5;
					} else if (couleur === 'rose') {
						b0 = 0.99886 * b0 + blanc * 0.0555179;
						b1 = 0.99332 * b1 + blanc * 0.0750759;
						b2 = 0.969 * b2 + blanc * 0.153852;
						b3 = 0.8665 * b3 + blanc * 0.3104856;
						b4 = 0.55 * b4 + blanc * 0.5329522;
						b5 = -0.7616 * b5 - blanc * 0.016898;
						d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + blanc * 0.5362) * 0.11;
						b6 = blanc * 0.115926;
					} else {
						d[i] = blanc;
					}
				}
			}
			return buf;
		}
		function reponseImpulsionnelle(secondes) {
			const n = Math.floor(ctx.sampleRate * secondes);
			const buf = ctx.createBuffer(2, n, ctx.sampleRate);
			for (let c = 0; c < 2; c++) {
				const d = buf.getChannelData(c);
				for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.8);
			}
			return buf;
		}
		function sortieCouche(envoiReverb) {
			const g = ctx.createGain();
			g.gain.value = 0;
			g.connect(maitre);
			const envoi = ctx.createGain();
			envoi.gain.value = envoiReverb;
			g.connect(envoi);
			envoi.connect(reverb);
			return g;
		}

		/* Pluie : bruit rose filtré + gouttes aléatoires */
		let bufGoutte, minuteurGouttes = null;
		function creerPluie() {
			const sortie = sortieCouche(0.15);
			const src = ctx.createBufferSource();
			src.buffer = bruit(4, 'rose');
			src.loop = true;
			const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 450;
			const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6500;
			const g = ctx.createGain(); g.gain.value = 0.6;
			src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(sortie);
			src.start();
			bufGoutte = bruit(0.06, 'blanc');
			return { sortie };
		}
		function goutte() {
			if (!actif || !etat.pluie) return;
			const t = ctx.currentTime;
			const s = ctx.createBufferSource(); s.buffer = bufGoutte;
			const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
			bp.frequency.value = 1800 + Math.random() * 3200; bp.Q.value = 9;
			const g = ctx.createGain();
			g.gain.setValueAtTime(0, t);
			g.gain.linearRampToValueAtTime(0.18 + Math.random() * 0.25, t + 0.004);
			g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
			const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
			s.connect(bp); bp.connect(g);
			if (p) { p.pan.value = Math.random() * 2 - 1; g.connect(p); p.connect(couches.pluie.sortie); }
			else g.connect(couches.pluie.sortie);
			s.start(t); s.stop(t + 0.07);
		}

		/* Nappe : 4 voix, 2 dents de scie désaccordées + sinus grave chacune */
		const ACCORDS = [
			[73.42, 110.0, 174.61, 329.63],   // Ré – La – Fa – Mi
			[58.27, 87.31, 146.83, 220.0],    // Si♭ – Fa – Ré – La
			[65.41, 98.0, 155.56, 293.66],    // Do – Sol – Mi♭ – Ré
			[55.0, 82.41, 130.81, 246.94]     // La – Mi – Do – Si
		];
		let voix = [], filtreNappe, indiceAccord = 0, minuteurAccords = null;
		function creerNappe() {
			const sortie = sortieCouche(0.55);
			filtreNappe = ctx.createBiquadFilter();
			filtreNappe.type = 'lowpass';
			filtreNappe.frequency.value = 520;
			filtreNappe.Q.value = 4;
			const lfo = ctx.createOscillator(); lfo.frequency.value = 0.05;
			const lfoG = ctx.createGain(); lfoG.gain.value = 260;
			lfo.connect(lfoG); lfoG.connect(filtreNappe.frequency); lfo.start();
			const g = ctx.createGain(); g.gain.value = 0.085;
			filtreNappe.connect(g); g.connect(sortie);
			voix = ACCORDS[0].map(f => {
				const oscs = [-7, 7].map(cents => {
					const o = ctx.createOscillator();
					o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = cents;
					o.connect(filtreNappe); o.start();
					return o;
				});
				const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = f / 2;
				const subG = ctx.createGain(); subG.gain.value = 0.5;
				sub.connect(subG); subG.connect(filtreNappe); sub.start();
				oscs.push(sub);
				return oscs;
			});
			return { sortie };
		}
		function accordSuivant() {
			if (!actif) return;
			indiceAccord = (indiceAccord + 1) % ACCORDS.length;
			const t = ctx.currentTime;
			ACCORDS[indiceAccord].forEach((f, i) => {
				voix[i][0].frequency.setTargetAtTime(f, t, 1.2);
				voix[i][1].frequency.setTargetAtTime(f, t, 1.2);
				voix[i][2].frequency.setTargetAtTime(f / 2, t, 1.2);
			});
			/* « souffle cuivré » à la manière d'un CS-80 : le filtre s'ouvre puis se referme */
			filtreNappe.frequency.cancelScheduledValues(t);
			filtreNappe.frequency.setTargetAtTime(1500, t, 1.4);
			filtreNappe.frequency.setTargetAtTime(520, t + 4, 2.5);
		}

		/* Ville : grondement grave + bourdonnement de néon */
		function creerVille() {
			const sortie = sortieCouche(0.2);
			const src = ctx.createBufferSource(); src.buffer = bruit(5, 'brun'); src.loop = true;
			const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 220;
			const g = ctx.createGain(); g.gain.value = 0.55;
			src.connect(lp); lp.connect(g); g.connect(sortie); src.start();
			const neon = ctx.createOscillator(); neon.type = 'square'; neon.frequency.value = 100;
			const neonF = ctx.createBiquadFilter(); neonF.type = 'bandpass'; neonF.frequency.value = 200; neonF.Q.value = 12;
			const neonG = ctx.createGain(); neonG.gain.value = 0.012;
			const trem = ctx.createOscillator(); trem.frequency.value = 0.3;
			const tremG = ctx.createGain(); tremG.gain.value = 0.008;
			trem.connect(tremG); tremG.connect(neonG.gain); trem.start();
			neon.connect(neonF); neonF.connect(neonG); neonG.connect(sortie); neon.start();
			return { sortie };
		}

		/* Spinners : passages aléatoires de gauche à droite */
		let minuteurSpinner = null, bufSpinner;
		function creerSpinner() {
			bufSpinner = bruit(6, 'rose');
			return { sortie: sortieCouche(0.6) };
		}
		function passageSpinner() {
			if (!actif || !etat.spinner) return planifierSpinner();
			const t = ctx.currentTime, duree = 5 + Math.random() * 3;
			const sens = Math.random() < 0.5 ? -1 : 1;
			const src = ctx.createBufferSource(); src.buffer = bufSpinner;
			const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.6;
			bp.frequency.setValueAtTime(260, t);
			bp.frequency.linearRampToValueAtTime(1300, t + duree * 0.45);
			bp.frequency.linearRampToValueAtTime(320, t + duree);
			const moteur = ctx.createOscillator(); moteur.type = 'sawtooth';
			moteur.frequency.setValueAtTime(78, t);
			moteur.frequency.linearRampToValueAtTime(58, t + duree);
			const mF = ctx.createBiquadFilter(); mF.type = 'lowpass'; mF.frequency.value = 340;
			const mG = ctx.createGain(); mG.gain.value = 0.25;
			const g = ctx.createGain();
			g.gain.setValueAtTime(0.0001, t);
			g.gain.exponentialRampToValueAtTime(0.5, t + duree * 0.45);
			g.gain.exponentialRampToValueAtTime(0.0001, t + duree);
			let dest = g;
			if (ctx.createStereoPanner) {
				const p = ctx.createStereoPanner();
				p.pan.setValueAtTime(-0.9 * sens, t);
				p.pan.linearRampToValueAtTime(0.9 * sens, t + duree);
				g.connect(p); p.connect(couches.spinner.sortie);
			} else g.connect(couches.spinner.sortie);
			src.connect(bp); bp.connect(g);
			moteur.connect(mF); mF.connect(mG); mG.connect(g);
			src.start(t); moteur.start(t);
			src.stop(t + duree + 0.1); moteur.stop(t + duree + 0.1);
			planifierSpinner();
		}
		function planifierSpinner() {
			clearTimeout(minuteurSpinner);
			if (!actif) return;
			minuteurSpinner = setTimeout(passageSpinner, 9000 + Math.random() * 14000);
		}

		function initialiser() {
			const AC = window.AudioContext || window.webkitAudioContext;
			if (!AC) return false;
			ctx = new AC();
			maitre = ctx.createGain(); maitre.gain.value = 0;
			const comp = ctx.createDynamicsCompressor();
			analyseur = ctx.createAnalyser(); analyseur.fftSize = 2048;
			reverb = ctx.createConvolver(); reverb.buffer = reponseImpulsionnelle(3.8);
			const retour = ctx.createGain(); retour.gain.value = 0.5;
			reverb.connect(retour); retour.connect(maitre);
			maitre.connect(comp); comp.connect(analyseur); analyseur.connect(ctx.destination);
			couches.pluie = creerPluie();
			couches.nappe = creerNappe();
			couches.ville = creerVille();
			couches.spinner = creerSpinner();
			return true;
		}
		const niveaux = { pluie: 0.9, nappe: 1, ville: 0.8, spinner: 0.9 };
		function appliquerCouches() {
			if (!ctx) return;
			const t = ctx.currentTime;
			for (const k in couches) couches[k].sortie.gain.setTargetAtTime(etat[k] ? niveaux[k] : 0, t, 0.5);
		}

		return {
			etat,
			get actif() { return actif; },
			get analyseur() { return analyseur; },
			get volume() { return volume; },
			abonner(f) { abonnes.add(f); },
			demarrer() {
				if (!ctx && !initialiser()) { toast('Audio non pris en charge par ce navigateur'); return; }
				clearTimeout(minuteurArret);
				ctx.resume();
				actif = true;
				appliquerCouches();
				maitre.gain.cancelScheduledValues(ctx.currentTime);
				maitre.gain.setTargetAtTime(volume, ctx.currentTime, 0.8);
				clearInterval(minuteurGouttes);
				minuteurGouttes = setInterval(() => { if (Math.random() < 0.7) goutte(); }, 90);
				clearInterval(minuteurAccords);
				minuteurAccords = setInterval(accordSuivant, 14000);
				planifierSpinner();
				prevenir();
			},
			arreter() {
				if (!ctx) return;
				actif = false;
				maitre.gain.setTargetAtTime(0, ctx.currentTime, 0.4);
				clearInterval(minuteurGouttes); clearInterval(minuteurAccords); clearTimeout(minuteurSpinner);
				minuteurArret = setTimeout(() => { if (!actif) ctx.suspend(); }, 2000);
				prevenir();
			},
			basculer() { actif ? this.arreter() : this.demarrer(); },
			definirCouche(nom, valeur) { etat[nom] = valeur; appliquerCouches(); prevenir(); },
			definirVolume(v) {
				volume = v;
				if (ctx && actif) maitre.gain.setTargetAtTime(v, ctx.currentTime, 0.15);
				prevenir();
			}
		};
	})();
	window.Ambiance = Ambiance;

	const boutonSon = $('#btn-son');
	if (boutonSon) {
		boutonSon.addEventListener('click', () => {
			Ambiance.basculer();
			toast(Ambiance.actif ? 'Ambiance sonore : Los Angeles, 2049' : 'Ambiance coupée');
		});
		Ambiance.abonner(() => boutonSon.setAttribute('aria-pressed', String(Ambiance.actif)));
	}

	/* Console d'ambiance (page Univers) */
	(function console_() {
		const console_el = $('[data-console]');
		if (!console_el) return;
		const lecture = $('[data-console-lecture]', console_el);
		const vol = $('#volume-ambiance');
		const volSortie = $('#volume-sortie');
		const toile = $('canvas', console_el);
		const c2d = toile.getContext('2d');
		const boutons = $$('[data-couche]', console_el);

		function maj() {
			lecture.setAttribute('aria-pressed', String(Ambiance.actif));
			lecture.querySelector('.etiquette').textContent = Ambiance.actif ? 'Couper l’ambiance' : 'Lancer l’ambiance';
			boutons.forEach(b => b.setAttribute('aria-pressed', String(Ambiance.etat[b.dataset.couche])));
		}
		Ambiance.abonner(maj);
		lecture.addEventListener('click', () => Ambiance.basculer());
		boutons.forEach(b => b.addEventListener('click', () => {
			Ambiance.definirCouche(b.dataset.couche, !Ambiance.etat[b.dataset.couche]);
			if (!Ambiance.actif) Ambiance.demarrer();
		}));
		vol.addEventListener('input', () => {
			Ambiance.definirVolume(vol.value / 100);
			volSortie.textContent = vol.value + '%';
		});
		maj();

		let donnees = null;
		function dessiner() {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const w = toile.clientWidth, h = toile.clientHeight;
			if (toile.width !== w * dpr) { toile.width = w * dpr; toile.height = h * dpr; }
			c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
			c2d.clearRect(0, 0, w, h);
			c2d.strokeStyle = 'rgba(255,255,255,0.06)';
			c2d.lineWidth = 1;
			for (let x = 0; x < w; x += 24) { c2d.beginPath(); c2d.moveTo(x, 0); c2d.lineTo(x, h); c2d.stroke(); }
			c2d.beginPath(); c2d.moveTo(0, h / 2); c2d.lineTo(w, h / 2); c2d.stroke();
			c2d.strokeStyle = '#e87fd6';
			c2d.shadowColor = '#e87fd6';
			c2d.shadowBlur = 8;
			c2d.lineWidth = 1.6;
			c2d.beginPath();
			const an = Ambiance.analyseur;
			if (Ambiance.actif && an) {
				if (!donnees) donnees = new Uint8Array(an.fftSize);
				an.getByteTimeDomainData(donnees);
				const pas = donnees.length / w;
				for (let x = 0; x < w; x++) {
					const v = (donnees[Math.floor(x * pas)] - 128) / 128;
					const y = h / 2 + v * h * 1.6;
					x === 0 ? c2d.moveTo(x, y) : c2d.lineTo(x, y);
				}
			} else {
				c2d.moveTo(0, h / 2); c2d.lineTo(w, h / 2);
			}
			c2d.stroke();
			c2d.shadowBlur = 0;
			requestAnimationFrame(dessiner);
		}
		requestAnimationFrame(dessiner);
	})();

	/* =================================================================
	   Spoilers : interrupteur global + révélation au clic
	   ================================================================= */
	(function spoilers() {
		const interrupteurs = $$('[data-spoilers]');
		if (!interrupteurs.length && !$('.spoiler')) return;
		let visibles = stockage.lire('spoilers', '0') === '1';
		function appliquer() {
			document.body.classList.toggle('spoilers-visibles', visibles);
			interrupteurs.forEach(b => {
				b.setAttribute('aria-pressed', String(visibles));
				const t = b.querySelector('.texte-interrupteur');
				if (t) t.textContent = visibles ? 'Spoilers affichés' : 'Spoilers masqués';
			});
			document.dispatchEvent(new CustomEvent('br:spoilers', { detail: visibles }));
		}
		interrupteurs.forEach(b => b.addEventListener('click', () => {
			visibles = !visibles;
			stockage.ecrire('spoilers', visibles ? '1' : '0');
			appliquer();
		}));
		document.addEventListener('click', e => {
			const s = e.target.closest('.spoiler');
			if (s && !document.body.classList.contains('spoilers-visibles')) s.classList.add('revele');
		});
		document.addEventListener('keydown', e => {
			const s = e.target.closest && e.target.closest('.spoiler');
			if (s && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); s.classList.add('revele'); }
		});
		$$('.spoiler').forEach(s => { if (!s.hasAttribute('tabindex')) s.setAttribute('tabindex', '0'); });
		window.BRSpoilers = { get visibles() { return visibles; } };
		appliquer();
	})();

	/* =================================================================
	   Visionneuse d'images (galerie)
	   ================================================================= */
	(function visionneuse() {
		const galeries = $$('[data-galerie]');
		if (!galeries.length) return;
		let liste = [], index = 0, dernierFocus = null, el = null;

		function construire() {
			el = document.createElement('div');
			el.className = 'visionneuse';
			el.setAttribute('role', 'dialog');
			el.setAttribute('aria-modal', 'true');
			el.setAttribute('aria-label', 'Visionneuse d’images');
			el.hidden = true;
			el.innerHTML =
				'<img alt="">' +
				'<p></p>' +
				'<button class="v-btn v-fermer" type="button" aria-label="Fermer">×</button>' +
				'<button class="v-btn v-prec" type="button" aria-label="Image précédente">‹</button>' +
				'<button class="v-btn v-suiv" type="button" aria-label="Image suivante">›</button>';
			document.body.appendChild(el);
			el.querySelector('.v-fermer').addEventListener('click', fermer);
			el.querySelector('.v-prec').addEventListener('click', () => afficher(index - 1));
			el.querySelector('.v-suiv').addEventListener('click', () => afficher(index + 1));
			el.addEventListener('click', e => { if (e.target === el) fermer(); });
		}
		function afficher(i) {
			index = (i + liste.length) % liste.length;
			const b = liste[index];
			const img = el.querySelector('img');
			img.src = b.dataset.src;
			img.alt = b.dataset.legende || '';
			el.querySelector('p').textContent = (index + 1) + ' / ' + liste.length + ' — ' + (b.dataset.legende || '');
		}
		function ouvrir(galerie, bouton) {
			if (!el) construire();
			liste = $$('[data-src]', galerie);
			dernierFocus = bouton;
			el.hidden = false;
			document.body.style.overflow = 'hidden';
			afficher(liste.indexOf(bouton));
			el.querySelector('.v-fermer').focus();
		}
		function fermer() {
			el.hidden = true;
			document.body.style.overflow = '';
			if (dernierFocus) dernierFocus.focus();
		}
		document.addEventListener('keydown', e => {
			if (!el || el.hidden) return;
			if (e.key === 'Escape') fermer();
			if (e.key === 'ArrowLeft') afficher(index - 1);
			if (e.key === 'ArrowRight') afficher(index + 1);
		});
		galeries.forEach(g => g.addEventListener('click', e => {
			const b = e.target.closest('[data-src]');
			if (b) ouvrir(g, b);
		}));
	})();

	/* =================================================================
	   Mur de citations (rotation automatique + boutons)
	   ================================================================= */
	$$('[data-citations]').forEach(mur => {
		const donnees = JSON.parse(mur.querySelector('script[type="application/json"]').textContent);
		const vo = $('.vo', mur), vf = $('.vf', mur), qui = $('figcaption', mur);
		const points = $('.citations-points', mur.parentElement);
		let i = 0, minuteur = null;
		if (points) points.innerHTML = donnees.map(() => '<i></i>').join('');
		function afficher(n, animer) {
			i = (n + donnees.length) % donnees.length;
			const appliquer = () => {
				vo.textContent = donnees[i].vo;
				vf.textContent = donnees[i].vf;
				qui.textContent = donnees[i].qui;
				vo.classList.remove('fondu'); vf.classList.remove('fondu');
				if (points) $$('i', points).forEach((p, k) => p.classList.toggle('actif', k === i));
			};
			if (animer && !mouvementReduit) {
				vo.classList.add('fondu'); vf.classList.add('fondu');
				setTimeout(appliquer, 450);
			} else appliquer();
		}
		function relancer() {
			clearInterval(minuteur);
			if (!mouvementReduit) minuteur = setInterval(() => afficher(i + 1, true), 7000);
		}
		const prec = $('[data-citation-prec]', mur.parentElement);
		const suiv = $('[data-citation-suiv]', mur.parentElement);
		if (prec) prec.addEventListener('click', () => { afficher(i - 1, true); relancer(); });
		if (suiv) suiv.addEventListener('click', () => { afficher(i + 1, true); relancer(); });
		afficher(0, false);
		relancer();
	});

	/* =================================================================
	   Compte à rebours jusqu'au 1er janvier 2049
	   ================================================================= */
	(function rebours() {
		const el = $('#rebours');
		if (!el) return;
		const cible = new Date(2049, 0, 1, 0, 0, 0);
		const champs = { a: $('[data-r="a"]', el), j: $('[data-r="j"]', el), h: $('[data-r="h"]', el), m: $('[data-r="m"]', el), s: $('[data-r="s"]', el) };
		const deux = n => String(n).padStart(2, '0');
		function maj() {
			const maintenant = new Date();
			if (maintenant >= cible) { el.querySelector('.rebours-chiffres').textContent = 'Nous sommes en 2049.'; return; }
			let annees = cible.getFullYear() - maintenant.getFullYear();
			let repere = new Date(maintenant); repere.setFullYear(maintenant.getFullYear() + annees);
			if (repere > cible) { annees--; repere = new Date(maintenant); repere.setFullYear(maintenant.getFullYear() + annees); }
			let reste = Math.floor((cible - repere) / 1000);
			const j = Math.floor(reste / 86400); reste -= j * 86400;
			const h = Math.floor(reste / 3600); reste -= h * 3600;
			const m = Math.floor(reste / 60); const s = reste - m * 60;
			champs.a.textContent = annees; champs.j.textContent = j;
			champs.h.textContent = deux(h); champs.m.textContent = deux(m); champs.s.textContent = deux(s);
		}
		maj();
		setInterval(maj, 1000);
	})();

	/* =================================================================
	   Palettes : copier une couleur au clic
	   ================================================================= */
	document.addEventListener('click', e => {
		const b = e.target.closest('[data-hex]');
		if (!b) return;
		const hex = b.dataset.hex;
		const fini = () => toast('Couleur ' + hex + ' copiée');
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(hex).then(fini, () => toast('Couleur : ' + hex));
		} else toast('Couleur : ' + hex);
	});

	/* =================================================================
	   Débats (page Thèmes) : la position choisie met en avant
	   l'argument adverse le plus fort
	   ================================================================= */
	$$('[data-debat]').forEach(debat => {
		const id = debat.dataset.debat;
		const boutons = $$('[data-position]', debat);
		const pour = $('.pour', debat), contre = $('.contre', debat);
		const etat = $('.debat-etat', debat);
		function appliquer(pos) {
			boutons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.position === pos)));
			pour.classList.toggle('mise-en-avant', pos === 'contre');
			contre.classList.toggle('mise-en-avant', pos === 'pour');
			if (!etat) return;
			if (pos === 'pour') etat.textContent = 'Vous êtes plutôt d’accord. Lisez l’argument contraire, mis en avant.';
			else if (pos === 'contre') etat.textContent = 'Vous n’êtes pas d’accord. Lisez l’argument contraire, mis en avant.';
			else etat.textContent = 'Choisissez une position pour voir l’argument qui la conteste.';
		}
		boutons.forEach(b => b.addEventListener('click', () => {
			stockage.ecrire('debat-' + id, b.dataset.position);
			appliquer(b.dataset.position);
		}));
		appliquer(stockage.lire('debat-' + id, ''));
	});

	/* =================================================================
	   Notes du visiteur (page Avis)
	   ================================================================= */
	(function notesVisiteur() {
		const zone = $('[data-notes-vous]');
		if (!zone) return;
		const curseurs = $$('input[type="range"]', zone);
		const total = $('#note-vous'), ecart = $('#ecart-note');
		const maNote = parseFloat(zone.dataset.maNote);
		function calculer() {
			let somme = 0;
			curseurs.forEach(c => {
				const v = parseFloat(c.value);
				somme += v;
				const sortie = $('output[for="' + c.id + '"]', zone);
				if (sortie) sortie.textContent = v.toFixed(1).replace('.', ',');
				stockage.ecrire('note-' + c.id, c.value);
			});
			const moyenne = somme / curseurs.length;
			total.textContent = moyenne.toFixed(1).replace('.', ',') + ' / 10';
			const d = moyenne - maNote;
			if (Math.abs(d) < 0.25) ecart.textContent = 'On est d’accord, à peu de chose près.';
			else if (d > 0) ecart.textContent = 'Vous êtes plus enthousiaste que moi (+' + d.toFixed(1).replace('.', ',') + ').';
			else ecart.textContent = 'Vous êtes plus sévère que moi (' + d.toFixed(1).replace('.', ',') + ').';
		}
		curseurs.forEach(c => {
			const memo = stockage.lire('note-' + c.id, null);
			if (memo !== null) c.value = memo;
			c.addEventListener('input', calculer);
		});
		calculer();
	})();

	/* =================================================================
	   Frise interactive (page Inspirations)
	   ================================================================= */
	(function frise() {
		const bloc = $('[data-frise]');
		if (!bloc) return;
		const detail = $('.frise-detail', bloc);
		const onglets = $$('[data-frise-onglet]', bloc);
		const listes = $$('ol[data-liste]', bloc);
		function choisir(bouton) {
			const ol = bouton.closest('ol');
			$$('button', ol).forEach(b => b.setAttribute('aria-pressed', String(b === bouton)));
			$('.an-grand', detail).textContent = bouton.dataset.an;
			$('.type', detail).textContent = bouton.dataset.type;
			$('h3', detail).textContent = bouton.dataset.titre;
			$('p', detail).textContent = bouton.dataset.texte;
		}
		listes.forEach(ol => ol.addEventListener('click', e => {
			const b = e.target.closest('button');
			if (b) choisir(b);
		}));
		/* Centre la date sélectionnée dans la frise visible, sans faire défiler la page */
		function centrer(ol) {
			const b = $('button[aria-pressed="true"]', ol);
			const conteneur = ol.parentElement;
			if (b && !conteneur.hidden) conteneur.scrollLeft = b.parentElement.offsetLeft - conteneur.clientWidth / 2 + b.parentElement.offsetWidth / 2;
		}
		listes.forEach(centrer);
		onglets.forEach(o => o.addEventListener('click', () => {
			onglets.forEach(x => x.setAttribute('aria-pressed', String(x === o)));
			listes.forEach(ol => { ol.parentElement.hidden = ol.dataset.liste !== o.dataset.friseOnglet; });
			const ol = listes.find(l => l.dataset.liste === o.dataset.friseOnglet);
			choisir($('button[aria-pressed="true"]', ol) || $('button', ol));
			centrer(ol);
		}));
		bloc.addEventListener('keydown', e => {
			const b = e.target.closest('ol button');
			if (!b || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
			const li = b.parentElement;
			const cible = e.key === 'ArrowRight' ? li.nextElementSibling : li.previousElementSibling;
			if (cible) { const nb = $('button', cible); nb.focus(); choisir(nb); nb.scrollIntoView({ block: 'nearest', inline: 'center', behavior: mouvementReduit ? 'auto' : 'smooth' }); }
		});
	})();

	/* =================================================================
	   Easter egg : le mouton en origami de Gaff
	   ================================================================= */
	$$('[data-origami]').forEach(b => {
		const messages = [
			'Gaff plie un mouton. Clin d’œil à la licorne de 1982, et au roman : les androïdes rêvent-ils de moutons électriques ?',
			'« Did you ever take that test yourself? » — Rachael à Deckard, 1982.',
			'Le numéro de série de K, KD6-3.7, est lisible sur son dossier au LAPD.',
			'Le spinner de K porte le logo Peugeot, partenaire du film.'
		];
		let n = 0;
		b.addEventListener('click', () => {
			const cible = document.getElementById(b.getAttribute('aria-controls'));
			if (!cible) return;
			cible.hidden = false;
			cible.textContent = messages[n % messages.length];
			n++;
		});
	});
})();
