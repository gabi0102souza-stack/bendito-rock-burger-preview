/* Bendito Rock Burger · conceito "Setlist na Brasa" */
(() => {
  const TAKEAT = "https://pedido.takeat.app/benditorockburger";
  // Quem tem "reduzir movimento" no sistema vê a versão estática, mas pode acender a brasa pelo botão.
  // ?motion=1 também força a versão animada.
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };
  const systemReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const forceMotion = /[?&]motion=1/.test(location.search) || store.get("bendito-brasa") === "on";
  const reduce = systemReduce && !forceMotion;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  document.documentElement.classList.add("js");
  document.documentElement.classList.toggle("rm", reduce);
  document.documentElement.classList.toggle("motion-ok", forceMotion);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = (n) => `assets/img/${n}.webp`;
  let embersBoost = () => {};

  /* ---------- Dados reais (cardápio digital Takeat) ---------- */
  const SETLIST = [
    { name: "Queen Burger", sub: "Costela defumada", tribute: "Homenagem: Queen", lyric: "“Mamaaa… we are the champions.”", desc: "160g na brasa, cheddar e costela defumada desfiada no brioche selado na manteiga.", price: "45,00", img: "queen", alt: "Queen Burger com costela defumada desfiada e cheddar, em fundo escuro" },
    { name: "Stones Burger", sub: "Pão preto", tribute: "Homenagem: Rolling Stones", lyric: "Sucesso incontestável. Nunca sai da turnê.", desc: "Na brasa, cheddar, cebola caramelizada e bacon assado na brasa no pão preto.", price: "39,90", img: "stones", alt: "Stones Burger no pão preto com cheddar e bacon, chamas ao fundo" },
    { name: "Doors Burger", sub: "Queijo coalho", tribute: "Homenagem: The Doors", lyric: "“Come on, baby, light my fire!”", desc: "160g na brasa, cebola e tomate grelhados e creme de queijo coalho no brioche.", price: "37,90", img: "doors", alt: "Doors Burger com cebola grelhada e creme de queijo coalho sobre tábua de madeira" },
    { name: "Iron Burger", sub: "Jalapeño", tribute: "Homenagem: Iron Maiden", lyric: "Até a Dama de Ferro se renderia.", desc: "160g, cheddar, bacon na brasa e jalapeño na ardência certa. Ardor moderado.", price: "45,90", img: "iron", alt: "Iron Burger com bacon, cheddar e pimenta jalapeño sobre tábua" },
    { name: "B.B Pig", sub: "X-Bacon", tribute: "O blues do bacon", lyric: "Tudo que é bom nunca sai de moda.", desc: "Cheese bacon na brasa: cheddar e o rei dos reis, bacon grelhado na brasa.", price: "43,90", img: "bbpig", alt: "B.B Pig, cheese bacon na brasa, em fundo escuro" },
    { name: "Chorão Turbo Bacon", sub: "Queijo empanado", tribute: "Homenagem: Chorão", lyric: "Um clássico, só que turbinado.", desc: "Burger, queijo empanado crocante por fora e derretido por dentro, e muito bacon crocante.", price: "43,90", img: "chorao-turbo", alt: "Chorão Turbo Bacon com queijo empanado e bacon crocante" },
  ];

  const MENU = [
    { id: "burgers", label: "Burgers", items: [
      ["Chorão Burger", "O PCQ bem feito: pão, carne 160g na brasa e queijo prato derretido no brioche.", "31,90", "chorao"],
      ["Bendito Burger", "Pegada de churrasco argentino: 160g na brasa, queijo prato e chimichurri da casa.", "31,90", "bendito", "Assinatura"],
      ["Stones Burger", "Cheddar, cebola caramelizada e bacon na brasa no pão preto.", "39,90", "stones"],
      ["Presley Burger | X-Salada", "Digno do Rei do Rock: queijo prato, alface, tomate e cebola roxa crua.", "33,90", "presley"],
      ["Doors Burger", "Cebola e tomate grelhados e creme de queijo coalho.", "37,90", "doors"],
      ["B.B Pig | X-Bacon", "Cheddar e bacon grelhado na brasa. O clássico dos clássicos.", "43,90", "bbpig"],
      ["Iron Burger", "Cheddar, bacon na brasa e jalapeño. Ardor moderado.", "45,90", "iron"],
      ["Queen Burger | Costela Defumada", "Cheddar e costela defumada desfiada. Digno de uma canção.", "45,00", "queen", "Campeão"],
      ["Bendito Frango", "Frango empanado, alface americana, queijo prato e maionese de alho.", "31,90", "frango"],
      ["Benditoscana", "Burger de linguiça toscana, bacon, mussarela, rúcula, vinagrete e maionese jalapeño.", "35,90", "benditoscana"],
      ["Chorão Turbo Bacon", "Queijo empanado crocante e derretido por dentro, com muito bacon.", "43,90", "chorao-turbo"],
    ]},
    { id: "veggie", label: "Veggie", items: [
      ["Chorão Burger Vegetariano", "Cheese burger vegetariano com queijo prato derretido no brioche.", "35,90", "chorao-veg"],
      ["Presley Burger Vegetariano", "Burger vegetariano, queijo prato, alface, tomate e cebola roxa.", "36,90", "presley-veg"],
      ["Doors Burger Vegetariano", "Cebola e tomate grelhados e creme de queijo coalho.", "39,90", "doors-veg"],
    ]},
    { id: "porcoes", label: "Porções", items: [
      ["Ella Fries", "Rústicas com banho de cheddar cremoso e costela defumada desfiada.", "36,90", "ella", "Pra dividir… ou não"],
      ["Benditas Perfeição Rústicas", "Fritas rústicas com cheddar cremoso e bacon.", "29,90", "rusticas-cb"],
      ["Benditas Rústicas", "Corte rústico. Escolha o tempero e a maionese.", "24,90", "rusticas"],
      ["Perfeição Cheddar + Bacon", "Palito com bacon assado na brasa e cheddar. Acompanha maionese de alho.", "16,90", "perfeicao"],
      ["Cajun Moon Fries", "Palito no tempero cajun da casa: pimenta, páprica, sal e um toque de açúcar.", "12,90", "cajun"],
      ["The Troopers", "Palito com alecrim, sal grosso e alho frito.", "12,90", "troopers"],
      ["Little Rock Chicken", "Porção com 6 nuggets.", "10,90", "nuggets"],
    ]},
    { id: "cervejas", label: "Cervejas", items: [
      ["IPA das Galáxias", "Artesanal, explosiva, frutada e cítrica. 330ml. Cerveja forte pros fortes.", "15,90", "ipa-galaxias", "Artesanal"],
      ["German Pilsner", "Artesanal sem glúten, lúpulo Saaz, 5% e 25 IBU.", "15,90", null, "Sem glúten"],
      ["Lohn Ultra", "Artesanal sem glúten.", "15,90", null, "Sem glúten"],
      ["Chopp de Vinho Draft 600ml", "Malte, lúpulo e uva. Cor violeta.", "18,90"],
      ["All Day IPA 355ml", "Long neck.", "15,90"],
      ["Heineken 355ml", "Long neck.", "12,90"],
      ["Eisenbahn IPA 355ml", "Long neck.", "12,90"],
      ["Eisenbahn 355ml", "Long neck.", "10,90"],
      ["Amstel 355ml", "Long neck.", "10,90"],
    ]},
    { id: "bebidas", label: "Bebidas", items: [
      ["Suco Natural 500ml", "Artesanal: fruta, água e açúcar. Sem aditivos.", "16,90", "suco"],
      ["Refrigerante", "Lata 350ml.", "8,90"],
      ["Água Mineral", "", "5,00"],
    ]},
    { id: "sobremesas", label: "Sobremesas", items: [
      ["Cheesecake", "Base de farofa amanteigada, creme de cream cheese e calda de frutas vermelhas.", "13,90", "cheesecake"],
    ]},
  ];

  // Horário do cardápio digital (0 = domingo). Valores em horas decimais.
  const HOURS = { 0: [18.5, 22.5], 1: null, 2: [18, 22.5], 3: [18, 22.5], 4: [15, 22.5], 5: [18, 23], 6: [18, 23] };
  const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const fmtH = (h) => { const H = Math.floor(h), m = Math.round((h - H) * 60); return m ? `${H}h${String(m).padStart(2, "0")}` : `${H}h`; };

  /* ---------- Setlist ---------- */
  const track = $("#setlistTrack");
  track.innerHTML = SETLIST.map((t, i) => `
    <li class="track" data-name="${t.name}">
      <div class="track-photo">
        <span class="track-num">Faixa ${String(i + 1).padStart(2, "0")}</span>
        <img src="${img(t.img === "iron" || t.img === "stones" ? t.img + "-640" : t.img)}" alt="${t.alt}" loading="lazy" decoding="async" width="600" height="600">
      </div>
      <div class="track-body">
        <span class="track-tribute">${t.tribute}</span>
        <h3>${t.name}</h3>
        <p class="track-lyric">${t.lyric}</p>
        <p class="track-desc">${t.desc}</p>
        <div class="track-foot">
          <span class="price"><small>R$</small>${t.price}</span>
          <a class="track-link" href="${TAKEAT}" target="_blank" rel="noopener">Pedir essa faixa →</a>
        </div>
      </div>
    </li>`).join("") + `
    <li class="track track--bis">
      <span class="chip">Bis!</span>
      <h3>Quer mais?</h3>
      <p>Tem mais 5 burgers, 3 veggies, fritas e breja artesanal no cardápio completo.</p>
      <a class="btn btn--hot" href="#cardapio">Ver o cardápio</a>
    </li>`;

  // Escala do amplificador 0–11
  const scale = $("#ampScale");
  let scaleSvg = "";
  for (let n = 0; n <= 11; n++) {
    const a = (-135 + (n / 11) * 270 - 90) * Math.PI / 180;
    const x = 60 + Math.cos(a) * 53, y = 60 + Math.sin(a) * 53 + 3;
    scaleSvg += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" data-n="${n}">${n}</text>`;
  }
  scale.innerHTML = scaleSvg;
  const vu = $("#vu");
  vu.innerHTML = Array.from({ length: 14 }, (_, i) => `<i class="${i > 10 ? "hot" : i > 7 ? "mid" : ""}"></i>`).join("");
  const vuBars = $$("i", vu), scaleNums = $$("text", scale);
  const knob = $("#ampKnob"), ampValue = $("#ampValue"), nowPlaying = $("#nowPlaying");
  const tracks = $$(".track", track).filter((t) => !t.classList.contains("track--bis"));
  let level = 0, activeIdx = -1;

  function setVolume(p) {
    p = Math.min(1, Math.max(0, p));
    knob.style.transform = `rotate(${-135 + p * 270}deg)`;
    const v = Math.round(p * 11);
    ampValue.textContent = String(v).padStart(2, "0");
    scaleNums.forEach((t) => t.classList.toggle("is-on", +t.dataset.n <= v));
  }
  function setActive(i) {
    if (i === activeIdx) return;
    activeIdx = i;
    tracks.forEach((t, k) => t.classList.toggle("is-active", k === i));
    if (tracks[i]) nowPlaying.textContent = tracks[i].dataset.name;
  }
  // o VU só roda enquanto tem sinal; parado, não gasta nada
  let vuRunning = false, vuOn = -1;
  function vuLoop() {
    const on = Math.round(level * vuBars.length);
    if (on !== vuOn) { vuBars.forEach((b, i) => b.classList.toggle("on", i < on)); vuOn = on; }
    level *= 0.9;
    if (level > 0.02) requestAnimationFrame(vuLoop); else { level = 0; vuBars.forEach((b) => b.classList.remove("on")); vuOn = 0; vuRunning = false; }
  }
  function bumpVU(v) { level = Math.min(1, Math.max(level, v)); if (!vuRunning && level > 0.02) { vuRunning = true; requestAnimationFrame(vuLoop); } }
  // escolhe a faixa mais próxima de um ponto de foco no viewport
  function pickActive(focusX) {
    let best = 0, dist = Infinity;
    tracks.forEach((t, i) => {
      const r = t.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - focusX);
      if (d < dist) { dist = d; best = i; }
    });
    setActive(best);
  }
  setVolume(0); setActive(0);

  /* ---------- Cardápio com abas ---------- */
  const tabs = $("#tabs"), panels = $("#menuPanels");
  tabs.innerHTML = MENU.map((c, i) => `<button class="tab" role="tab" id="tab-${c.id}" aria-controls="panel-${c.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${c.label}<span class="count">${c.items.length}</span></button>`).join("");
  panels.innerHTML = MENU.map((c, i) => `
    <div class="menu-panel" role="tabpanel" id="panel-${c.id}" aria-labelledby="tab-${c.id}" ${i ? "hidden" : ""} tabindex="0">
      <div class="menu-grid">${c.items.map(([n, d, p, im, tag]) => `
        <article class="item ${im ? "" : "item--noimg"}">
          ${im ? `<img src="assets/img/thumb/${im}.webp" alt="${n}" loading="lazy" decoding="async" width="96" height="96">` : ""}
          <div>
            <div class="item-top"><h3>${n}</h3><span class="price"><small>R$</small>${p}</span></div>
            ${d ? `<p>${d}</p>` : ""}
            ${tag ? `<span class="tag">${tag}</span>` : ""}
          </div>
        </article>`).join("")}
      </div>
    </div>`).join("");
  const tabBtns = $$(".tab", tabs);
  function selectTab(btn, focus) {
    tabBtns.forEach((b) => { const on = b === btn; b.setAttribute("aria-selected", on); b.tabIndex = on ? 0 : -1; $("#" + b.getAttribute("aria-controls")).hidden = !on; });
    if (focus) btn.focus();
    btn.scrollIntoView({ block: "nearest", inline: "nearest" });
    if (hasGsap) ScrollTrigger.refresh();
  }
  tabBtns.forEach((b, i) => {
    b.addEventListener("click", () => selectTab(b));
    b.addEventListener("keydown", (e) => {
      const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (k) { e.preventDefault(); selectTab(tabBtns[(i + k + tabBtns.length) % tabBtns.length], true); }
      if (e.key === "Home") { e.preventDefault(); selectTab(tabBtns[0], true); }
      if (e.key === "End") { e.preventDefault(); selectTab(tabBtns[tabBtns.length - 1], true); }
    });
  });

  /* ---------- Aberto agora ---------- */
  function spNow() {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day, h: (+get("hour") % 24) + (+get("minute")) / 60 };
  }
  function renderStatus() {
    const { day, h } = spNow();
    const today = HOURS[day];
    let open = false, more;
    if (today && h >= today[0] && h < today[1]) { open = true; more = `até ${fmtH(today[1])}`; }
    else if (today && h < today[0]) more = `abre hoje às ${fmtH(today[0])}`;
    else {
      let d = (day + 1) % 7; while (!HOURS[d]) d = (d + 1) % 7;
      more = `abre ${d === (day + 1) % 7 ? "amanhã" : DAYS[d].toLowerCase()} às ${fmtH(HOURS[d][0])}`;
    }
    $$("[data-status]").forEach((el) => {
      el.classList.toggle("is-open", open); el.classList.toggle("is-closed", !open);
      $("[data-status-text]", el).innerHTML = `${open ? "Aberto agora" : "Fechado"}<span class="status-more"> · ${more}</span>`;
    });
    $("#hours").innerHTML = [2, 3, 4, 5, 6, 0, 1].map((d) => `<tr class="${d === day ? "is-today" : ""}"><th scope="row">${DAYS[d]}${d === day ? " · hoje" : ""}</th><td>${HOURS[d] ? `${fmtH(HOURS[d][0])} às ${fmtH(HOURS[d][1])}` : "Fechado"}</td></tr>`).join("");
  }
  renderStatus(); setInterval(renderStatus, 60000);

  /* ---------- Menu mobile ---------- */
  const menuBtn = $("#menuBtn"), nav = $("#nav");
  menuBtn.addEventListener("click", () => { const o = menuBtn.getAttribute("aria-expanded") !== "true"; menuBtn.setAttribute("aria-expanded", o); nav.classList.toggle("is-open", o); });
  $$("a", nav).forEach((a) => a.addEventListener("click", () => { menuBtn.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }));

  /* ---------- Carrossel do setlist (celular / sem pin) ---------- */
  const viewport = $("#setlistViewport");
  let lastLeft = 0;
  viewport.addEventListener("scroll", () => {
    const max = viewport.scrollWidth - viewport.clientWidth;
    if (max <= 0) return;
    setVolume(viewport.scrollLeft / max);
    bumpVU(Math.min(1, Math.abs(viewport.scrollLeft - lastLeft) / 40));
    lastLeft = viewport.scrollLeft;
    pickActive(window.innerWidth / 2);
  }, { passive: true });

  /* ---------- Loader ---------- */
  const loader = $("#loader");
  function hideLoader() { if (!loader || loader.classList.contains("is-done")) return; loader.classList.add("is-done"); document.body.classList.remove("is-loading"); setTimeout(() => loader.remove(), 900); intro(); }
  if (reduce) { loader.remove(); }
  else {
    document.body.classList.add("is-loading");
    // a auréola acende só na primeira visita da sessão, e não espera as imagens: sai quando o HTML está pronto
    let seen = false; try { seen = sessionStorage.getItem("bendito-intro") === "1"; sessionStorage.setItem("bendito-intro", "1"); } catch (e) {}
    const t0 = performance.now();
    const go = () => setTimeout(hideLoader, Math.max(0, (seen ? 0 : 750) - (performance.now() - t0)));
    if (document.readyState !== "loading") go(); else document.addEventListener("DOMContentLoaded", go);
    setTimeout(hideLoader, 1800);
  }

  /* ---------- Palavras que sobem ---------- */
  function splitWords(el) {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span"); w.className = "w";
            const s = document.createElement("span"); s.textContent = part; w.appendChild(s); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") {
          if (n.tagName === "EM") { const w = document.createElement("span"); w.className = "w"; const s = document.createElement("span"); n.replaceWith(w); s.appendChild(n); w.appendChild(s); }
          else walk(n);
        }
      });
    };
    walk(el);
  }

  let introDone = false;
  function intro() {
    if (introDone || !hasGsap || reduce) return; introDone = true;
    gsap.from(".hero .w > span", { yPercent: 115, duration: 1, ease: "power4.out", stagger: 0.05 });
    gsap.from([".eyebrow", ".hero-lead", ".hero-cta", ".hero-facts"], { y: 24, opacity: 0, duration: .9, ease: "power3.out", stagger: .1, delay: .35 });
    gsap.from(".hero-media", { scale: .9, opacity: 0, duration: 1.4, ease: "power3.out", delay: .15 });
  }

  /* ---------- GSAP / Lenis ---------- */
  if (hasGsap && !reduce) {
    gsap.registerPlugin(ScrollTrigger);
    $$(".split").forEach(splitWords);
    if (!loader || !document.body.contains(loader)) intro();

    let lenis = null;
    if (typeof window.Lenis !== "undefined") {
      lenis = new Lenis({ lerp: 0.11, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
      $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
        const id = a.getAttribute("href"); if (id.length < 2) return;
        const target = $(id); if (!target) return;
        e.preventDefault(); lenis.scrollTo(target, { offset: id === "#topo" || id === "#setlist" ? 0 : -84, duration: 1.4 });
        history.replaceState(null, "", id);
      }));
    }

    // títulos das seções
    $$(".section .split").forEach((el) => {
      gsap.from($$(".w > span", el), { yPercent: 115, duration: .9, ease: "power4.out", stagger: .04, scrollTrigger: { trigger: el, start: "top 85%" } });
    });
    ScrollTrigger.batch(".reveal", { start: "top 88%", onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: .9, ease: "power3.out", stagger: .1, overwrite: true }) });

    // hero em cena: ao rolar, o burger se aproxima, a brasa cresce e o texto sobe
    const heroTl = gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.5 } });
    heroTl.to(".hero-media img", { scale: 1.14, yPercent: 6, ease: "none" }, 0)
      .to(".hero-glow", { scale: 1.35, opacity: 1, ease: "none" }, 0)
      .to(".hero-fire", { scaleY: 1.6, ease: "none" }, 0)
      .to(".hero-copy", { yPercent: -14, ease: "none" }, 0)
      .to(".hero-tag", { y: -20, opacity: 0, ease: "none" }, 0);

    // marquee com velocidade ligada ao scroll
    const mq = $("#marquee"); let mqX = 0, boost = 0, mqVisible = true, half = mq.scrollWidth / 2;
    new IntersectionObserver(([e]) => { mqVisible = e.isIntersecting; }).observe(mq);
    window.addEventListener("resize", () => { half = mq.scrollWidth / 2; });
    document.fonts && document.fonts.ready.then(() => { half = mq.scrollWidth / 2; });
    gsap.ticker.add(() => {
      if (!mqVisible) return;
      mqX -= 0.6 + boost; boost *= 0.92;
      if (mqX <= -half) mqX += half; if (mqX > 0) mqX -= half;
      mq.style.transform = `translate3d(${mqX}px,0,0)`;
    });
    ScrollTrigger.create({ onUpdate: (s) => { boost = Math.min(14, Math.abs(s.getVelocity()) / 220); embersBoost(Math.abs(s.getVelocity()) / 2500); } });

    // setlist preso com rolagem horizontal (desktop)
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const dist = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      const tw = gsap.to(track, {
        x: () => -dist(), ease: "none",
        onUpdate() { setVolume(this.progress()); const vr = viewport.getBoundingClientRect(); pickActive(vr.left + vr.width * 0.35); },
        scrollTrigger: {
          trigger: ".setlist", start: "top top", end: () => "+=" + (dist() + window.innerHeight * 0.3), pin: ".setlist-stage", scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (s) => bumpVU(Math.min(1, Math.abs(s.getVelocity()) / 1800)),
        },
      });
      return () => { tw.scrollTrigger && tw.scrollTrigger.kill(); tw.kill(); gsap.set(track, { x: 0 }); };
    });
    window.addEventListener("load", () => ScrollTrigger.refresh());
  } else {
    $$(".reveal").forEach((el) => { el.style.opacity = 1; el.style.transform = "none"; });
  }

  /* ---------- Brasas pela página toda (canvas fixo) ---------- */
  const cv = $("#embers");
  if (cv) {
    const ctx = cv.getContext("2d");
    const mobile = window.innerWidth < 700;
    let W = 0, H = 0, parts = [], extra = 0, running = !document.hidden, hs = 1;
    const mouse = { x: -999, y: -999 };
    const hero = $(".hero");
    // faísca é pequena e desfocada: resolução 1x basta e custa até 4x menos
    const resize = () => { W = window.innerWidth; H = window.innerHeight; cv.width = W; cv.height = H; };
    resize(); window.addEventListener("resize", resize);
    // quanto do hero ainda aparece na tela: lá a brasa é mais forte (medido só no scroll)
    const heroShare = () => { const r = hero.getBoundingClientRect(); hs = Math.max(0, Math.min(1, r.bottom / H)); return hs; };
    window.addEventListener("scroll", heroShare, { passive: true }); heroShare();
    // sprites pré-renderizados (brilho + núcleo) em 4 tons: desenhar imagem é muito mais barato que shadowBlur
    const SPR = 32;
    const sprites = [18, 26, 34, 42].map((hue) => {
      const c = document.createElement("canvas"); c.width = c.height = SPR;
      const g = c.getContext("2d"), grad = g.createRadialGradient(SPR / 2, SPR / 2, 0, SPR / 2, SPR / 2, SPR / 2);
      grad.addColorStop(0, `hsla(${hue},100%,85%,1)`);
      grad.addColorStop(0.18, `hsla(${hue},100%,62%,.95)`);
      grad.addColorStop(0.45, `hsla(${hue},100%,50%,.28)`);
      grad.addColorStop(1, `hsla(${hue},100%,45%,0)`);
      g.fillStyle = grad; g.fillRect(0, 0, SPR, SPR);
      return c;
    });
    const spawn = (x, y, burst) => {
      const big = Math.random() < 0.12;
      parts.push({
        x: x ?? Math.random() * W, y: y ?? H + 10,
        vx: burst ? (Math.random() - .5) * 6 : (Math.random() - .5) * .6,
        vy: burst ? -(1 + Math.random() * 5) : -(0.7 + Math.random() * 1.9),
        r: big ? 2.2 + Math.random() * 1.8 : 0.6 + Math.random() * 1.8,
        life: 0, max: (burst ? 60 : 160) + Math.random() * 180, spr: sprites[(Math.random() * 4) | 0], seed: Math.random() * 100,
      });
    };
    const draw = (p, a) => {
      const s = p.r * 9;
      ctx.globalAlpha = a;
      ctx.drawImage(p.spr, p.x - s / 2, p.y - s / 2, s, s);
    };
    if (reduce) {
      // versão estática: um quadro de faíscas paradas sobre o hero
      for (let i = 0; i < (mobile ? 30 : 60); i++) { spawn(Math.random() * W, H * (0.35 + Math.random() * 0.65)); }
      ctx.globalCompositeOperation = "lighter";
      parts.forEach((p) => draw(p, 0.35 + Math.random() * 0.5));
      const fade = () => { cv.style.opacity = heroShare(); };
      window.addEventListener("scroll", fade, { passive: true }); fade();
    } else {
      embersBoost = (v) => { extra = Math.min(10, extra + v * 8); };
      window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
      document.addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; });
      // clique solta faísca
      window.addEventListener("pointerdown", (e) => { for (let i = 0; i < (mobile ? 14 : 22); i++) spawn(e.clientX, e.clientY, true); });
      document.addEventListener("visibilitychange", () => { running = !document.hidden; if (running) loop(); });
      const cap = mobile ? 90 : 200;
      function loop() {
        if (!running) return;
        ctx.globalAlpha = 1;
        ctx.clearRect(0, 0, W, H);
        const rate = (mobile ? 0.5 : 0.9) + hs * (mobile ? 1.6 : 2.6) + extra;
        extra *= 0.93;
        let n = Math.floor(rate) + (Math.random() < rate % 1 ? 1 : 0);
        while (n-- > 0 && parts.length < cap) spawn();
        ctx.globalCompositeOperation = "lighter";
        parts = parts.filter((p) => {
          p.life++;
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 < 16000) { p.vx += dx / 1500; p.vy += dy / 2600; }
          p.vx += Math.sin((p.life + p.seed * 10) * 0.035) * 0.025;
          p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.vy *= 0.999;
          const a = Math.max(0, 1 - p.life / p.max) * (0.55 + 0.45 * Math.sin(p.life * 0.25 + p.seed) ** 2);
          draw(p, a);
          return p.life < p.max && p.y > -20;
        });
        requestAnimationFrame(loop);
      }
      loop();
    }
  }

  /* ---------- Pavio de progresso + cursor em brasa ---------- */
  const fuse = $("#fuseBar"), fuseHead = $("#fuseHead");
  const setFuse = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    fuse.style.transform = `scaleX(${p})`;
    fuseHead.style.transform = `translateX(${p * window.innerWidth}px)`;
    fuseHead.style.opacity = p > 0.002 ? 1 : 0;
  };
  window.addEventListener("scroll", setFuse, { passive: true }); setFuse();

  if (finePointer && !reduce) {
    const glow = $("#cursorGlow");
    let gx = -500, gy = -500, tx = -500, ty = -500;
    window.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; glow.classList.add("is-on"); }, { passive: true });
    document.addEventListener("pointerleave", () => glow.classList.remove("is-on"));
    // só anima enquanto o cursor está andando
    let following = false;
    const follow = () => {
      gx += (tx - gx) * 0.14; gy += (ty - gy) * 0.14;
      glow.style.transform = `translate3d(${gx}px,${gy}px,0)`;
      if (Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5) requestAnimationFrame(follow); else following = false;
    };
    window.addEventListener("pointermove", () => { if (!following) { following = true; requestAnimationFrame(follow); } }, { passive: true });

    /* botões magnéticos */
    $$(".magnetic, .magnetic-soft").forEach((el) => {
      const k = el.classList.contains("magnetic-soft") ? 0.08 : 0.28;
      el.addEventListener("pointermove", (e) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * k}px, ${(e.clientY - r.top - r.height / 2) * k}px)`; });
      el.addEventListener("pointerleave", () => { el.style.transition = "transform .5s cubic-bezier(.2,.7,.1,1)"; el.style.transform = ""; setTimeout(() => (el.style.transition = ""), 500); });
    });

    /* cartões inclinam com o mouse */
    $$(".track, .bento .card, .order, .casa-big").forEach((el) => {
      el.classList.add("tilt");
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transition = "transform .6s cubic-bezier(.2,.7,.1,1), border-color .4s, box-shadow .4s, opacity .4s"; el.style.transform = ""; setTimeout(() => (el.style.transition = ""), 600); });
    });
  }

  /* ---------- Botão acender/apagar a brasa (só para quem tem movimento reduzido no sistema) ---------- */
  const mt = $("#motionToggle");
  if (systemReduce && mt) {
    mt.hidden = false;
    mt.textContent = reduce ? "🔥 Acender a brasa" : "Apagar a brasa";
    mt.setAttribute("aria-label", reduce ? "Ativar animações do site" : "Desativar animações do site");
    mt.addEventListener("click", () => { store.set("bendito-brasa", reduce ? "on" : "off"); location.reload(); });
  }
})();
