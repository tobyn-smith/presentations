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
  var backupResponseKey = "deck-backup-responses-" + room + "-" + session;
  var backupResponses = {};
  try { backupResponses = JSON.parse(localStorage.getItem(backupResponseKey) || "{}") || {}; } catch (e) {}
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
  var lastHandSig = "";
  var lastStatusSig = "";
  var lastRespSig = {};
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
  var fbSource = null;
  var usingFirebase = false;
  var fbReachable = false;
  var fbLocked = false;
  var backupOn = false;
  var lastError = "";
  var lastFbHttp = 0;
  var fbErrs = 0;
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

  function emitStatus() {
    var sig = [status.live, status.mode, status.detail, status.phones].join("|");
    if (sig === lastStatusSig) return;
    lastStatusSig = sig;
    statusFns.forEach(function (fn) { fn(status); });
  }
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
    var t = +at || 0;
    if (!t) {
      if (lastHere && Date.now() - lastHere < HERE_MS) return;
      t = Date.now();
    }
    if (lastHere && lastHere > t) return;
    lastGoneAt = Math.max(lastGoneAt, t);
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
    var sig = list.map(function (r) {
      return [r.sid, r.choice, r.text, r.at].join(":");
    }).join("|");
    if (lastRespSig[id] === sig) return;
    lastRespSig[id] = sig;
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
      .sort(function (a, b) { return String(a.sid || "").localeCompare(String(b.sid || "")); });
  }
  function emitSeats() {
    var list = seatList();
    var sig = list.map(function (r) { return r.sid; }).join("|");
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
    var sig = list.map(function (h) { return h.sid + ":" + h.slide + ":" + (h.at || 0); }).join("|");
    if (sig === lastHandSig) return;
    lastHandSig = sig;
    handFns.forEach(function (fn) { fn(list); });
  }
  function dropHands() {
    hands = {};
    emitHands();
  }
  function readStoredMe() {
    var keys = ["sessionStorage", "localStorage"];
    var i;
    for (i = 0; i < keys.length; i++) {
      try {
        var raw = (keys[i] === "sessionStorage" ? sessionStorage : localStorage).getItem("deck-me");
        if (!raw) continue;
        var parsed = JSON.parse(raw);
        if (parsed && (parsed.in || parsed.name)) return { in: true };
      } catch (e) {}
    }
    return null;
  }
  function loadMe() {
    if (me && (me.in || me.name)) return me;
    me = readStoredMe();
    return me;
  }
  function saveMe(row) {
    me = { in: true };
    var raw = JSON.stringify(me);
    try { sessionStorage.setItem("deck-me", raw); } catch (e) {}
    try { localStorage.setItem("deck-me", raw); } catch (e) {}
  }
  function clearMe() {
    me = null;
    try { sessionStorage.removeItem("deck-me"); } catch (e) {}
    try { localStorage.removeItem("deck-me"); } catch (e) {}
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
    if (msg.t === "resp" && (via === "ntfy" || (via === "bc" && backupOn))) queueBackupResponse(msg);
    if (msg.t === "resp" && msg.slide != null && msg.sid) {
      var id = String(msg.slide);
      responses[id] = responses[id] || {};
      responses[id][msg.sid] = {
        sid: msg.sid,
        slide: id,
        text: msg.text ? String(msg.text).slice(0, 800) : "",
        choice: msg.choice != null ? String(msg.choice).slice(0, 80) : "",
        at: msg.at || Date.now(),
        bin: msg.bin || ""
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
    if (msg.t === "seat" && msg.sid) {
      if (kicks[msg.sid]) return;
      seats[msg.sid] = { sid: msg.sid, at: msg.at || Date.now() };
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
        hands[msg.sid] = {
          sid: msg.sid,
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
    if (backupOn || localOnly || !usingFirebase) {
      try { if (bc) bc.postMessage(msg); } catch (e) {}
    }
    return publishLive(msg);
  }

  var publishNtfy = function () { return Promise.resolve(false); };
  var publishFb = function () { return Promise.resolve(false); };
  function publishLive(msg) {
    if (localOnly) return Promise.resolve(true);
    if (usingFirebase && !fbLocked) {
      return Promise.resolve(publishFb(msg)).then(function (ok) {
        if (ok) return true;
        lockFirebase(lastFbHttp || 0);
        return Promise.resolve(publishNtfy(msg)).then(function (backupOk) { return !!backupOk; });
      }).catch(function () {
        lockFirebase(lastFbHttp || 0);
        return Promise.resolve(publishNtfy(msg)).then(function (backupOk) { return !!backupOk; });
      });
    }
    return Promise.resolve(publishNtfy(msg)).then(function (ok) { return !!ok; });
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
    if (typeof AbortController === "undefined") return fetch(url, opt);
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, 6500);
    opt.signal = controller.signal;
    return fetch(url, opt).then(function (response) {
      clearTimeout(timer);
      return response;
    }).catch(function (error) {
      clearTimeout(timer);
      throw error;
    });
  }

  function readFbHttp(r, kind) {
    lastFbHttp = r && r.status ? r.status : 0;
    if (!r) return false;
    if (r.status === 401 || r.status === 403) {
      lastError = "HTTP " + r.status;
      lockFirebase(r.status);
      return false;
    }
    if (!r.ok) {
      lastError = (kind || "Firebase") + " HTTP " + r.status;
      return false;
    }
    return true;
  }

  function fbPut(sub, value) {
    var url = fbUrl(sub);
    if (!url) return Promise.resolve(false);
    var opt = { method: value === null ? "DELETE" : "PUT" };
    if (value !== null) {
      opt.headers = { "Content-Type": "application/json" };
      opt.body = JSON.stringify(value);
    }
    return fbFetch(url, opt).then(function (r) {
      if (!readFbHttp(r, "write")) return false;
      markFirebaseLive();
      return true;
    }).catch(function () {
      lastError = "Firebase write failed" + (sub ? " (" + sub + ")" : "");
      if (!usingFirebase) lockFirebase(0);
      return false;
    });
  }

  function fbPatch(obj) {
    var url = fbUrl("");
    if (!url) return Promise.resolve(false);
    return fbFetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(obj)
    }).then(function (r) {
      if (!readFbHttp(r, "patch")) return false;
      markFirebaseLive();
      return true;
    }).catch(function () {
      lastError = "Firebase patch failed";
      if (!usingFirebase) lockFirebase(0);
      return false;
    });
  }

  function fbWrite(sub, value) {
    return fbPut(sub, value);
  }

  function takeHere(v, force) {
    if (v == null || v === false) {
      if (!force && lastHere && lastHere > lastGoneAt && Date.now() - lastHere < 10000) return;
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
    clearMe();
    try { sessionStorage.removeItem("deck-sid"); } catch (e) {}
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

  function packSig(data) {
    if (!data || typeof data !== "object") return "";
    return JSON.stringify({
      slides: data.slides || [],
      names: data.names || [],
      title: data.deck && data.deck.title
    });
  }

  function takePack(data) {
    if (!data || typeof data !== "object") return;
    var sig = packSig(data);
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
    lastPackSig = packSig(data);
    var msg = { t: "pack", session: session, data: data };
    if (backupOn) {
      try { if (bc) bc.postMessage(msg); } catch (e) {}
    }
    if (usingFirebase && !fbLocked) fbPut("pack", data);
    if (!backupOn) return;
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
      if (kicks[k]) {
        fbWrite("seats/" + k, null);
        return;
      }
      seen[k] = true;
      seats[k] = { sid: k, at: row.at || Date.now() };
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
        slide: row.slide != null ? String(row.slide) : String(slide),
        up: true,
        at: row.at || Date.now()
      };
    });
    emitHands();
  }

  function takeResponses(val) {
    ingestAnswers({ responses: val });
  }

  function addAnswerBucket(bucket) {
    if (!bucket || typeof bucket !== "object") return;
    Object.keys(bucket).forEach(function (slideId) {
      Object.keys(bucket[slideId] || {}).forEach(function (k) {
        var row = bucket[slideId][k] || {};
        apply({
          t: "resp",
          slide: slideId,
          sid: k,
          text: row.text || "",
          choice: row.choice || "",
          at: row.at || 0,
          bin: row.bin || ""
        }, "fb");
      });
    });
  }

  function ingestAnswers(data) {
    if (!data) return;
    addAnswerBucket(data.responses);
    addAnswerBucket(data.votes);
    addAnswerBucket(data.places);
  }

  function takeRoom(data) {
    if (!data || typeof data !== "object") {
      if (!wantLive && !presenting) takeHere(null);
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
    ingestAnswers(data);
  }

  function setSyncLine(mode, detail, phones) {
    status.live = mode !== "local";
    status.mode = mode;
    status.detail = detail;
    status.phones = !!phones;
    emitStatus();
  }

  function markFirebaseLive() {
    fbReachable = true;
    fbLocked = false;
    usingFirebase = true;
    fbErrs = 0;
    setSyncLine("firebase", "Live sync: Firebase", true);
  }

  function startBackup() {
    if (localOnly || backupOn || forceFirebase) return;
    backupOn = true;
    if (bc && !bc.onmessage) {
      bc.onmessage = function (ev) { apply(ev.data, "bc"); };
    }
    useNtfy();
    setSyncLine("backup", "Live sync: backup, Firebase locked", true);
  }

  function lockFirebase(code) {
    if (code) lastFbHttp = code;
    fbReachable = false;
    fbLocked = true;
    usingFirebase = false;
    startBackup();
    setSyncLine("backup", "Live sync: backup, Firebase locked", true);
  }

  function bindPublishFb() {
    publishFb = function (msg) {
      if (msg.t === "slide") return fbPut("slide", msg.n);
      if (msg.t === "resp") {
        var row = {
          text: msg.text || "", choice: msg.choice || "", at: msg.at || Date.now(), bin: msg.bin || ""
        };
        var kind = msg.bin === "place" || msg.kind === "place" ? "places" : "votes";
        return fbPut(kind + "/" + msg.slide + "/" + msg.sid, row);
      }
      if (msg.t === "reset") return Promise.all([
        fbPut("votes/" + msg.slide, null),
        fbPut("places/" + msg.slide, null),
        fbPut("responses/" + msg.slide, null)
      ]).then(function (rows) { return rows.every(Boolean); });
      if (msg.t === "wipe") return Promise.all([
        fbPut("votes", null), fbPut("places", null), fbPut("responses", null)
      ]).then(function (rows) { return rows.every(Boolean); });
      if (msg.t === "here") return fbPatch({ goneAt: null, here: msg.at || Date.now() });
      if (msg.t === "gone") return fbPatch({ here: null, goneAt: msg.at || Date.now() });
      if (msg.t === "kick") return Promise.all([
        fbPut("seats/" + msg.sid, null),
        fbPut("hands/" + msg.sid, null),
        fbPut("kicks/" + msg.sid, { name: msg.name || "", at: msg.at || Date.now() })
      ]).then(function (rows) { return rows.every(Boolean); });
      if (msg.t === "unkick") return fbPut("kicks", null);
      if (msg.t === "seat") return fbPut("seats/" + msg.sid, { at: msg.at || Date.now() });
      if (msg.t === "leave") return Promise.all([
        fbPut("seats/" + msg.sid, null), fbPut("hands/" + msg.sid, null)
      ]).then(function (rows) { return rows.every(Boolean); });
      if (msg.t === "hand") return msg.up
        ? fbPut("hands/" + msg.sid, { slide: msg.slide, up: true, at: msg.at || Date.now() })
        : fbPut("hands/" + msg.sid, null);
      return Promise.resolve(true);
    };
  }

  function queueBackupResponse(msg) {
    if (!msg || msg.t !== "resp" || msg.slide == null || !msg.sid) return;
    var id = String(msg.slide);
    backupResponses[id] = backupResponses[id] || {};
    backupResponses[id][msg.sid] = {
      t: "resp",
      slide: id,
      sid: String(msg.sid),
      text: msg.text ? String(msg.text).slice(0, 800) : "",
      choice: msg.choice != null ? String(msg.choice).slice(0, 80) : "",
      kind: msg.kind || "",
      bin: msg.bin || "",
      at: msg.at || Date.now(),
      session: session
    };
    try { localStorage.setItem(backupResponseKey, JSON.stringify(backupResponses)); } catch (e) {}
  }

  function flushBackupResponses() {
    if (!usingFirebase || !publishFb) return Promise.resolve(false);
    var jobs = [];
    Object.keys(backupResponses).forEach(function (id) {
      Object.keys(backupResponses[id] || {}).forEach(function (sidKey) {
        jobs.push(publishFb(backupResponses[id][sidKey]));
      });
    });
    if (!jobs.length) return Promise.resolve(true);
    return Promise.all(jobs).then(function (results) {
      var ok = results.every(Boolean);
      if (ok) {
        backupResponses = {};
        try { localStorage.removeItem(backupResponseKey); } catch (e) {}
      }
      return ok;
    }).catch(function () { return false; });
  }

  function applyFbPath(path, data) {
    var p = String(path || "/").replace(/^\//, "");
    if (!p || p === "/") {
      if (data && typeof data === "object") takeRoom(data);
      return;
    }
    if (p === "slide") takeSlide(data);
    else if (p === "here") takeHere(data, data == null);
    else if (p === "goneAt") { if (data) noteGone(data); }
    else if (p === "seats") takeSeats(data);
    else if (p === "hands") takeHands(data);
    else if (p === "responses" || p === "votes" || p === "places") ingestAnswers(p === "responses" ? { responses: data } : p === "votes" ? { votes: data } : { places: data });
    else if (p === "pack") takePack(data);
    else if (p === "roster") takeRoster(data);
    else if (p === "kicks") takeKicks(data);
    else if (p.indexOf("seats/") === 0) {
      var seatId = p.slice(6);
      if (!seatId) return;
      if (data == null) {
        delete seats[seatId];
        lastSeatSig = "";
        emitSeats();
      } else {
        apply({ t: "seat", sid: seatId, at: data.at }, "fb");
      }
    } else if (p.indexOf("hands/") === 0) {
      var handId = p.slice(6);
      if (!handId) return;
      if (data == null) apply({ t: "hand", sid: handId, up: false }, "fb");
      else apply({ t: "hand", sid: handId, up: true, slide: data.slide, at: data.at }, "fb");
    } else if (p.indexOf("votes/") === 0 || p.indexOf("places/") === 0 || p.indexOf("responses/") === 0) {
      var bits = p.split("/");
      var slideId = bits[1];
      var who = bits[2];
      if (!slideId || !who) {
        if (slideId && data && typeof data === "object" && !who) {
          Object.keys(data).forEach(function (k) {
            apply({
              t: "resp",
              slide: slideId,
              sid: k,
              text: data[k] && data[k].text,
              choice: data[k] && data[k].choice,
              at: data[k] && data[k].at,
              bin: data[k] && data[k].bin
            }, "fb");
          });
        }
        return;
      }
      if (data == null) {
        if (responses[slideId]) delete responses[slideId][who];
        emitResp(slideId);
        return;
      }
      apply({
        t: "resp",
        slide: slideId,
        sid: who,
        text: data.text,
        choice: data.choice,
        at: data.at,
        bin: data.bin
      }, "fb");
    }
  }

  function onFbStream(e) {
    try {
      var body = JSON.parse(e.data);
      var path = body && body.path != null ? body.path : "/";
      var data = body && Object.prototype.hasOwnProperty.call(body, "data") ? body.data : body;
      markFirebaseLive();
      applyFbPath(path, data);
    } catch (err) {}
  }

  function openFbStream() {
    if (fbSource || !fbUrl("")) return;
    try {
      fbSource = new EventSource(fbUrl(""));
      fbSource.addEventListener("put", onFbStream);
      fbSource.addEventListener("patch", onFbStream);
      fbSource.onerror = function () {
        fbErrs += 1;
      };
    } catch (e) {
      lockFirebase(0);
    }
  }

  function closeFbStream() {
    if (!fbSource) return;
    try { fbSource.close(); } catch (e) {}
    fbSource = null;
  }

  var fbPoll = null;
  function startFbPoll() {
    if (fbPoll || localOnly) return;
    fbPoll = setInterval(function () {
      if (!usingFirebase || fbLocked) return;
      fbFetch(fbUrl("")).then(function (r) {
        lastFbHttp = r.status;
        if (!r.ok) {
          lastError = "Firebase read HTTP " + r.status;
          lockFirebase(r.status);
          return;
        }
        return r.json().then(function (data) {
          if (data && typeof data === "object") takeRoom(data);
        });
      }).catch(function () {
        lastError = lastError || "Firebase read failed";
        lockFirebase(0);
      });
    }, 1000);
  }

  function enableFirebaseRest() {
    if (!firebaseConfigured() || !fbUrl("")) return false;
    bindPublishFb();
    fbFetch(fbUrl("")).then(function (r) {
      lastFbHttp = r.status;
      if (r.status === 401 || r.status === 403) {
        lastError = "HTTP " + r.status;
        lockFirebase(r.status);
        return;
      }
      if (!r.ok) {
        lastError = "HTTP " + r.status;
        lockFirebase(r.status);
        return;
      }
      return r.json().then(function (data) {
        if (data && typeof data === "object") takeRoom(data);
        markFirebaseLive();
        flushBackupResponses();
        openFbStream();
        startFbPoll();
        if (presenting) publishFb({ t: "here", at: lastHere || Date.now(), session: session });
        if (me) publishFb({ t: "seat", sid: sid(), at: Date.now(), session: session });
      });
    }).catch(function () {
      lastError = lastError || "Firebase unreachable";
      lockFirebase(0);
    });
    return true;
  }

  function retryFirebase() {
    if (localOnly || !firebaseConfigured() || usingFirebase) return;
    fbFetch(fbUrl("")).then(function (r) {
      lastFbHttp = r.status;
      if (!r.ok) return;
      return r.json().then(function (data) {
        bindPublishFb();
        if (data && typeof data === "object") takeRoom(data);
        markFirebaseLive();
        flushBackupResponses();
        closeFbStream();
        openFbStream();
        startFbPoll();
      });
    }).catch(function () {});
  }

  function useNtfy() {
    var base = String(cfg.ntfyBase || "https://ntfy.sh").replace(/\/$/, "");
    var topic = room;
    var url = base + "/" + topic;
    var sseOpen = false;
    publishNtfy = function (msg) {
      return fetch(url, { method: "POST", body: JSON.stringify(msg) }).then(function (r) {
        if (!r.ok) {
          lastError = "Backup message HTTP " + r.status;
          return false;
        }
        return true;
      }).catch(function () {
        lastError = "Backup message could not be sent";
        return false;
      });
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
      var lastSlide = null;
      var lastPack = null;
      text.split("\n").forEach(function (line) {
        if (!line.trim()) return;
        try {
          var ev = JSON.parse(line);
          if (ev && ev.event && ev.event !== "message") return;
          var payload = ev && ev.message != null ? ev.message : line;
          var msg = typeof payload === "string" ? JSON.parse(payload) : payload;
          if (!msg || !msg.t) return;
          if (msg.t === "here" || msg.t === "gone") lastLive = msg;
          else if (msg.t === "slide") lastSlide = msg;
          else if (msg.t === "pack") lastPack = msg;
          else apply(msg, "ntfy");
        } catch (e) {}
      });
      if (lastPack) apply(lastPack, "ntfy");
      if (lastSlide) apply(lastSlide, "ntfy");
      if (lastLive) apply(lastLive, "ntfy");
      if (!usingFirebase) setSyncLine("backup", "Live sync: backup, Firebase locked", true);
    }).catch(function () {});
    try {
      var es = new EventSource(url + "/sse");
      ntfySource = es;
      es.onmessage = function (e) { ingest(e.data); };
      es.onerror = function () {};
      es.onopen = function () {
        sseOpen = true;
        if (!usingFirebase) setSyncLine("backup", "Live sync: backup, Firebase locked", true);
      };
    } catch (e) {}
    return sseOpen;
  }

  function startLive() {
    if (localOnly) {
      status = { live: false, mode: "local", detail: "This computer only", phones: false };
      emitStatus();
      return;
    }
    if (bc) bc.onmessage = function (ev) { apply(ev.data, "bc"); };
    if (firebaseConfigured()) enableFirebaseRest();
    else startBackup();
    setInterval(retryFirebase, 20000);
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
      var row = {
        t: "resp",
        slide: String(slideId),
        sid: sid(),
        text: payload.text || "",
        choice: payload.choice || "",
        kind: payload.kind || "",
        bin: payload.bin || payload.kind || "",
        at: Date.now()
      };
      return shout(row).then(function (ok) {
        if (ok && !usingFirebase) queueBackupResponse(row);
        return ok;
      });
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
    sit: function () {
      if (kicks[sid()]) {
        try { sessionStorage.removeItem("deck-sid"); } catch (e) {}
      }
      if (kicks[sid()]) return false;
      saveMe({ in: true });
      function beat() {
        shout({ t: "seat", sid: sid(), at: Date.now() });
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
      clearMe();
    },
    resumeSeat: function () {
      if (loadMe()) this.sit();
    },
    raise: function (up) {
      shout({
        t: "hand",
        sid: sid(),
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
        join: cfg.joinUrl || (location.origin + location.pathname.replace(/[^/]+$/, "")),
        localOnly: localOnly,
        forceFirebase: forceFirebase,
        presenting: presenting,
        lastHere: lastHere,
        hereAgeMs: lastHere ? Date.now() - lastHere : null,
        slide: slide,
        seats: seatList().map(function (r) { return r.sid; }),
        status: { live: status.live, mode: status.mode, detail: status.detail, phones: !!status.phones },
        firebase: fbReachable,
        firebaseHttp: lastFbHttp,
        error: lastError,
        hereUrl: fbUrl("here")
      };
    },
    probe: function () {
      var token = Date.now();
      var firebase = fbUrl("_probe")
        ? fbFetch(fbUrl("_probe"), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(token)
          }).then(function (r) {
            lastFbHttp = r.status;
            if (r.status === 401 || r.status === 403) {
              lastError = "HTTP " + r.status;
              lockFirebase(r.status);
              return { ok: false, write: false, read: false, status: r.status, error: "HTTP " + r.status };
            }
            if (!r.ok) {
              lastError = "HTTP " + r.status;
              return { ok: false, write: false, read: false, status: r.status, error: "HTTP " + r.status };
            }
            return fbFetch(fbUrl("_probe")).then(function (readRes) {
              lastFbHttp = readRes.status;
              if (!readRes.ok) {
                return { ok: false, write: true, read: false, status: readRes.status, error: "HTTP " + readRes.status };
              }
              return readRes.json().then(function (v) {
                fbPut("_probe", null);
                var read = v === token || +v === token;
                markFirebaseLive();
                return { ok: read, write: true, read: read, status: readRes.status, value: v };
              });
            });
          }).catch(function () {
            lastError = lastError || "Firebase probe failed";
            if (!usingFirebase) lockFirebase(lastFbHttp || 0);
            return { ok: false, write: false, read: false, status: lastFbHttp || 0, error: lastError };
          })
        : Promise.resolve({ ok: false, write: false, read: false, status: 0, error: "No Firebase URL" });
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
        lastFbHttp = r.status;
        if (r.status === 401 || r.status === 403) {
          lastError = "HTTP " + r.status;
          lockFirebase(r.status);
          return false;
        }
        if (!r.ok) {
          lastError = "HTTP " + r.status;
          return false;
        }
        return r.json().then(function (data) {
          if (data && typeof data === "object") takeRoom(data);
          markFirebaseLive();
          return true;
        });
      }).catch(function () {
        lastError = lastError || "Firebase pull failed";
        return false;
      });
    },
    pushLive: function () {
      if (localOnly) {
        lastError = "?local=1 is on, so phones cannot see Go live";
        this.present();
        return Promise.resolve({ ok: false, wrote: false, read: null, error: lastError });
      }
      this.present();
      shout({ t: "slide", n: slide });
      var at = Math.max(Date.now(), lastGoneAt + 1);
      lastHere = at;
      setPresenting(true);
      if (fbLocked || !firebaseConfigured()) {
        return Promise.resolve({
          ok: backupOn,
          wrote: backupOn,
          read: backupOn ? at : null,
          status: lastFbHttp,
          error: backupOn ? "" : (lastError || "HTTP " + lastFbHttp)
        });
      }
      return fbPatch({ goneAt: null, here: at }).then(function (ok) {
        if (!ok) {
          return {
            ok: backupOn,
            wrote: backupOn,
            read: backupOn ? at : null,
            status: lastFbHttp,
            error: lastError || "HTTP " + lastFbHttp
          };
        }
        return fbFetch(fbUrl("here")).then(function (r) {
          lastFbHttp = r.status;
          if (!r.ok) throw new Error(String(r.status));
          return r.json();
        }).then(function (v) {
          var n = typeof v === "number" ? v : (v && v.at);
          takeHere(n, true);
          return { ok: !!n, wrote: true, read: n, status: lastFbHttp, error: n ? "" : "Wrote Go live but read-back was empty" };
        });
      }).catch(function () {
        lastError = lastError || "Firebase read-back failed";
        return { ok: backupOn, wrote: true, read: backupOn ? at : null, status: lastFbHttp, error: lastError };
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
