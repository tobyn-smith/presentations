/* Saved session from Edit. Stays on this computer. Also honours a room=
   in the link, and a session.json sitting next to these files.
   Join / QR follow this website so a fork is not stuck on the demo URL. */
(function (global) {
  var KEY = "deck-content";
  var DEMO_JOIN = "https://tobynsmith.me/presentations/";
  var DEMO_ROOM = "tobyn-smith-presentations";
  var ch = null;

  function queryRoom() {
    try {
      var q = new URLSearchParams(location.search).get("room");
      if (!q) return "";
      return String(q).replace(/[^a-zA-Z0-9_-]/g, "");
    } catch (e) {
      return "";
    }
  }

  function isDemoHost() {
    var host = String(location.hostname || "");
    return host === "tobynsmith.me" || host === "www.tobynsmith.me" || host === "tobyn-smith.github.io";
  }

  function isDemoJoin(url) {
    try {
      var u = new URL(String(url || "").trim(), location.href);
      var host = u.hostname;
      if (host !== "tobynsmith.me" && host !== "www.tobynsmith.me") return false;
      return /\/presentations\/?$/.test(u.pathname);
    } catch (e) {
      return false;
    }
  }

  function siteJoin() {
    if (location.protocol === "file:") return "";
    var path = String(location.pathname || "/");
    path = path.replace(/\/index\.html$/i, "/");
    path = path.replace(/\/[^/]+\.html$/i, "/");
    path = path.replace(/\/(adminpresentation|slideshow|script|edit|start|desk)\/?$/i, "/");
    if (!path) path = "/";
    if (path.slice(-1) !== "/") path += "/";
    if (location.hostname === "tobyn-smith.github.io" && /\/presentations\/?$/.test(path)) {
      return DEMO_JOIN;
    }
    return location.origin + path;
  }

  function autoRoom() {
    if (isDemoHost()) return DEMO_ROOM;
    var slug = String(location.hostname || "session")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48);
    return slug || "session";
  }

  function stripRoomParam(url) {
    return String(url || "")
      .replace(/([?&])room=[^&]*/g, "$1")
      .replace(/\?&/, "?")
      .replace(/&&+/g, "&")
      .replace(/[?&]$/, "");
  }

  function withRoom(url, room) {
    var base = stripRoomParam(url).trim();
    var word = String(room || "").replace(/[^a-zA-Z0-9_-]/g, "");
    if (!base) return "";
    if (!word || word === autoRoom()) return base;
    return base + (base.indexOf("?") >= 0 ? "&" : "?") + "room=" + encodeURIComponent(word);
  }

  function ping() {
    try { document.dispatchEvent(new Event("deck-content")); } catch (e) {}
  }

  function apply(data) {
    if (!data) {
      finishResolve();
      return;
    }
    if (data.deck && global.DECK) {
      ["title", "room", "session", "presenterKey", "joinUrl", "articleUrl", "articleLabel", "articleBar"].forEach(function (k) {
        if (data.deck[k] != null) global.DECK[k] = data.deck[k];
      });
    }
    if (data.slides && data.slides.length) global.SLIDES = data.slides;
    if (data.script && data.script.length) global.SCRIPT = data.script;
    if (data.names && global.Roster && Roster.setNames) Roster.setNames(data.names);
    finishResolve();
    ping();
  }

  function resolveRoom() {
    var q = queryRoom();
    if (q) return q;
    var cfg = global.DECK && String(DECK.room || "").replace(/[^a-zA-Z0-9_-]/g, "");
    if (cfg && !(cfg === DEMO_ROOM && !isDemoHost())) return cfg;
    return autoRoom();
  }

  function resolveJoin() {
    var raw = global.DECK ? String(DECK.joinUrl || "").trim() : "";
    if (raw && !isDemoJoin(raw)) return stripRoomParam(raw);
    return siteJoin();
  }

  function finishResolve() {
    if (!global.DECK) return;
    global.DECK.room = resolveRoom();
    var join = resolveJoin();
    if (isDemoJoin(join) && !isDemoHost()) join = siteJoin();
    global.DECK.joinUrl = withRoom(join, global.DECK.room);
  }

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      return data && typeof data === "object" ? data : null;
    } catch (e) {
      return null;
    }
  }

  function joinHref() {
    finishResolve();
    return (global.DECK && DECK.joinUrl) || siteJoin();
  }

  function openChannel() {
    var room = String((global.DECK && DECK.room) || "session").replace(/[^a-zA-Z0-9_-]/g, "");
    try {
      ch = new BroadcastChannel("deck-" + room);
      ch.onmessage = function (ev) {
        var msg = ev.data;
        if (!msg || msg.t !== "pack" || !msg.data) return;
        if (msg.session && global.DECK && String(msg.session) !== String(DECK.session || "1")) return;
        apply(msg.data);
      };
    } catch (e) {
      ch = null;
    }
  }

  function publicPack(next) {
    return {
      deck: {
        title: next.deck && next.deck.title,
        joinUrl: next.deck && next.deck.joinUrl,
        room: next.deck && next.deck.room,
        session: next.deck && next.deck.session
      },
      names: next.names,
      slides: next.slides,
      script: next.script
    };
  }

  var data = read();
  apply(data);
  openChannel();

  if (!data) {
    fetch("session.json", { cache: "no-store" }).then(function (r) {
      if (!r.ok) return null;
      return r.json();
    }).then(function (file) {
      if (!file || read()) return;
      apply(file);
    }).catch(function () {});
  }

  global.DeckContent = {
    key: KEY,
    demoJoin: DEMO_JOIN,
    read: read,
    apply: apply,
    siteJoin: siteJoin,
    siteRoom: autoRoom,
    joinHref: joinHref,
    withRoom: withRoom,
    isDemoJoin: isDemoJoin,
    save: function (next) {
      localStorage.setItem(KEY, JSON.stringify(next));
      if (next.names) {
        try { localStorage.setItem("deck-roster", JSON.stringify(next.names)); } catch (e) {}
      }
      apply(next);
      try {
        if (ch) {
          ch.postMessage({
            t: "pack",
            session: String((next.deck && next.deck.session) || (global.DECK && DECK.session) || "1"),
            data: publicPack(next)
          });
        }
      } catch (e) {}
    },
    clear: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      try { localStorage.removeItem("deck-roster"); } catch (e) {}
    }
  };
})(window);
