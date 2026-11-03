var assert = require("assert");
var store = {};
var fetches = [];
var esList = [];
var room = { slide: 2, here: 1 };

function MockES(url) {
  this.url = url;
  this.fns = {};
  this.readyState = 1;
  esList.push(this);
}
MockES.prototype.addEventListener = function (name, fn) { this.fns[name] = fn; };
MockES.prototype.close = function () { this.readyState = 2; };

global.window = global;
global.document = { readyState: "complete", addEventListener: function () {} };
global.location = { search: "", href: "http://localhost/" };
global.sessionStorage = {
  getItem: function (k) { return store["s:" + k] || null; },
  setItem: function (k, v) { store["s:" + k] = String(v); },
  removeItem: function (k) { delete store["s:" + k]; }
};
global.localStorage = {
  getItem: function (k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
  setItem: function (k, v) { store[k] = String(v); },
  removeItem: function (k) { delete store[k]; }
};
global.BroadcastChannel = function () {
  this.postMessage = function () {};
};
global.EventSource = MockES;
global.crypto = { randomUUID: function () { return "aaaaaaaaaaaa"; } };
global.SLIDES = [{ id: "open", type: "title", title: "T" }];
global.DECK = {
  room: "mock-room",
  session: "live",
  ntfyBase: "https://ntfy.test",
  firebase: { databaseURL: "https://mock.firebaseio.com" }
};

var mode = process.argv[2] || "ok";

global.fetch = function (url, opt) {
  opt = opt || {};
  fetches.push({ url: String(url), method: (opt.method || "GET").toUpperCase(), body: opt.body || null });
  var u = String(url);
  if (u.indexOf("ntfy.test") !== -1) {
    return Promise.resolve({
      ok: true,
      status: 200,
      text: function () { return Promise.resolve(""); },
      json: function () { return Promise.resolve(null); }
    });
  }
  if (mode === "401") {
    return Promise.resolve({
      ok: false,
      status: 401,
      json: function () { return Promise.resolve({ error: "Permission denied" }); }
    });
  }
  if (opt.method === "PUT" || opt.method === "PATCH") {
    return Promise.resolve({ ok: true, status: 200, json: function () { return Promise.resolve(null); } });
  }
  return Promise.resolve({
    ok: true,
    status: 200,
    json: function () { return Promise.resolve(room); }
  });
};

require("./sync.js");

function wait(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

wait(40).then(function () {
  var st = DeckSync.getStatus();
  if (mode === "401") {
    assert.strictEqual(st.detail, "Live sync: backup, Firebase locked");
    assert.ok(fetches.some(function (f) { return f.url.indexOf("ntfy.test") !== -1; }));
    assert.ok(!esList.some(function (es) { return /mock\.firebaseio/.test(es.url); }));
    console.log("ok 401 fallback");
    process.exit(0);
  }
  assert.strictEqual(st.detail, "Live sync: Firebase");
  assert.ok(esList.some(function (es) { return es.url === "https://mock.firebaseio.com/deck/mock-room.json"; }));
  assert.ok(!fetches.some(function (f) { return f.url.indexOf("ntfy.test") !== -1; }));
  DeckSync.setSlide(4);
  return wait(10).then(function () {
    assert.ok(fetches.some(function (f) {
      return f.method === "PUT" && /\/slide\.json$/.test(f.url);
    }));
    console.log("ok firebase primary");
    process.exit(0);
  });
}).catch(function (err) {
  console.error(err);
  process.exit(1);
});
