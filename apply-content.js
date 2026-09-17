/* Saved session from Edit. Stays on this computer. Also honours a room=
   in the link, and a session.json sitting next to these files. */
(function (global) {
  var KEY = "deck-content";
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

  function ping() {
    try { document.dispatchEvent(new Event("deck-content")); } catch (e) {}
  }

  function apply(data) {
    if (!data) {
      var only = queryRoom();
      if (only && global.DECK) global.DECK.room = only;
      return;
    }
    if (data.deck && global.DECK) {
      ["title", "room", "session", "presenterKey", "joinUrl", "articleUrl", "articleLabel", "articleBar"].forEach(function (k) {
        if (data.deck[k] != null) global.DECK[k] = data.deck[k];
      });
    }
    var qRoom = queryRoom();
    if (qRoom && global.DECK) global.DECK.room = qRoom;
    if (data.slides && data.slides.length) global.SLIDES = data.slides;
    if (data.script && data.script.length) global.SCRIPT = data.script;
    if (data.names && global.Roster && Roster.setNames) Roster.setNames(data.names);
    ping();
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
    read: read,
    apply: apply,
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
