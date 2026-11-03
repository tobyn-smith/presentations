/* Presenter lock. The classroom code is in config.js (casual gate, not a login).
   First-visit set-key still runs if that field is empty. */
(function (global) {
  var STORE = "deck-key";

  function configured() {
    var fromFile = (global.DECK && DECK.presenterKey) || "";
    if (fromFile) return fromFile;
    try {
      var saved = localStorage.getItem(STORE);
      if (saved) return saved;
    } catch (e) {}
    return "";
  }

  function bind(opts) {
    opts = opts || {};
    var gate = document.getElementById(opts.gateId || "gate");
    var app = document.getElementById(opts.appId || "app");
    var missing = document.getElementById("gate-missing");
    var setWrap = document.getElementById("gate-set");
    var form = document.getElementById("gate-form");
    var setForm = document.getElementById("gate-set-form");

    function open() {
      if (gate) gate.hidden = true;
      if (app) app.hidden = false;
      if (opts.onOpen) opts.onOpen();
    }

    function showGate() {
      if (app) app.hidden = true;
      if (gate) gate.hidden = false;
      var has = !!configured();
      if (missing) missing.hidden = has;
      if (setWrap) setWrap.hidden = has;
      if (form) form.hidden = !has;
    }

    var want = configured();
    if (want) {
      try {
        if (sessionStorage.getItem(STORE) === want) open();
        else showGate();
      } catch (e) {
        showGate();
      }
    } else {
      showGate();
    }

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = document.getElementById("key");
        var v = input ? input.value : "";
        var err = document.getElementById("gate-err");
        if (v && v === configured()) {
          try { sessionStorage.setItem(STORE, v); } catch (err2) {}
          open();
        } else if (err) {
          err.hidden = false;
        }
      });
    }

    if (setForm) {
      setForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var a = document.getElementById("key-new");
        var b = document.getElementById("key-again");
        var setErr = document.getElementById("gate-set-err");
        var first = a ? a.value : "";
        var again = b ? b.value : "";
        if (!first || first !== again) {
          if (setErr) setErr.hidden = false;
          return;
        }
        if (setErr) setErr.hidden = true;
        try {
          localStorage.setItem(STORE, first);
          sessionStorage.setItem(STORE, first);
        } catch (err) {}
        if (global.DECK) global.DECK.presenterKey = first;
        open();
      });
    }
  }

  global.DeckGate = { store: STORE, configured: configured, bind: bind };
})(typeof window !== "undefined" ? window : global);
