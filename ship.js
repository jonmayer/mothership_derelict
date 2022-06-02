// ship generator module
import ship_layouts from "./ship_layouts/ship_layouts.js"

let rand;

const ship_registry =
  ["UNSC", "MSS", "ART", "BRB", "LOL", "XMC", "RSS", "GSV", "ROU"];

const ship_type = [
  //  Class              CMD  LIFE DATA WEAP JUMP THRST REACT QUAR MED   LAB  CRYO CARGO LOCK
  ["Colony Ship", [      2,3, 3,3, 2,4, 1,1, 2,2, 2,3,  2,2,  3,5, 2,2,  3,3, 8,8, 5,6,  3,3   ]],
  ["Colony Ship", [      2,2, 3,3, 3,3, 1,1, 2,2, 3,3,  2,2,  4,5, 2,2,  3,3, 8,8, 7,8,  3,3   ]],
  ["Troop Carrier", [    2,2, 2,2, 0,0, 2,3, 1,1, 2,2,  1,1,  6,8, 2,1,  1,1, 1,1, 3,4,  2,2   ]],
  ["Cutter", [           1,1, 1,1, 0,0, 1,2, 1,1, 3,3,  1,1,  2,2, 1,1,  1,1, 1,1, 1,1,  1,1   ]],
  ["Fast Picket", [      1,1, 1,1, 0,0, 0,1, 1,2, 4,5,  1,1,  1,2, 0,0,  0,0, 0,0, 0,0,  1,1   ]],
  ["Blockade Runner", [  1,1, 1,1, 0,1, 1,2, 1,2, 4,5,  1,1,  1,1, 0,0,  0,0, 0,0, 2,2,  1,1   ]],
  ["Research Vessel", [  1,1, 1,1, 2,2, 0,0, 1,1, 1,1,  1,1,  2,2, 1,1,  2,2, 1,1, 1,1,  1,1   ]],
  ["Research Vessel", [  1,1, 1,1, 3,3, 0,1, 1,1, 1,1,  1,1,  2,3, 1,1,  2,2, 0,0, 1,1,  1,1   ]],
  ["Research Vessel", [  1,1, 1,1, 2,2, 0,0, 1,1, 1,1,  1,1,  2,2, 1,1,  4,4, 1,1, 0,0,  1,1   ]],
  ["Courier", [          1,1, 1,1, 1,1, 0,0, 1,1, 1,2,  1,1,  1,1, 1,1,  0,0, 0,0, 2,2,  1,1   ]],
  ["Courier", [          1,1, 1,1, 1,1, 0,1, 1,1, 1,1,  1,1,  1,1, 1,1,  0,0, 0,0, 2,2,  1,1   ]],
  ["Shuttle", [          1,1, 1,1, 0,0, 0,0, 0,0, 1,2,  1,1,  1,1, 0,0,  0,0, 1,1, 1,1,  1,1   ]],
  ["Shuttle", [          1,1, 1,1, 0,0, 0,0, 0,0, 1,1,  1,1,  1,1, 0,0,  0,0, 1,1, 1,1,  1,1   ]],
  ["Shuttle", [          1,1, 1,1, 1,1, 0,1, 0,0, 1,1,  1,1,  1,1, 0,0,  0,0, 0,0, 1,1,  1,1   ]],
  ["Shuttle", [          1,1, 1,1, 0,0, 1,2, 0,0, 1,1,  1,1,  1,1, 0,0,  0,0, 0,0, 1,1,  1,1   ]],
  ["Shuttle", [          1,1, 1,1, 0,0, 0,1, 0,0, 1,1,  1,1,  1,1, 1,1,  0,0, 1,1, 1,1,  1,1   ]],
  ["Freighter", [        1,1, 1,1, 2,2, 0,2, 1,2, 2,2,  1,1,  1,1, 0,0,  0,0, 1,1, 6,8,  1,1   ]],
  ["Mining Frigate", [   1,1, 1,1, 2,2, 0,1, 1,1, 2,2,  1,1,  1,1, 1,1,  1,1, 1,1, 6,6,  1,1   ]],
  ["Mining Frigate", [   1,1, 1,1, 2,2, 0,1, 1,1, 2,2,  1,1,  1,1, 1,1,  1,1, 1,1, 3,5,  1,1   ]],
  ["Mining Frigate", [   1,1, 1,1, 1,1, 0,2, 1,1, 2,2,  1,1,  2,2, 1,1,  0,0, 1,1, 2,6,  1,1   ]],
  ["Tug", [              1,1, 1,1, 0,0, 0,0, 0,0, 5,7,  1,1,  1,1, 1,1,  0,0, 0,0, 0,0,  2,2   ]],
  ["Ice Hauler", [       1,1, 1,1, 0,0, 0,0, 0,0, 2,3,  1,1,  1,1, 1,1,  0,0, 1,1, 3,4,  1,1   ]],
  ["Heavy Lifter", [     1,1, 1,1, 0,0, 0,0, 0,0, 4,5,  1,1,  1,1, 1,1,  0,0, 0,0, 0,0,  1,1   ]],
  ["Heavy Lifter", [     1,1, 1,1, 0,0, 0,0, 0,0, 4,5,  1,1,  1,1, 1,1,  0,0, 0,0, 0,0,  1,1   ]],
];

const ship_status = [
  ["undamaged", 0], ["undamaged", 0], ["undamaged", 0], ["undamaged", 0],
  ["nominal", 0.02], 
  ["damaged", 0.01], ["damaged", 0.05], ["damaged", 0.1],
  ["core unstable", 0.08],
  ["heavily damaged", 0.2], ["heavily damaged", 0.3],
  ["scrap", 0.5]];

const ship_lifesupport =
  ["Operational", "Marginal", "Failed", "Failed", "Failed", "Failed"];
const ship_survivors = 
  ["Confirmed", "Probable", "Faint", "Cryosleep", "Cryosleep", "Possible Cryosleep", "None", "None", "None", "None", "None", "None", "None"];
const ship_jumpdrive =
  ["Unstable Core", "Non-functioning", "Non-functioning", "Non-functioning", "Stable"];

// ship modules are organized by broad category, with some
// flavortext detail to be picked with them.
const ship_modules = [
  ["CMD",
    ["bridge", "navigation", "comms", "cockpit", "destroyed"],
    "rgba(241, 245, 39, 0.7)"],
  ["LIFE",
    ["functional", "nominal", "failing", "failing", "disabled", "disabled",
      "inoperative", "inoperative", "inoperative", "inoperative"],
    "rgba(126, 246, 86, 0.7)"],
  ["DATA",
    ["AI core", "brainscans", "sector map", "logs", "media"],
    "rgba(86, 183, 246, 0.7)"],
  ["WEAPON",
    ["rail gun", "mass driver", "torpedoes", "atomics"],
    "rgba(255, 33, 84, 0.7)"],
  ["JUMP",
    [ "intact", "intact", "salvageable", "inoperative", "inoperative",
      "missing", "missing"],
    "rgba(135, 33, 255, 0.7)"],
  ["THRUST",
    [ "intact", "destroyed"],
    "rgba(33, 111, 255, 0.7)"],
  ["REACTOR",
    [ "operating", "intact", "nominal", "destroyed", "radioactive",
      "self-destruct active"],
    "rgba(255, 91, 42, 0.7)"],
  ["QUARTERS",
    [ "barracks", "barracks", "barracks", "crew", "crew", "passenger",
      "passenger", "luxurious"],
    "rgba(188, 255, 179, 0.7)"],
  ["MEDBAY",
    [ "biomedical", "biomedical", "biomedical", "biomedical", "psych ward",
      "morgue", "neonatal", "android repair", "android repair"],
      "rgba(255, 3, 3, 0.7)"],
  ["LAB",
    [ "biological", "biological", "biological", "metaphysics", "refinery",
      "refinery", "minerology", "xenobiology", "observatory", "cybernetics",
      "clean room", "incubators", "R&D", "fabrication", "ship repair"],
    "rgba(98, 83, 255, 0.7)"],
  ["CRYO",
    [ "pods intact", "pods damaged",
      "pods damaged", "pods destroyed"],
    "rgba(209, 222, 255, 0.7)"],
  ["CARGO",
    [ "cargo" ],
    "rgba(220, 146, 250, 0.7)"],
  ["LOCK",
    [ "airlock" ],
    "rgba(44, 170, 170, 0.7)"],
];

function makePRNG(seedstr) {
  // cyrb128 hash function:
  let h1 = 1779033703, h2 = 3144134277,
    h3 = 1013904242, h4 = 2773480762;
  for (let i = 0, k; i < seedstr.length; i++) {
    k = seedstr.charCodeAt(i);
    h1 = Math.imul(h1 ^ k, 597399067)  ^ h2,
      h2 = Math.imul(h2 ^ k, 2869860233) ^ h3;
    h3 = Math.imul(h3 ^ k, 951274213)  ^ h4;
    h4 = Math.imul(h4 ^ k, 2716044179) ^ h1;
  }
  h1 = Math.imul(h1 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h2 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h3 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h4 ^ (h4 >>> 19), 2716044179);
  let a = (h1^h2^h3^h4)>>>0;
  let b = (h2^h1)>>>0;
  let c = (h3^h1)>>>0;
  let d = (h4^h1)>>>0;
  // xoshireo128ss:
  return function() {
    var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
    c ^= a; d ^= b;
    b ^= c; a ^= d; c ^= t;
    d = d << 11 | d >>> 21;
    return (r >>> 0);
  }
}

function getRandomInt(min, max) {
  const vals = max - min + 1;
  return Math.floor(rand() * vals / 4294967296) + min
}

function pickRandom(array) {
  var index = getRandomInt(0, array.length - 1);
  return array[index];
}

function shipname() {
  const banks = [
    // article:
    ["", "", "THE", "", "", "", ""],
    // adjective:
    ["BLACK", "LUCKY", "WANDERING", "DEEP", "EVERGREEN", "ATOMIC", "SAVAGE", "PRICELESS", "DREAMING",
      "SLEEPING", "ROUGH", "DARK", "BRIGHT", "BRAVE", "RED", "CRIMSON", "SHINING", "QUIET", "L337",
      "STROLLING", "SIGHING", "FADING", "GLORIOUS", "MISCHEVIOUS", "BLUE", "ARTFUL", "EMERALD",
      "NOBLE", "ANCILLARY", "IMPERIAL", "JOLLY", "DREAD", "", "", "", ""],
    // noun:
    ["PRINCESS", "JACK", "KING", "QUEEN", "TYRANT", "BEGGAR", "MURMUR", "SLEEPER", "STAR", "COMET", "NEBULA",
      "PULSAR", "SUN", "MOON", "HORSE", "BISHOP", "TROUBADOUR", "MUMMER", "DODGER", "CHERUB", "MARAX",
      "SERAPH", "CHOIR", "HERMES", "ARGUS", "SPHINX", "MINOTAUR", "CHIMERA", "SATYR", "ODIN",
      "DREAM", "VICTORY", "DISCOVERY", "ARGON", "ELYSIUM", "JUSTICE", "SWORD", "MERCY", "SCAVENGER", ],
    // designator:
    ["ECHO", "ALPHA", "OMEGA", "DELTA", "EPSILON", "JIBRIL", "BRAVO", "TANGO", "42", "41", "53", "52",
      "CHARLIE", "IOTA", "JULIET", "IOWA", "ROMEO", "YANKEE", "KAPPA", "URUZ", "GEBO", "JERA", "LAGUZ",
      "", "", "", "", "", "", "", ""],
  ]
  let name = [];
  for (let i = 0; i < banks.length; i++) {
    let j = getRandomInt(0, banks[i].length - 1);
    name.push(banks[i][j]);
  }
  return name.join(" ").trim();
}

class ShipModule {
  constructor(type, flavor, color) {
    this.type = type;
    this.flavor = flavor;
    this.color = color;
    this.index = -1;
    this.x = -1;
    this.y = -1;
    this.level = 0;
  }
};

class ShipConfig {
  constructor(seedstr) {
    rand = makePRNG("xyzzy" + seedstr);
    this.rand = rand;
    for (let i = 0; i < 100; i++) rand();
    this.name = shipname();
    this.class = pickRandom(ship_type);
    this.registry = pickRandom(ship_registry) + "-" + rand().toString(16) + "-" + rand().toString(16);
    this.lifesupport = pickRandom(ship_lifesupport);
    var st = pickRandom(ship_status);
    this.status = st[0]
    this.survivors = pickRandom(ship_survivors);
    this.jumpdrive = pickRandom(ship_jumpdrive);
    let name_layout = pickRandom(ship_layouts);
    let layout = name_layout[1];
    // pick parts:
    var parts = [];
    for (let i = 0; i < this.class[1].length; i = i + 2) {
      let modnum = Math.floor(i / 2);
      let count = getRandomInt(this.class[1][i], this.class[1][i+1]);
      for (let j = 0; j < count; j++) {
        let type = ship_modules[modnum][0];
        let flavor = pickRandom(ship_modules[modnum][1]);
        let color = ship_modules[modnum][2];
        parts.push(new ShipModule(type, flavor, color));
      }
    }

    // Implement damage
    var damaged_parts = Math.ceil(parts.length * st[1]);
    for (let i = 0; i < damaged_parts; i++) {
      let j = getRandomInt(0, parts.length-1);
      parts[j] = new ShipModule("", "", "rgba(200,0,0,.5)");
    }

    // assign parts to layout grid:
    if (parts.length > layout.length) {
      parts.length = layout.length;  // truncate
    }
    for (let i = 0; i < parts.length; i++) {
      parts[i].index = i;
      parts[i].x = layout[i][0];
      parts[i].y = layout[i][1];
    }
    let min = parts.reduce(
      function (m, obj) {
        m.x = Math.min(m.x, obj.x);
        m.y = Math.min(m.y, obj.y);
        return m; },
      {x: 1000, y: 1000 });
    for (let i = 0; i < parts.length; i++) {
      parts[i].x -= min.x;
      parts[i].y -= min.y;
    }
    this.parts = parts;
    this.max = parts.reduce(
      function (m, obj) {
        m.x = Math.max(m.x, obj.x);
        m.y = Math.max(m.y, obj.y);
        return m; },
      {x: 0, y: 0 });
    console.log(parts.length, layout.length);
    console.log("max", this.max);
  }

  InfoText() {
    return [
      "name: " + this.name,
      "class: " + this.class[0],
      "registry: " + this.registry,
      "status: " + this.status,
      "life support: " + this.lifesupport,
      "life signs: " + this.survivors,
      "jump drive: " + this.jumpdrive,
      "tonnage: " + (this.parts.length * 100) + "mt",
      "size: " + ((this.max.x + 1) * 17) + "m x " + ((this.max.y + 1) * 15) + "m"];
  }
  InfoHTML() {
    return "<h1>" + this.name + "</h1>\n" +
      "class: " + this.class[0] + "<br/>\n" +
      "registry: " + this.registry + "<br/>\n" +
      "status: " + this.status + "<br/>\n" +
      "life support: " + this.lifesupport + "<br/>\n" +
      "life signs: " + this.survivors + "<br/>\n" +
      "jump drive: " + this.jumpdrive + "<br/>\n" +
      "tonnage: " + (this.parts.length * 100) + "mt<br/>\n" +
      "size: " + ((this.max.x + 1) * 17) + "m x " + ((this.max.y + 1) * 15) + "m<br/>\n";

  }
};

const makeShip = (seedstr) => {
  return new ShipConfig(seedstr);
}

export default makeShip;

