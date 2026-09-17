/* BroadcastChannel, ntfy, optional Firebase REST. */
(function (global) {
  var cfg = global.DECK || {};
  function queryRoom() {
    try {
      return String(new URLSearchParams(location.search).get("room") || "").replace(/[^a-zA-Z0-9_-]/g, "");
    } catch (e) {
      return "";
    }
  }
  var room = String(queryRoom() || cfg.room || "session").replace(/[^a-zA-Z0-9_-]/g, "");
  var session = String(cfg.session || "1");
  var slide = 0;
  var responses = {};
  var slideFns = [];
  var respFns = [];
  var statusFns = [];
  var presentFns = [];
  var seatFns = [];
  var handFns = [];
  var seats = {};
  var hands = {};
  var lastSeatSig = "";
  var lastHere = 0;
  var lastGoneAt = 0;
  var wantLive = false;
  var kicks = {};
  var kickFns = [];
  var packFns = [];
  var lastPackSig = "";
  var packBuf = {};
  var presenting = false;
  var heartbeat = null;
  var leaveBound = null;
  var sitBeat = null;
  var sitLeave = null;
  var me = null;
  var HERE_MS = 20000;
  var SEAT_MS = 22000;
  var status = { live: false, mode: "local", detail: "This computer only", phones: false };

  try {
    var saved = localStorage.getItem("deck-roster");
    if (saved && global.Roster && Roster.setNames) {
      var parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) Roster.setNames(parsed);
    }
  } catch (e) {}

  var localOnly = /[?&]local=1\b/.test(location.search);
  var forceFirebase = /[?&]firebase=1\b/.test(location.search);
  var ntfySource = null;
  var usingFirebase = false;
  var fbReachable = false;
  var lastError = "";
  var bc = null;
  try { bc = new BroadcastChannel("deck-" + room); } catch (e) { bc = null; }

  function sid() {
    try {
      var k = "deck-sid";
      var v = sessionStorage.getItem(k);
      if (v) return v;
      v = (crypto.randomUUID && crypto.randomUUID() || (Math.random().toString(36).slice(2) + Date.now().toString(36))).replace(/-/g, "").slice(0, 12);
      sessionStorage.setItem(k, v);
      return v;
    } catch (e) {
      return "s" + Math.random().toString(36).slice(2, 10);
    }
  }

  function emitStatus() { statusFns.forEach(function (fn) { fn(status); }); }
  function emitSlide() { slideFns.forEach(function (fn) { fn(slide); }); }
  function setPresenting(on) {
    on = !!on;
    if (on === presenting) return;
    presenting = on;
    presentFns.forEach(function (fn) { fn(presenting); });
  }
  function noteHere(at) {
    var t = +at || 0;
    if (!t || t < lastGoneAt) return;
    if (Date.now() - t > HERE_MS) return;
    lastHere = Math.max(lastHere, t);
    setPresenting(true);
  }
  function noteGone(at) {
    lastGoneAt = Math.max(lastGoneAt, +at || Date.now());
    lastHere = 0;
    setPresenting(false);
  }
  setInterval(function () {
    if (wantLive) {
      setPresenting(true);
      return;
    }
    setPresenting(!!(lastHere && lastHere >= lastGoneAt && Date.now() - lastHere < HERE_MS));
  }, 1000);
  function emitResp(id) {
    var list = Object.keys(responses[id] || {}).map(function (k) { return responses[id][k]; });
    list.sort(function (a, b) { return (a.at || 0) - (b.at || 0); });
    respFns.forEach(function (fn) { fn(id, list); });
  }
  function pruneSeats() {
    var now = Date.now();
    Object.keys(seats).forEach(function (k) {
      if (now - (seats[k].at || 0) > SEAT_MS) delete seats[k];
    });
  }
  function seatList() {
    pruneSeats();
    return Object.keys(seats).map(function (k) { return seats[k]; })
      .sort(function (a, b) { return String(a.name || "").localeCompare(String(b.name || "")); });
  }
  function emitSeats() {
    var list = seatList();
    var sig = list.map(function (r) {
      return r.sid + ":" + r.name + ":" + ((r.face && r.face.id) || "");
    }).join("|");
    if (sig === lastSeatSig) return;
    lastSeatSig = sig;
    seatFns.forEach(function (fn) { fn(list); });
  }
  function handList() {
    var now = Date.now();
    return Object.keys(hands).map(function (k) { return hands[k]; })
      .filter(function (h) { return h.up && String(h.slide) === String(slide) && now - (h.at || 0) < SEAT_MS; })
      .sort(function (a, b) { return (a.at || 0) - (b.at || 0); });
  }
  function emitHands() {
    var list = handList();
    handFns.forEach(function (fn) { fn(list); });
  }
  function dropHands() {
    hands = {};
    emitHands();
  }
  function loadMe() {
    if (me) return me;
    try {
      var raw = sessionStorage.getItem("deck-me");
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.name) return null;
      if (global.Roster && !Roster.knownName(parsed.name)) return null;
      me = { name: parsed.name, face: (global.Roster && Roster.sanitizeFace(parsed.face)) || parsed.face || {} };
      return me;
    } catch (e) {
      return null;
    }
  }
  function saveMe(row) {
    me = row;
    try { sessionStorage.setItem("deck-me", JSON.stringify(row)); } catch (e) {}
  }
  setInterval(emitSeats, 2500);

  function apply(msg, via) {
    if (!msg || !msg.t) return;
    if (msg.session && msg.session !== session) return;
    if (msg.t === "slide") {
      var n = +msg.n;
      if (n !== n) return;
      n = Math.max(0, Math.min((global.SLIDES || []).length - 1, n));
      if (n === slide && via !== "init") return;
      slide = n;
      dropHands();
      emitSlide();
      return;
    }
    if (msg.t === "resp" && msg.slide != null && msg.sid) {
      var id = String(msg.slide);
      responses[id] = responses[id] || {};
      responses[id][msg.sid] = {
        sid: msg.sid,
        slide: id,
        text: msg.text ? String(msg.text).slice(0, 800) : "",
        choice: msg.choice != null ? String(msg.choice).slice(0, 80) : "",
        at: msg.at || Date.now(),
        bin: msg.bin || "",
        name: msg.name ? String(msg.name).slice(0, 80) : "",
        face: (global.Roster && Roster.sanitizeFace(msg.face)) || {}
      };
      emitResp(id);
      return;
    }
    if (msg.t === "reset" && msg.slide != null) {
      var rid = String(msg.slide);
      try { sessionStorage.removeItem("deck-done-" + rid); } catch (e) {}
      responses[rid] = {};
      emitResp(rid);
      return;
    }
    if (msg.t === "wipe") {
      try {
        Object.keys(sessionStorage).forEach(function (k) {
          if (k.indexOf("deck-done-") === 0) sessionStorage.removeItem(k);
        });
      } catch (e) {}
      responses = {};
      (global.SLIDES || []).forEach(function (s, i) { emitResp(String(i)); });
      return;
    }
    if (msg.t === "pack" && msg.data) {
      takePack(msg.data);
      return;
    }
    if (msg.t === "packpart" && msg.id != null) {
      var buf = packBuf[msg.id] || (packBuf[msg.id] = { n: +msg.n || 0, parts: [] });
      buf.parts[+msg.i] = String(msg.p || "");
      var got = 0;
      for (var pi = 0; pi < buf.parts.length; pi++) if (buf.parts[pi] != null) got++;
      if (buf.n && got >= buf.n) {
        try { takePack(JSON.parse(buf.parts.join(""))); } catch (e) {}
        delete packBuf[msg.id];
      }
      return;
    }
    if (msg.t === "probe") return;
    if (msg.t === "here") { noteHere(msg.at); return; }
    if (msg.t === "gone") { noteGone(msg.at); return; }
    if (msg.t === "kick" && msg.sid) { takeKick(msg.sid, msg.name); return; }
    if (msg.t === "unkick") { kicks = {}; emitSeats(); return; }
    if (msg.t === "seat" && msg.sid && msg.name) {
      if (kicks[msg.sid]) return;
      var nm = String(msg.name).slice(0, 80);
      if (global.Roster && !Roster.knownName(nm)) return;
      var taken = Object.keys(seats).some(function (k) {
        return k !== msg.sid && seats[k].name === nm && Date.now() - (seats[k].at || 0) < SEAT_MS;
      });
      if (taken) return;
      var face = (global.Roster && Roster.sanitizeFace(msg.face)) || {};
      seats[msg.sid] = { sid: msg.sid, name: nm, face: face, at: msg.at || Date.now() };
      emitSeats();
      return;
    }
    if (msg.t === "leave" && msg.sid) {
      delete seats[msg.sid];
      delete hands[msg.sid];
      lastSeatSig = "";
      emitSeats();
      emitHands();
      return;
    }
    if (msg.t === "hand" && msg.sid) {
      if (msg.up) {
        var who = msg.name ? String(msg.name).slice(0, 80) : "";
        if (who && global.Roster && !Roster.knownName(who)) return;
        hands[msg.sid] = {
          sid: msg.sid,
          name: who,
          face: (global.Roster && Roster.sanitizeFace(msg.face)) || {},
          slide: msg.slide != null ? String(msg.slide) : String(slide),
          up: true,
          at: msg.at || Date.now()
        };
      } else {
        delete hands[msg.sid];
      }
      emitHands();
    }
  }

  if (bc) {
    bc.onmessage = function (ev) { apply(ev.data, "bc"); };
  }

  function shout(msg) {
    msg.session = session;
    apply(msg, "local");
    try { if (bc) bc.postMessage(msg); } catch (e) {}
    publishLive(msg);
  }

  var publishNtfy = function () {};
  var publishFb = function () {};
  function publishLive(msg) {
    publishNtfy(msg);
    publishFb(msg);
  }

  function firebaseConfigured() {
    var fb = cfg.firebase || {};
    return !!(fb.databaseURL);
  }

  function fbUrl(sub) {
    var base = String((cfg.firebase || {}).databaseURL || "").replace(/\/$/, "");
    if (!base) return "";
    return base + "/deck/" + room + (sub ? "/" + sub : "") + ".json";
  }

  function fbFetch(url, opt) {
    opt = opt || {};
    opt.cache = "no-store";
    opt.headers = opt.headers || {};
    opt.headers["Cache-Control"] = "no-cache";
    return fetch(url, opt);
  }

  function fbWrite(sub, value) {
    var url = fbUrl(sub);
    if (!url) return Promise.resolve(false);
    var opt = { method: value === null ? "DELETE" : "PUT" };
    if (value !== null) {
      opt.headers = { "Content-Type": "application/json" };
      opt.body = JSON.stringify(value);
    }
    return fbFetch(url, opt).then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      markFirebaseLive();
      return true;
    }).catch(function (err) {
      lastError = "Firebase write failed" + (sub ? " (" + sub + ")" : "");
      return false;
    });
  }

  function takeHere(v, force) {
    if (v == null || v === false) {
      if (!force && lastHere && lastHere > lastGoneAt && Date.now() - lastHere < 2500) return;
      lastHere = 0;
      setPresenting(false);
      return;
    }
    noteHere(typeof v === "number" ? v : (v && v.at));
  }

  function takeKick(kickedSid, name) {
    if (!kickedSid) return;
    kicks[kickedSid] = { sid: kickedSid, name: name || "", at: Date.now() };
    delete seats[kickedSid];
    delete hands[kickedSid];
    lastSeatSig = "";
    emitSeats();
    emitHands();
    if (kickedSid !== sid()) return;
    if (sitBeat) { clearInterval(sitBeat); sitBeat = null; }
    me = null;
    try {
      sessionStorage.removeItem("deck-me");
      sessionStorage.removeItem("deck-sid");
    } catch (e) {}
    kickFns.forEach(function (fn) { fn({ sid: kickedSid, name: name || "" }); });
  }

  function takeKicks(val) {
    val = val || {};
    Object.keys(val).forEach(function (k) {
      if (!kicks[k]) takeKick(k, val[k] && val[k].name);
    });
  }

  function takeSlide(n) {
    if (n != null) apply({ t: "slide", n: n }, "fb");
  }

  function takePack(data) {
    if (!data || typeof data !== "object") return;
    var sig = JSON.stringify({
      slides: data.slides || [],
      names: data.names || [],
      title: data.deck && data.deck.title
    });
    if (sig === lastPackSig) return;
    lastPackSig = sig;
    var safe = {
      deck: data.deck ? {
        title: data.deck.title,
        joinUrl: data.deck.joinUrl,
        room: data.deck.room,
        session: data.deck.session
      } : null,
      names: data.names,
      slides: data.slides,
      script: data.script
    };
    if (global.DeckContent && DeckContent.apply) DeckContent.apply(safe);
    else {
      if (safe.deck && global.DECK) {
        if (safe.deck.title != null) global.DECK.title = safe.deck.title;
        if (safe.deck.joinUrl != null) global.DECK.joinUrl = safe.deck.joinUrl;
      }
      if (safe.slides && safe.slides.length) global.SLIDES = safe.slides;
      if (safe.names && global.Roster && Roster.setNames) Roster.setNames(safe.names);
    }
    packFns.forEach(function (fn) { fn(); });
  }

  function packData() {
    return {
      deck: {
        title: cfg.title || "",
        joinUrl: cfg.joinUrl || "",
        room: room,
        session: session
      },
      names: (global.Roster && Roster.names) ? Roster.names.slice() : [],
      slides: global.SLIDES || []
    };
  }

  function sharePack() {
    var data = packData();
    lastPackSig = JSON.stringify({
      slides: data.slides || [],
      names: data.names || [],
      title: data.deck && data.deck.title
    });
    var msg = { t: "pack", session: session, data: data };
    try { if (bc) bc.postMessage(msg); } catch (e) {}
    if (firebaseConfigured()) fbWrite("pack", data);
    var raw = JSON.stringify(data);
    var CHUNK = 2400;
    if (raw.length <= CHUNK) {
      publishNtfy({ t: "pack", session: session, data: data });
      return;
    }
    var id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    var n = Math.ceil(raw.length / CHUNK);
    var i;
    for (i = 0; i < n; i++) {
      publishNtfy({
        t: "packpart",
        session: session,
        id: id,
        i: i,
        n: n,
        p: raw.slice(i * CHUNK, i * CHUNK + CHUNK)
      });
    }
  }

  function takeRoster(val) {
    if (!global.Roster || !Roster.setNames) return;
    var list = [];
    if (Array.isArray(val)) list = val;
    else if (val && Array.isArray(val.names)) list = val.names;
    else return;
    list = list.map(function (n) { return String(n || "").replace(/\s+/g, " ").trim(); }).filter(Boolean);
    if (!list.length) return;
    Roster.setNames(list);
    emitSeats();
  }

  function takeSeats(val) {
    val = val || {};
    var seen = {};
    Object.keys(val).forEach(function (k) {
      var row = val[k] || {};
      if (!row.name) return;
      if (kicks[k]) {
        fbWrite("seats/" + k, null);
        return;
      }
      if (global.Roster && !Roster.knownName(row.name)) return;
      seen[k] = true;
      seats[k] = {
        sid: k,
        name: row.name,
        face: (global.Roster && Roster.sanitizeFace(row.face)) || row.face || {},
        at: row.at || Date.now()
      };
    });
    Object.keys(seats).forEach(function (k) {
      if (kicks[k]) {
        delete seats[k];
        return;
      }
      if (!seen[k] && Date.now() - (seats[k].at || 0) > 4000) delete seats[k];
    });
    emitSeats();
  }

  function takeHands(val) {
    val = val || {};
    hands = {};
    Object.keys(val).forEach(function (k) {
      var row = val[k] || {};
      if (!row.up) return;
      hands[k] = {
        sid: k,
        name: row.name || "",
        face: (global.Roster && Roster.sanitizeFace(row.face)) || row.face || {},
        slide: row.slide != null ? String(row.slide) : String(slide),
        up: true,
        at: row.at || Date.now()
      };
    });
    emitHands();
  }

  function takeResponses(val) {
    val = val || {};
    responses = {};
    Object.keys(val).forEach(function (slideId) {
      responses[slideId] = {};
      Object.keys(val[slideId] || {}).forEach(function (k) {
        var row = val[slideId][k] || {};
        responses[slideId][k] = {
          sid: k,
          slide: slideId,
          text: row.text || "",
          choice: row.choice || "",
          at: row.at || 0,
          bin: row.bin || "",
          name: row.name || "",
          face: row.face || {}
        };
      });
      emitResp(slideId);
    });
    (global.SLIDES || []).forEach(function (s, i) {
      if (!val[i]) emitResp(String(i));
    });
  }

  function takeRoom(data) {
    if (!data || typeof data !== "object") {
      takeHere(null);
      return;
    }
    takeKicks(data.kicks);
    var hereAt = data.here == null ? 0 : (typeof data.here === "number" ? data.here : +data.here.at || 0);
    var goneAt = +data.goneAt || 0;
    if (goneAt && goneAt >= hereAt) noteGone(goneAt);
    else takeHere(data.here);
    takeSlide(data.slide);
    takeSeats(data.seats);
    if (data.roster) takeRoster(data.roster);
    if (data.pack) takePack(data.pack);
    takeHands(data.hands);
    takeResponses(data.responses);
  }

  function markFirebaseLive() {
    fbReachable = true;
    status.live = true;
    status.phones = true;
    if (status.mode !== "ntfy") {
      status.mode = "firebase";
      status.detail = "";
    }
    emitStatus();
  }

  function enableFirebaseRest() {
    if (!firebaseConfigured() || !fbUrl("")) return false;
    publishFb = function (msg) {
      if (msg.t === "slide") fbWrite("slide", msg.n);
      else if (msg.t === "resp") fbWrite("responses/" + msg.slide + "/" + msg.sid, {
        text: msg.text || "", choice: msg.choice || "", at: msg.at || Date.now(), bin: msg.bin || "",
        name: msg.name || "", face: msg.face || {}
      });
      else if (msg.t === "reset") fbWrite("responses/" + msg.slide, null);
      else if (msg.t === "wipe") fbWrite("responses", null);
      else if (msg.t === "here") {
        fbWrite("goneAt", null);
        fbWrite("here", msg.at || Date.now());
      } else if (msg.t === "gone") {
        fbWrite("here", null);
        fbWrite("goneAt", msg.at || Date.now());
      } else if (msg.t === "kick") {
        fbWrite("seats/" + msg.sid, null);
        fbWrite("hands/" + msg.sid, null);
        fbWrite("kicks/" + msg.sid, { name: msg.name || "", at: msg.at || Date.now() });
      } else if (msg.t === "unkick") fbWrite("kicks", null);
      else if (msg.t === "seat") fbWrite("seats/" + msg.sid, {
        name: msg.name, face: msg.face || {}, at: msg.at || Date.now()
      });
      else if (msg.t === "leave") {
        fbWrite("seats/" + msg.sid, null);
        fbWrite("hands/" + msg.sid, null);
      } else if (msg.t === "hand") {
        if (msg.up) fbWrite("hands/" + msg.sid, {
          name: msg.name || "", face: msg.face || {}, slide: msg.slide, up: true, at: msg.at || Date.now()
        });
        else fbWrite("hands/" + msg.sid, null);
      }
    };
    if (presenting) publishFb({ t: "here", at: lastHere || Date.now(), session: session });
    if (me) publishFb({
      t: "seat", sid: sid(), name: me.name,
      face: { id: (me.face && me.face.id) || "" }, at: Date.now(), session: session
    });
    function pollHere() {
      fbFetch(fbUrl("here")).then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      }).then(function (data) {
        takeHere(data);
        markFirebaseLive();
      }).catch(function () {});
    }
    function poll() {
      fbFetch(fbUrl("")).then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      }).then(function (data) {
        takeRoom(data);
        markFirebaseLive();
      }).catch(function () {});
    }
    pollHere();
    poll();
    setInterval(pollHere, 500);
    setInterval(poll, 2000);
    try {
      var es = new EventSource(fbUrl("here"));
      function onHere(e) {
        try {
          var body = JSON.parse(e.data);
          var data = body && Object.prototype.hasOwnProperty.call(body, "data") ? body.data : body;
          takeHere(data, data == null);
          markFirebaseLive();
        } catch (err) {}
      }
      es.addEventListener("put", onHere);
      es.addEventListener("patch", onHere);
    } catch (e) {}
    usingFirebase = true;
    return true;
  }

  function useNtfy() {
    var base = String(cfg.ntfyBase || "https://ntfy.sh").replace(/\/$/, "");
    var topic = room;
    var url = base + "/" + topic;
    var sseOpen = false;
    publishNtfy = function (msg) {
      fetch(url, { method: "POST", body: JSON.stringify(msg) }).catch(function () {});
    };
    function ingest(raw) {
      try {
        var ev = typeof raw === "string" ? JSON.parse(raw) : raw;
        if (ev && ev.event && ev.event !== "message") return;
        var payload = ev && ev.message != null ? ev.message : raw;
        apply(typeof payload === "string" ? JSON.parse(payload) : payload, "ntfy");
      } catch (e) {}
    }
    fetch(url + "/json?poll=1&since=12h").then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      return r.text();
    }).then(function (text) {
      var lastLive = null;
      text.split("\n").forEach(function (line) {
        if (!line.trim()) return;
        try {
          var ev = JSON.parse(line);
          if (ev && ev.event && ev.event !== "message") return;
          var payload = ev && ev.message != null ? ev.message : line;
          var msg = typeof payload === "string" ? JSON.parse(payload) : payload;
          if (!msg || !msg.t) return;
          if (msg.t === "here" || msg.t === "gone") lastLive = msg;
          else apply(msg, "ntfy");
        } catch (e) {}
      });
      if (lastLive) apply(lastLive, "ntfy");
      status.live = true;
      status.mode = "ntfy";
      status.detail = "";
      emitStatus();
    }).catch(function () {});
    try {
      var es = new EventSource(url + "/sse");
      ntfySource = es;
      es.onmessage = function (e) { ingest(e.data); };
      es.onerror = function () {};
      es.onopen = function () {
        sseOpen = true;
        status.live = true;
        status.mode = "ntfy";
        status.detail = "";
        emitStatus();
      };
    } catch (e) {}
    return sseOpen;
  }

  function startLive() {
    if (localOnly) {
      status = { live: false, mode: "local", detail: "Rehearsal · this computer only", phones: false };
      emitStatus();
      return;
    }
    enableFirebaseRest();
    if (!forceFirebase) useNtfy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startLive);
  } else {
    startLive();
  }

  global.DeckSync = {
    sessionId: sid,
    getSlide: function () { return slide; },
    onSlide: function (fn) { slideFns.push(fn); fn(slide); },
    setSlide: function (n) { shout({ t: "slide", n: n }); },
    submit: function (slideId, payload) {
      var who = loadMe() || {};
      var face = who.face ? { id: who.face.id || "" } : {};
      var row = {
        t: "resp",
        slide: String(slideId),
        sid: sid(),
        text: payload.text || "",
        choice: payload.choice || "",
        at: Date.now(),
        name: who.name || "",
        face: face
      };
      shout(row);
    },
    onResponses: function (fn) { respFns.push(fn); },
    getResponses: function (id) {
      return Object.keys(responses[id] || {}).map(function (k) { return responses[id][k]; });
    },
    reset: function (id) { shout({ t: "reset", slide: String(id) }); },
    wipe: function () { shout({ t: "wipe" }); },
    getStatus: function () { return status; },
    onStatus: function (fn) { statusFns.push(fn); fn(status); },
    markDone: function (id) {
      try { sessionStorage.setItem("deck-done-" + id, "1"); } catch (e) {}
    },
    isDone: function (id) {
      try { return sessionStorage.getItem("deck-done-" + id) === "1"; } catch (e) { return false; }
    },
    isPresenting: function () { return presenting; },
    onPresenting: function (fn) { presentFns.push(fn); fn(presenting); },
    present: function () {
      wantLive = true;
      sharePack();
      function beat() {
        if (!wantLive) return;
        shout({ t: "here", at: Math.max(Date.now(), lastGoneAt + 1) });
      }
      beat();
      if (!heartbeat) heartbeat = setInterval(beat, 4000);
      if (!leaveBound) {
        leaveBound = function () { global.DeckSync.standDown(); };
        window.addEventListener("pagehide", leaveBound);
        window.addEventListener("beforeunload", leaveBound);
      }
    },
    standDown: function () {
      wantLive = false;
      if (heartbeat) {
        clearInterval(heartbeat);
        heartbeat = null;
      }
      noteGone(Date.now());
      shout({ t: "gone", at: lastGoneAt });
    },
    me: function () { return loadMe(); },
    seated: function () { return !!loadMe(); },
    getSeats: function () { return seatList(); },
    onSeats: function (fn) { seatFns.push(fn); fn(seatList()); },
    takenNames: function () {
      var mine = sid();
      var out = {};
      seatList().forEach(function (row) {
        if (row.sid !== mine && row.name) out[row.name] = true;
      });
      return out;
    },
    sit: function (name, face) {
      if (global.Roster && !Roster.knownName(name)) return false;
      if (kicks[sid()]) return false;
      var row = {
        name: name,
        face: (global.Roster && Roster.sanitizeFace(face)) || face || {}
      };
      saveMe(row);
      function beat() {
        shout({ t: "seat", sid: sid(), name: row.name, face: { id: row.face.id || "" }, at: Date.now() });
      }
      beat();
      if (sitBeat) clearInterval(sitBeat);
      sitBeat = setInterval(beat, 3000);
      if (!sitLeave) {
        sitLeave = function () { shout({ t: "leave", sid: sid() }); };
        window.addEventListener("pagehide", sitLeave);
        window.addEventListener("beforeunload", sitLeave);
      }
      return true;
    },
    standUp: function () {
      if (sitBeat) { clearInterval(sitBeat); sitBeat = null; }
      shout({ t: "hand", sid: sid(), up: false });
      shout({ t: "leave", sid: sid() });
      me = null;
      try { sessionStorage.removeItem("deck-me"); } catch (e) {}
    },
    resumeSeat: function () {
      var who = loadMe();
      if (who) this.sit(who.name, who.face);
    },
    raise: function (up) {
      var who = loadMe() || {};
      shout({
        t: "hand",
        sid: sid(),
        name: who.name || "",
        face: who.face ? { id: who.face.id || "" } : {},
        up: !!up,
        slide: slide,
        at: Date.now()
      });
    },
    handUp: function () {
      var mine = sid();
      return handList().some(function (h) { return h.sid === mine; });
    },
    getHands: function () { return handList(); },
    onHands: function (fn) { handFns.push(fn); fn(handList()); },
    isLocalOnly: function () { return localOnly; },
    lastHereAt: function () { return lastHere; },
    setRoster: function (names) {
      names = (names || []).map(function (n) { return String(n || "").replace(/\s+/g, " ").trim(); }).filter(Boolean);
      if (global.Roster && Roster.setNames) Roster.setNames(names);
      try { localStorage.setItem("deck-roster", JSON.stringify(names)); } catch (e) {}
      emitSeats();
      if (firebaseConfigured()) return fbWrite("roster", names);
      return Promise.resolve(true);
    },
    getRoster: function () {
      return (global.Roster && Roster.names) ? Roster.names.slice() : [];
    },
    snapshot: function () {
      return {
        at: Date.now(),
        room: room,
        session: session,
        join: (global.DeckContent && DeckContent.joinHref && DeckContent.joinHref()) || cfg.joinUrl || (location.origin + location.pathname.replace(/[^/]+$/, "")),
        localOnly: localOnly,
        forceFirebase: forceFirebase,
        presenting: presenting,
        lastHere: lastHere,
        hereAgeMs: lastHere ? Date.now() - lastHere : null,
        slide: slide,
        seats: seatList().map(function (r) { return r.name; }),
        status: { live: status.live, mode: status.mode, detail: status.detail, phones: !!status.phones },
        firebase: fbReachable,
        error: lastError,
        hereUrl: fbUrl("here")
      };
    },
    probe: function () {
      var token = Date.now();
      var firebase = fbUrl("_probe")
        ? fbWrite("_probe", token).then(function (ok) {
            if (!ok) return { ok: false, write: false, read: false, error: lastError || "write failed" };
            return fbFetch(fbUrl("_probe")).then(function (r) {
              if (!r.ok) throw new Error(String(r.status));
              return r.json();
            }).then(function (v) {
              fbWrite("_probe", null);
              var read = v === token || +v === token;
              return { ok: read, write: true, read: read, value: v };
            });
          }).catch(function () {
            lastError = "Firebase probe failed";
            return { ok: false, write: false, read: false, error: lastError };
          })
        : Promise.resolve({ ok: false, write: false, read: false, error: "No Firebase URL" });
      var ntfyBase = String(cfg.ntfyBase || "https://ntfy.sh").replace(/\/$/, "") + "/" + room;
      var ntfy = localOnly
        ? Promise.resolve({ ok: false, skipped: true })
        : fetch(ntfyBase, { method: "POST", body: JSON.stringify({ t: "probe", at: Date.now(), session: session }) })
          .then(function (r) { return { ok: r.ok, status: r.status }; })
          .catch(function () { return { ok: false, status: 0 }; });
      return Promise.all([firebase, ntfy]).then(function (pair) {
        return { firebase: pair[0], ntfy: pair[1], snap: global.DeckSync.snapshot() };
      });
    },
    pullRoom: function () {
      var url = fbUrl("");
      if (!url) return Promise.resolve(false);
      return fbFetch(url).then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      }).then(function (data) {
        takeRoom(data);
        markFirebaseLive();
        return true;
      }).catch(function () {
        lastError = "Firebase pull failed";
        return false;
      });
    },
    pushLive: function () {
      if (localOnly) {
        lastError = "Rehearsal mode (?local=1), so phones cannot see Go live";
        this.present();
        return Promise.resolve({ ok: false, wrote: false, read: null, error: lastError });
      }
      this.present();
      shout({ t: "slide", n: slide });
      var at = Math.max(Date.now(), lastGoneAt + 1);
      lastHere = at;
      setPresenting(true);
      return fbWrite("here", at).then(function (ok) {
        if (!ok) return { ok: false, wrote: false, read: null, error: lastError || "Firebase write failed" };
        return fbFetch(fbUrl("here")).then(function (r) {
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        }).then(function (v) {
          var n = typeof v === "number" ? v : (v && v.at);
          takeHere(n, true);
          return { ok: !!n, wrote: true, read: n, error: n ? "" : "Wrote Go live but read-back was empty" };
        });
      }).catch(function () {
        lastError = lastError || "Firebase read-back failed";
        return { ok: false, wrote: true, read: null, error: lastError };
      });
    },
    republish: function () {
      sharePack();
      shout({ t: "slide", n: slide });
      if (presenting) shout({ t: "here", at: Date.now() });
    },
    sharePack: sharePack,
    onPack: function (fn) { packFns.push(fn); },
    clearSeats: function () {
      seats = {};
      lastSeatSig = "";
      emitSeats();
      return fbWrite("seats", null);
    },
    kick: function (targetSid) {
      if (!targetSid) return false;
      var row = seats[targetSid] || {};
      shout({ t: "kick", sid: targetSid, name: row.name || "", at: Date.now() });
      return true;
    },
    kickName: function (name) {
      var found = "";
      Object.keys(seats).forEach(function (k) {
        if (seats[k].name === name) found = k;
      });
      if (!found) {
        Object.keys(kicks).forEach(function (k) { if (kicks[k].name === name) found = k; });
      }
      if (!found) return false;
      return this.kick(found);
    },
    unkickAll: function () {
      kicks = {};
      shout({ t: "unkick" });
    },
    onKick: function (fn) { kickFns.push(fn); },
    getKicks: function () {
      return Object.keys(kicks).map(function (k) { return kicks[k]; });
    }
  };
})(window);
