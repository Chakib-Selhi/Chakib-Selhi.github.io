/* ChakibOS : bureau, gestionnaire de fenêtres, menus, barre des tâches, langue et démarrage. */
(function () {
  "use strict";
  var APPS = window.APPS;
  var I = window.ICONS;
  var I18N = window.I18N;
  var t = I18N.t;
  var esc = window.esc;

  var desktop = document.getElementById("desktop");
  var layer = document.getElementById("windows");
  var iconsNav = document.getElementById("icons");
  var taskList = document.getElementById("task-list");
  var mqMobile = window.matchMedia("(max-width: 760px)");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function D() { return window.PORTFOLIO; }
  function isMobile() { return mqMobile.matches; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
  function safeGet(store, k) { try { return window[store].getItem(k); } catch (e) { return null; } }
  function safeSet(store, k, v) { try { window[store].setItem(k, v); } catch (e) { /* stockage indisponible */ } }

  /* ================= Fenêtres ================= */
  var wins = new Map();
  var active = null;
  var zTop = 10;
  var cascade = 0;
  var uid = 0;

  var api = { openApp: openApp, close: close, isMobile: isMobile, refresh: refreshAll };

  function titleOf(w) { return typeof w.app.title === "function" ? w.app.title(w.arg) : w.app.title; }

  function openApp(appId, arg) {
    var app = APPS[appId];
    if (!app) return null;
    var key = app.key ? app.key(arg) : appId;
    var existing = wins.get(key);
    if (existing) { restore(existing); focus(existing); return existing; }
    return createWindow(key, appId, app, arg);
  }

  function createWindow(key, appId, app, arg) {
    var id = "win-" + ++uid;
    var el = document.createElement("section");
    el.className = "win" + (app.className ? " " + app.className : "");
    el.id = id;
    el.tabIndex = -1;
    el.setAttribute("role", app.dialog ? "alertdialog" : "dialog");
    el.setAttribute("aria-labelledby", id + "-title");
    el.innerHTML =
      '<header class="win__bar">' +
      '<button type="button" class="win__btn win__btn--close" data-act="close">' + I.close + "</button>" +
      '<h2 class="win__title" id="' + id + '-title"><span></span></h2>' +
      (app.dialog ? "" :
        '<button type="button" class="win__btn" data-act="min">' + I.min + "</button>" +
        '<button type="button" class="win__btn" data-act="max">' + I.max + "</button>") +
      "</header>" +
      '<div class="win__body"></div>' +
      (app.dialog ? "" : '<div class="win__resize" aria-hidden="true"></div>');
    layer.appendChild(el);

    var w = { key: key, id: id, appId: appId, el: el, app: app, arg: arg, minimized: false, maximized: false, task: null };
    wins.set(key, w);
    addTask(w);
    renderWindow(w);
    place(w);
    bindWindow(w);
    focus(w);
    if (!el.contains(document.activeElement)) el.focus({ preventScroll: true });
    if (!reducedMotion) {
      el.classList.add("is-opening");
      el.addEventListener("animationend", function () { el.classList.remove("is-opening"); }, { once: true });
    }
    return w;
  }

  // (Re)dessine le contenu et les libellés d'une fenêtre : à l'ouverture, au changement de langue, après GitHub.
  function renderWindow(w) {
    var title = titleOf(w);
    w.title = title;
    w.el.querySelector(".win__title span").textContent = title;
    w.el.querySelector('[data-act="close"]').setAttribute("aria-label", t("win.close", { title: title }));
    var bMin = w.el.querySelector('[data-act="min"]');
    if (bMin) bMin.setAttribute("aria-label", t("win.min"));
    var bMax = w.el.querySelector('[data-act="max"]');
    if (bMax) bMax.setAttribute("aria-label", t(w.maximized ? "win.restore" : "win.max"));
    if (w.task) w.task.textContent = title;
    var body = w.el.querySelector(".win__body");
    var scroll = body.scrollTop;
    body.innerHTML = w.app.render(w.arg);
    if (w.app.mount) w.app.mount(body, api, w);
    body.scrollTop = scroll;
  }

  function refreshAll() {
    applyStatic();
    wins.forEach(renderWindow);
  }

  function place(w) {
    var r = desktop.getBoundingClientRect();
    var size = w.app.size || [560, 420];
    var W = Math.min(size[0], r.width - 24);
    var H = Math.min(size[1], r.height - 24);
    var x, y;
    if (w.app.pos) {
      var pos = w.app.pos(r, W, H);
      x = pos[0]; y = pos[1];
    } else {
      x = 170 + (cascade % 7) * 34;
      y = 30 + (cascade % 7) * 28;
      cascade++;
    }
    x = clamp(x, 8, Math.max(8, r.width - W - 8));
    y = clamp(y, 8, Math.max(8, r.height - H - 8));
    w.el.style.left = x + "px";
    w.el.style.top = y + "px";
    w.el.style.width = W + "px";
    w.el.style.height = H + "px";
  }

  function bindWindow(w) {
    var el = w.el;
    var bar = el.querySelector(".win__bar");
    el.addEventListener("pointerdown", function () { if (active !== w) focus(w); });
    el.querySelector('[data-act="close"]').addEventListener("click", function () { close(w); });
    var bMin = el.querySelector('[data-act="min"]');
    if (bMin) bMin.addEventListener("click", function () { minimize(w); });
    var bMax = el.querySelector('[data-act="max"]');
    if (bMax) bMax.addEventListener("click", function () { toggleMax(w); });
    bar.addEventListener("dblclick", function (e) {
      if (!e.target.closest("button") && !w.app.dialog) toggleMax(w);
    });

    // Déplacement par la barre de titre.
    bar.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || e.target.closest("button") || w.maximized || isMobile()) return;
      e.preventDefault();
      var r = desktop.getBoundingClientRect();
      var sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
      bar.setPointerCapture(e.pointerId);
      el.classList.add("is-dragging");
      function move(ev) {
        el.style.left = clamp(ox + ev.clientX - sx, 80 - el.offsetWidth, r.width - 80) + "px";
        el.style.top = clamp(oy + ev.clientY - sy, 0, r.height - 32) + "px";
      }
      function up() {
        bar.removeEventListener("pointermove", move);
        bar.removeEventListener("pointerup", up);
        bar.removeEventListener("pointercancel", up);
        el.classList.remove("is-dragging");
      }
      bar.addEventListener("pointermove", move);
      bar.addEventListener("pointerup", up);
      bar.addEventListener("pointercancel", up);
    });

    // Redimensionnement par le coin inférieur droit.
    var rz = el.querySelector(".win__resize");
    if (rz) rz.addEventListener("pointerdown", function (e) {
      if (w.maximized || isMobile()) return;
      e.preventDefault();
      e.stopPropagation();
      focus(w);
      var sx = e.clientX, sy = e.clientY, ow = el.offsetWidth, oh = el.offsetHeight;
      rz.setPointerCapture(e.pointerId);
      function move(ev) {
        el.style.width = Math.max(300, ow + ev.clientX - sx) + "px";
        el.style.height = Math.max(180, oh + ev.clientY - sy) + "px";
      }
      function up() {
        rz.removeEventListener("pointermove", move);
        rz.removeEventListener("pointerup", up);
        rz.removeEventListener("pointercancel", up);
      }
      rz.addEventListener("pointermove", move);
      rz.addEventListener("pointerup", up);
      rz.addEventListener("pointercancel", up);
    });
  }

  function focus(w) {
    if (!w || w.minimized) return;
    w.el.style.zIndex = ++zTop;
    wins.forEach(function (o) {
      o.el.classList.toggle("is-active", o === w);
      if (o.task) o.task.setAttribute("aria-pressed", o === w ? "true" : "false");
    });
    active = w;
  }

  function topMost() {
    var best = null;
    wins.forEach(function (o) {
      if (!o.minimized && (!best || +o.el.style.zIndex > +best.el.style.zIndex)) best = o;
    });
    return best;
  }

  function minimize(w) {
    w.minimized = true;
    w.el.hidden = true;
    w.el.classList.remove("is-active");
    if (w.task) { w.task.setAttribute("aria-pressed", "false"); w.task.classList.add("is-min"); }
    if (active === w) { active = null; focus(topMost()); }
  }

  function restore(w) {
    if (!w.minimized) return;
    w.minimized = false;
    w.el.hidden = false;
    if (w.task) w.task.classList.remove("is-min");
  }

  function toggleMax(w) {
    w.maximized = !w.maximized;
    w.el.classList.toggle("is-max", w.maximized);
    var b = w.el.querySelector('[data-act="max"]');
    if (b) b.setAttribute("aria-label", t(w.maximized ? "win.restore" : "win.max"));
  }

  function close(w) {
    if (!w || !wins.has(w.key)) return;
    wins.delete(w.key);
    w.el.remove();
    if (w.task) w.task.remove();
    if (active === w) {
      active = null;
      var next = topMost();
      focus(next);
      if (next) next.el.focus({ preventScroll: true });
    }
  }

  function closeAll() { Array.from(wins.values()).forEach(close); }

  /* ================= Barre des tâches ================= */
  function addTask(w) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "task";
    b.setAttribute("aria-pressed", "false");
    b.addEventListener("click", function () {
      if (w.minimized) { restore(w); focus(w); w.el.focus({ preventScroll: true }); }
      else if (active === w) minimize(w);
      else focus(w);
    });
    taskList.appendChild(b);
    w.task = b;
  }

  /* Actions déclarées dans le contenu des fenêtres : data-open, data-arg, data-close. */
  layer.addEventListener("click", function (e) {
    var el = e.target.closest("[data-open], [data-close]");
    if (!el || !layer.contains(el)) return;
    var winEl = el.closest(".win");
    var own = null;
    wins.forEach(function (o) { if (o.el === winEl) own = o; });
    if (el.hasAttribute("data-open")) openApp(el.getAttribute("data-open"), el.getAttribute("data-arg") || undefined);
    if (el.hasAttribute("data-close") && own) close(own);
  });

  /* ================= Icônes du bureau ================= */
  var pointer = "mouse";
  function renderIcons() {
    var selected = iconsNav.querySelector(".icon.is-selected");
    var selApp = selected ? selected.dataset.app : null;
    iconsNav.innerHTML = window.DESKTOP_ICONS.map(function (ic) {
      return (
        '<button type="button" class="icon' + (ic.app === selApp ? " is-selected" : "") + '" data-app="' + esc(ic.app) + '">' +
        '<span class="icon__img">' + (I[ic.icon] || I.folder) + "</span>" +
        '<span class="icon__label">' + esc(t(ic.label)) + "</span></button>"
      );
    }).join("");
  }
  iconsNav.addEventListener("pointerdown", function (e) { pointer = e.pointerType; });
  iconsNav.addEventListener("click", function (e) {
    var btn = e.target.closest(".icon");
    if (!btn) return;
    selectIcon(btn);
    // Clavier (detail 0) ou toucher : ouverture directe. Souris : double-clic.
    if (e.detail === 0 || pointer === "touch" || pointer === "pen") openApp(btn.dataset.app);
  });
  iconsNav.addEventListener("dblclick", function (e) {
    var btn = e.target.closest(".icon");
    if (btn) openApp(btn.dataset.app);
  });
  function selectIcon(btn) {
    iconsNav.querySelectorAll(".icon").forEach(function (b) { b.classList.toggle("is-selected", b === btn); });
  }
  desktop.addEventListener("pointerdown", function (e) {
    if (e.target === desktop || e.target === layer || e.target === iconsNav) selectIcon(null);
  });

  /* ================= Menus ================= */
  var openMenu = null;

  function fillAppLists() {
    document.querySelectorAll('[data-fill="apps"]').forEach(function (box) {
      box.innerHTML = window.DESKTOP_ICONS.filter(function (ic) { return ic.app !== "corbeille"; }).map(function (ic) {
        return '<button type="button" role="menuitem" data-cmd="open:' + esc(ic.app) + '">' + esc(t(ic.label)) + "</button>";
      }).join("");
    });
  }

  function setMenu(btn) {
    if (openMenu) {
      openMenu.btn.setAttribute("aria-expanded", "false");
      openMenu.panel.hidden = true;
    }
    openMenu = null;
    if (!btn) return;
    var panel = document.querySelector('[data-menu-panel="' + btn.dataset.menu + '"]');
    btn.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    openMenu = { btn: btn, panel: panel };
  }

  document.querySelectorAll("[data-menu]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var same = openMenu && openMenu.btn === btn;
      setMenu(same ? null : btn);
      if (!same && e.detail === 0) {
        var first = openMenu.panel.querySelector("[role=menuitem]");
        if (first) first.focus();
      }
    });
    btn.addEventListener("pointerenter", function () {
      if (openMenu && openMenu.btn !== btn && !openMenu.btn.closest(".taskbar") && !btn.closest(".taskbar")) setMenu(btn);
    });
  });

  // data-cmd fonctionne partout : menus et boutons dans les fenêtres.
  document.addEventListener("click", function (e) {
    var item = e.target.closest("[data-cmd]");
    if (item) { setMenu(null); runCmd(item.dataset.cmd); return; }
    if (openMenu && !openMenu.panel.contains(e.target)) setMenu(null);
  });

  function runCmd(cmd) {
    if (cmd.indexOf("open:") === 0) { openApp(cmd.slice(5)); return; }
    switch (cmd) {
      case "close-active": if (active) close(active); break;
      case "close-all": closeAll(); break;
      case "wallpaper": cycleWallpaper(); break;
      case "lang": I18N.toggle(); break;
      case "simple": window.location.href = "simple.html"; break;
      case "reboot": closeAll(); boot(startup, true); break;
      case "source": window.open(D().profil.github, "_blank", "noopener"); break;
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (openMenu) { var b = openMenu.btn; setMenu(null); b.focus(); return; }
    var el = e.target;
    if ((el.tagName === "INPUT" || el.tagName === "TEXTAREA") && el.value) return;
    if (active) close(active);
  });

  /* ================= Langue ================= */
  function applyStatic() {
    I18N.apply(document, "meta.title");
    renderIcons();
    fillAppLists();
    tick();
  }
  document.addEventListener("langchange", refreshAll);

  /* ================= Fond d'écran ================= */
  var WALLPAPERS = ["#2F6F73", "#2B3F66", "#5B3A5E", "#56633A", "#3A3A3A"];
  function applyWallpaper(i) {
    document.documentElement.style.setProperty("--desk", WALLPAPERS[i % WALLPAPERS.length]);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", WALLPAPERS[i % WALLPAPERS.length]);
  }
  var wp = parseInt(safeGet("localStorage", "chakibos-wallpaper") || "0", 10) || 0;
  function cycleWallpaper() {
    wp = (wp + 1) % WALLPAPERS.length;
    applyWallpaper(wp);
    safeSet("localStorage", "chakibos-wallpaper", String(wp));
  }

  /* ================= Horloge ================= */
  var clock = document.getElementById("clock");
  function tick() {
    var d = new Date();
    var loc = I18N.locale();
    clock.querySelector(".mb__day").textContent = new Intl.DateTimeFormat(loc, { weekday: "short", day: "numeric", month: "short" }).format(d);
    clock.querySelector(".mb__time").textContent = new Intl.DateTimeFormat(loc, { hour: "2-digit", minute: "2-digit" }).format(d);
    clock.setAttribute("datetime", d.toISOString());
  }

  /* ================= GitHub ================= */
  var sync = window.GITHUB ? window.GITHUB.sync() : Promise.resolve({ source: "none", count: 0 });
  function withTimeout(p, ms) {
    return Promise.race([p, new Promise(function (res) { setTimeout(function () { res(null); }, ms); })]);
  }
  // Quand GitHub répond, les fenêtres se mettent à jour ; la fiche d'un dépôt retiré se ferme.
  document.addEventListener("githubsync", function () {
    if (!started) return;
    wins.forEach(function (w) {
      if (w.appId === "projet" && !D().projets.some(function (p) { return p.id === w.arg; })) close(w);
    });
    refreshAll();
  });

  /* ================= Démarrage ================= */
  var started = false;

  function boot(done, force) {
    var ov = document.getElementById("boot");
    var log = ov.querySelector(".boot__log");
    var p = D().profil;
    function line(text) { var row = document.createElement("div"); row.textContent = text; log.appendChild(row); }
    if (!force && (safeGet("sessionStorage", "booted") || reducedMotion)) {
      ov.hidden = true;
      withTimeout(sync, 2500).then(done);
      return;
    }
    log.textContent = "";
    ov.hidden = false;
    var finished = false;
    var timers = [];
    function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
    function finish() {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      ov.removeEventListener("click", finish);
      document.removeEventListener("keydown", finish);
      safeSet("sessionStorage", "booted", "1");
      ov.classList.add("is-done");
      setTimeout(function () { ov.hidden = true; ov.classList.remove("is-done"); }, 280);
      done();
    }
    later(function () { line(t("boot.l1", { year: new Date().getFullYear(), name: p.nom })); }, 150);
    later(function () { line(t("boot.l2", { value: I18N.L(p.specs[0].valeur) })); }, 390);
    later(function () {
      withTimeout(sync, 3500).then(function (s) {
        if (finished) return;
        var st = window.GITHUB ? window.GITHUB.state : null;
        line(st && st.source !== "none" ? t("boot.l3", { n: st.count }) : t("boot.l3off"));
        line(t("boot.l4", { n: D().competences.filter(function (c) { return c.items.length; }).length }));
        later(function () { line(t("boot.l5")); later(finish, 380); }, 240);
      });
    }, 630);
    ov.addEventListener("click", finish);
    document.addEventListener("keydown", finish);
  }

  function startup() {
    started = true;
    refreshAll();
    openApp("about");
    if (!isMobile()) {
      openApp("projets");
      setTimeout(function () { if (!wins.has("stage")) openApp("stage"); }, 900);
    }
  }

  /* Garde les fenêtres visibles quand la fenêtre du navigateur rapetisse. */
  window.addEventListener("resize", function () {
    if (isMobile()) return;
    var r = desktop.getBoundingClientRect();
    wins.forEach(function (w) {
      var el = w.el;
      if (el.offsetLeft > r.width - 80) el.style.left = Math.max(8, r.width - el.offsetWidth - 8) + "px";
      if (el.offsetTop > r.height - 32) el.style.top = Math.max(8, r.height - el.offsetHeight - 8) + "px";
    });
  });

  /* ================= Initialisation ================= */
  applyWallpaper(wp);
  applyStatic();
  setInterval(tick, 30000);
  boot(startup);

  window.ChakibOS = api;
})();
