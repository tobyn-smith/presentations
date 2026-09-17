(function (global) {
  var NAMES = [];

  var BGS = ["#004E60", "#ba0c2f", "#554F47", "#00A3AD", "#000000", "#B4BD00", "#9EA2A2", "#004E60", "#ba0c2f", "#554F47", "#00A3AD", "#000000", "#B4BD00", "#9EA2A2", "#004E60", "#ba0c2f"];
  var SKINS = ["#f3d2b3", "#e0ac69", "#c68642", "#8d5524", "#d7a07c", "#ffdbac", "#ae5d29", "#6b3b1f"];
  var HAIRS = ["#0b1f44", "#0b3d1a", "#3c0d0c", "#2a0b38", "#1a1030", "#24180a", "#12162e", "#0a2430", "#202124", "#3e2723", "#1b0a16", "#0d2137"];
  var SHIRTS = ["#174ea6", "#0d652d", "#8a1e1c", "#5e157c", "#185abc", "#283593", "#006064", "#3c4043"];
  var FACES = [];
  for (var fi = 0; fi < 48; fi++) {
    FACES.push({
      id: String(fi),
      bg: BGS[fi % BGS.length],
      skin: SKINS[Math.floor(fi / 3) % SKINS.length],
      hair: HAIRS[fi % HAIRS.length],
      shirt: SHIRTS[Math.floor(fi / 2) % SHIRTS.length],
      cut: fi % 8,
      extra: fi % 7
    });
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function findFace(id) {
    id = String(id == null ? "" : id);
    for (var i = 0; i < FACES.length; i++) if (FACES[i].id === id) return FACES[i];
    return FACES[0];
  }

  function knownName(name) {
    name = String(name || "").trim();
    if (!name) return false;
    if (!NAMES.length) return true;
    return NAMES.indexOf(name) >= 0;
  }

  function setNames(list) {
    NAMES = (list || []).map(function (n) {
      return String(n || "").replace(/\s+/g, " ").trim();
    }).filter(Boolean);
    global.Roster.names = NAMES;
  }

  function firstName(name) {
    return String(name || "").split(/\s+/)[0] || "";
  }

  function initials(name) {
    var parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  function hairBack(cut) {
    if (cut === 1) return '<circle cx="32" cy="22" r="15"/><circle cx="45" cy="16" r="5"/>';
    if (cut === 2) return '<ellipse cx="28" cy="22" rx="14" ry="15"/>';
    if (cut === 3) return '<circle cx="32" cy="20" r="17"/>';
    if (cut === 4) return '<path d="M15 26 C16 8 48 8 49 26 V44 H15Z"/>';
    if (cut === 5) return '<rect x="17" y="8" width="30" height="22" rx="9"/>';
    if (cut === 6) return '<ellipse cx="32" cy="20" rx="14" ry="13"/><ellipse cx="48" cy="34" rx="6" ry="12"/>';
    if (cut === 7) return '<path d="M20 18 h24 v8 H20Z"/>';
    return '<ellipse cx="32" cy="20" rx="15" ry="13"/>';
  }

  function extras(spec) {
    var e = spec.extra || 0;
    var g = "";
    if (e === 1 || e === 5) {
      g += '<g fill="none" stroke="#202124" stroke-width="1.6"><circle cx="27" cy="32" r="3.2"/><circle cx="37" cy="32" r="3.2"/><path d="M30.2 32 h3.6"/></g>';
    }
    if (e === 2 || e === 5) g += '<path d="M24 38 Q32 46 40 38 Q32 42 24 38Z" fill="' + spec.hair + '"/>';
    if (e === 3) g += '<circle cx="43" cy="36" r="1.6" fill="#f6d365"/>';
    if (e === 4) g += '<path d="M20 26 Q32 34 44 26" fill="' + spec.hair + '"/>';
    if (e === 6) g += '<rect x="22" y="16" width="20" height="4" rx="1" fill="#202124"/>';
    return g;
  }

  function svgFace(spec) {
    spec = spec || FACES[0];
    return '<svg class="face-svg" viewBox="0 0 64 64" aria-hidden="true">'
      + '<circle cx="32" cy="32" r="32" fill="' + spec.bg + '"/>'
      + '<ellipse cx="32" cy="60" rx="20" ry="16" fill="' + spec.shirt + '"/>'
      + '<g fill="' + spec.hair + '">' + hairBack(spec.cut) + "</g>"
      + '<circle cx="32" cy="32" r="11" fill="' + (spec.skin || "#e0ac69") + '"/>'
      + extras(spec)
      + "</svg>";
  }

  function faceHtml(face, name) {
    face = face || {};
    if (face.id != null && face.id !== "") {
      return '<span class="face">' + svgFace(findFace(face.id)) + "</span>";
    }
    return '<span class="face face-inits">' + esc(initials(name)) + "</span>";
  }

  function sanitizeFace(face) {
    if (!face || typeof face !== "object") return {};
    var out = {};
    if (face.id != null && findFace(face.id).id === String(face.id)) out.id = String(face.id);
    return out;
  }

  function faceForName(name) {
    var n = 0;
    String(name || "").split("").forEach(function (ch) { n += ch.charCodeAt(0); });
    return { id: FACES[n % FACES.length].id };
  }

  global.Roster = {
    names: NAMES,
    faces: FACES,
    setNames: setNames,
    knownName: knownName,
    firstName: firstName,
    initials: initials,
    findFace: findFace,
    faceHtml: faceHtml,
    sanitizeFace: sanitizeFace,
    faceForName: faceForName,
    esc: esc
  };
})(window);
