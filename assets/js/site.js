/* Quentin Bertails — scripts du site (toutes les pages). */
(function () {
  /* L'adresse Formspree se règle dans l'interface d'édition (Réglages du site).
     Vide : le formulaire ouvre la messagerie du visiteur. */
  var formEl = document.getElementById("contact-form");
  var FORM_ENDPOINT = (formEl && formEl.getAttribute("data-endpoint")) || "";

  /* Année du pied de page */
  document.querySelectorAll(".js-year").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* Menu mobile */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setMenu = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.querySelector(".sr-only").textContent = open ? "Fermer le menu" : "Ouvrir le menu";
      toggle.querySelector("path").setAttribute("d", open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16");
    };
    toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("is-open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });
  }

  /* Comparateur avant / après (accueil) */
  var frame = document.getElementById("compare-frame");
  var range = document.getElementById("compare-range");
  if (frame && range) {
    var setPos = function (v) { frame.style.setProperty("--pos", v + "%"); };
    range.addEventListener("input", function () { setPos(range.value); });
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      var from = 86, to = 50, duration = 1400, start = null, touched = false;
      range.addEventListener("pointerdown", function () { touched = true; });
      setPos(from);
      setTimeout(function () {
        requestAnimationFrame(function step(t) {
          if (touched) return;
          if (start === null) start = t;
          var p = Math.min((t - start) / duration, 1);
          var v = from + (to - from) * (1 - Math.pow(1 - p, 3));
          setPos(v.toFixed(2));
          range.value = Math.round(v);
          if (p < 1) requestAnimationFrame(step);
        });
      }, 500);
    }
  }

  /* Formulaire : pré-sélection du besoin */
  var select = document.getElementById("f-type");
  if (select) {
    var BESOINS = {
      creation: "Création d'un site",
      refonte: "Refonte d'un site existant",
      maintenance: "Maintenance ou hébergement",
      traduction: "Traduction en anglais"
    };
    var param = new URLSearchParams(window.location.search).get("besoin");
    if (param && BESOINS[param]) select.value = BESOINS[param];
    document.querySelectorAll("[data-project]").forEach(function (btn) {
      btn.addEventListener("click", function () { select.value = btn.getAttribute("data-project"); });
    });
  }

  /* Formulaire de contact */
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var emailTo = document.getElementById("contact-email").getAttribute("href").replace("mailto:", "");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    status.className = "form-status";
    if (!form.checkValidity()) {
      var firstInvalid = form.querySelector(":invalid");
      status.textContent = "Merci de remplir les champs obligatoires : nom, email valide, message et accord.";
      status.classList.add("err");
      if (firstInvalid) firstInvalid.focus();
      return;
    }
    var data = new FormData(form);

    if (FORM_ENDPOINT) {
      status.textContent = "Envoi en cours…";
      fetch(FORM_ENDPOINT, { method: "POST", body: data, headers: { "Accept": "application/json" } })
        .then(function (res) {
          if (!res.ok) throw new Error();
          form.reset();
          status.textContent = "Demande envoyée. Je vous réponds rapidement.";
          status.classList.add("ok");
        })
        .catch(function () {
          status.textContent = "L'envoi n'a pas fonctionné. Écrivez-moi directement à " + emailTo + ".";
          status.classList.add("err");
        });
      return;
    }

    var subject = "Demande de devis : " + data.get("besoin");
    var body =
      "Nom : " + data.get("nom") + "\n" +
      "Établissement : " + (data.get("etablissement") || "-") + "\n" +
      "Email : " + data.get("email") + "\n" +
      "Téléphone : " + (data.get("telephone") || "-") + "\n" +
      "Besoin : " + data.get("besoin") + "\n\n" +
      data.get("message");
    window.location.href = "mailto:" + emailTo + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    status.textContent = "Votre messagerie s'ouvre avec la demande prête à envoyer.";
    status.classList.add("ok");
  });
})();
