
/* =========================================================
   AM DIGITAL STUDIO — CIRCUIT STUDIO
   Fixed editor: drag, pin-to-pin wiring, Sinhala/English,
   project save/load, SVG/PNG export and DC analysis.
   ========================================================= */
(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const NS = "http://www.w3.org/2000/svg";
  const GRID = 20;
  const STORAGE = "amd-circuit-studio-project-v2";

  const state = {
    parts: [],
    wires: [],
    selected: null,
    tool: "select",
    nextId: 1,
    zoom: 1,
    panX: 0,
    panY: 0,
    drag: null,
    wireStart: null,
    history: [],
    historyIndex: -1,
    language: localStorage.getItem("amd-circuit-language") || "en",
    simulation: null
  };

  const library = {
    battery: {
      name: "DC Battery", category: "source", w: 80, h: 60,
      pins: [["+", 0, 30], ["−", 80, 30]],
      props: { voltage: 5, label: "BAT1" }, color: "#fbbf24"
    },
    ground: {
      name: "Ground", category: "source", w: 50, h: 35,
      pins: [["GND", 25, 0]],
      props: { label: "GND" }, color: "#34d399"
    },
    resistor: {
      name: "Resistor", category: "passive", w: 100, h: 60,
      pins: [["A", 0, 30], ["B", 100, 30]],
      props: { resistance: 1000, label: "R1" }, color: "#fbbf24"
    },
    capacitor: {
      name: "Capacitor", category: "passive", w: 100, h: 60,
      pins: [["A", 0, 30], ["B", 100, 30]],
      props: { capacitance: 0.000001, label: "C1" }, color: "#60a5fa"
    },
    inductor: {
      name: "Inductor", category: "passive", w: 100, h: 60,
      pins: [["A", 0, 30], ["B", 100, 30]],
      props: { inductance: 0.001, label: "L1" }, color: "#a78bfa"
    },
    switch: {
      name: "Switch", category: "passive", w: 80, h: 60,
      pins: [["A", 0, 30], ["B", 80, 30]],
      props: { closed: true, label: "SW1" }, color: "#fbbf24"
    },
    pushbutton: {
      name: "Push Button", category: "passive", w: 80, h: 60,
      pins: [["A", 0, 30], ["B", 80, 30]],
      props: { pressed: false, label: "BTN1" }, color: "#fbbf24"
    },
    led: {
      name: "LED", category: "output", w: 80, h: 60,
      pins: [["A", 0, 30], ["K", 80, 30]],
      props: { forwardVoltage: 2, maxCurrent: 0.02, label: "LED1" },
      color: "#fb7185"
    },
    diode: {
      name: "Diode", category: "semiconductor", w: 80, h: 60,
      pins: [["A", 0, 30], ["K", 80, 30]],
      props: { forwardVoltage: 0.7, label: "D1" }, color: "#fb7185"
    },
    zener: {
      name: "Zener Diode", category: "semiconductor", w: 80, h: 60,
      pins: [["A", 0, 30], ["K", 80, 30]],
      props: { forwardVoltage: 0.7, zenerVoltage: 5.1, label: "DZ1" },
      color: "#fb7185"
    },
    npn: {
      name: "NPN Transistor", category: "semiconductor", w: 80, h: 80,
      pins: [["B", 0, 40], ["C", 80, 15], ["E", 80, 65]],
      props: { beta: 100, label: "Q1" }, color: "#fb7185"
    },
    pnp: {
      name: "PNP Transistor", category: "semiconductor", w: 80, h: 80,
      pins: [["B", 0, 40], ["C", 80, 15], ["E", 80, 65]],
      props: { beta: 100, label: "Q2" }, color: "#fb7185"
    },
    nmos: {
      name: "N-MOSFET", category: "semiconductor", w: 85, h: 80,
      pins: [["G", 0, 40], ["D", 85, 15], ["S", 85, 65]],
      props: { threshold: 2, rdsOn: 0.1, label: "M1" }, color: "#a78bfa"
    },
    motor: {
      name: "DC Motor", category: "output", w: 80, h: 70,
      pins: [["+", 0, 35], ["−", 80, 35]],
      props: { resistance: 20, label: "MOTOR1" }, color: "#34d399"
    },
    lamp: {
      name: "Lamp", category: "output", w: 80, h: 70,
      pins: [["A", 0, 35], ["B", 80, 35]],
      props: { resistance: 100, label: "LAMP1" }, color: "#fbbf24"
    },
    arduino: {
      name: "Arduino Uno (model)", category: "digital", w: 110, h: 100,
      pins: [["5V", 0, 20], ["GND", 0, 50], ["D2", 110, 20],
             ["D3", 110, 40], ["D4", 110, 60], ["A0", 110, 80]],
      props: { outputVoltage: 5, label: "ARDUINO1" }, color: "#34d399"
    },
    and: {
      name: "AND Gate", category: "digital", w: 80, h: 80,
      pins: [["A", 0, 25], ["B", 0, 55], ["Y", 80, 40]],
      props: { inputA: 0, inputB: 0, label: "AND1" }, color: "#a78bfa"
    },
    or: {
      name: "OR Gate", category: "digital", w: 80, h: 80,
      pins: [["A", 0, 25], ["B", 0, 55], ["Y", 80, 40]],
      props: { inputA: 0, inputB: 0, label: "OR1" }, color: "#a78bfa"
    },
    not: {
      name: "NOT Gate", category: "digital", w: 80, h: 80,
      pins: [["A", 0, 40], ["Y", 80, 40]],
      props: { inputA: 0, label: "NOT1" }, color: "#a78bfa"
    }
  };

  const translations = {
    "Circuit Studio": "පරිපථ නිර්මාණාගාරය",
    "New Project": "නව ව්‍යාපෘතිය",
    "Open Project": "ව්‍යාපෘතිය විවෘත කරන්න",
    "Save Project": "ව්‍යාපෘතිය සුරකින්න",
    "Download Project": "ව්‍යාපෘතිය බාගන්න",
    "Export SVG": "SVG ලෙස අපනයනය",
    "Export PNG": "PNG ලෙස අපනයනය",
    "Clear Board": "වැඩ අවකාශය හිස් කරන්න",
    "Undo": "ආපසු",
    "Redo": "නැවත කරන්න",
    "Components": "ඉලෙක්ට්‍රොනික කොටස්",
    "Search components...": "කොටස් සොයන්න...",
    "All": "සියල්ල",
    "Sources": "විදුලි ප්‍රභව",
    "Passive": "නිෂ්ක්‍රීය කොටස්",
    "Semiconductors": "අර්ධ සන්නායක",
    "Outputs": "ප්‍රතිදාන",
    "Digital": "ඩිජිටල්",
    "Select": "තෝරන්න",
    "Wire": "වයර්",
    "Delete": "මකන්න",
    "Rotate": "කරකවන්න",
    "Fit Canvas": "වැඩ අවකාශයට ගළපන්න",
    "Properties": "ගුණාංග",
    "No component selected": "කොටසක් තෝරා නැත",
    "Run Simulation": "සමාකරණය ක්‍රියාත්මක කරන්න",
    "Stop Simulation": "සමාකරණය නවත්වන්න",
    "DC Operating Point": "DC ක්‍රියාකාරී තත්ත්වය",
    "Node Voltages": "Node වෝල්ටීයතා",
    "Branch Currents": "ශාඛා ධාරා",
    "Voltage (V)": "වෝල්ටීයතාව (V)",
    "Current (A)": "ධාරාව (A)",
    "Power (W)": "බලය (W)",
    "3D View": "3D දසුන",
    "Learning Center": "ඉගෙනුම් මධ්‍යස්ථානය",
    "Ohm's Law": "ඕම් නියමය",
    "Kirchhoff's Laws": "කිර්චොෆ් නියම",
    "Logic Gates": "ලොජික් ගේට්",
    "Close": "වසන්න",
    "Resistance (Ω)": "ප්‍රතිරෝධය (Ω)",
    "Voltage (V)": "වෝල්ටීයතාව (V)",
    "Capacitance (F)": "ධාරිතාව (F)",
    "Inductance (H)": "ප්‍රේරණතාව (H)",
    "Ground": "භූ සම්බන්ධය",
    "DC Battery": "DC බැටරිය",
    "Resistor": "ප්‍රතිරෝධකය",
    "Capacitor": "ධාරිත්‍රකය",
    "Inductor": "ප්‍රේරකය",
    "Switch": "ස්විචය",
    "Push Button": "තල්ලු බොත්තම",
    "LED": "LED බල්බය",
    "Diode": "ඩයෝඩය",
    "Zener Diode": "සීනර් ඩයෝඩය",
    "NPN Transistor": "NPN ට්‍රාන්සිස්ටරය",
    "PNP Transistor": "PNP ට්‍රාන්සිස්ටරය",
    "N-MOSFET": "N-MOSFET",
    "DC Motor": "DC මෝටරය",
    "Lamp": "විදුලි බල්බය",
    "Arduino Uno (model)": "Arduino Uno (ආකෘතිය)",
    "AND Gate": "AND ගේට්",
    "OR Gate": "OR ගේට්",
    "NOT Gate": "NOT ගේට්"
  };

  const clone = value => JSON.parse(JSON.stringify(value));
  const snap = n => Math.round(n / GRID) * GRID;
  const num = (v, fallback = 0) =>
    Number.isFinite(Number(v)) ? Number(v) : fallback;
  const pinId = (id, name) => `${id}:${name}`;
  const partDef = p => library[p.type] || library.resistor;

  function msg(text, error = false) {
    const toast = $("circuitToast");
    if ($("circuitLiveRegion")) $("circuitLiveRegion").textContent = text;
    if (toast) {
      toast.textContent = text;
      toast.hidden = false;
      toast.dataset.type = error ? "error" : "info";
      clearTimeout(msg.timer);
      msg.timer = setTimeout(() => { toast.hidden = true; }, 3000);
    } else {
      console[error ? "error" : "log"](text);
    }
  }

  function svgEl(tag, attrs = {}, text = "") {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
    if (text !== "") el.textContent = text;
    return el;
  }

  /* ---------------- Language ---------------- */

  function translatePage() {
    const lang = state.language;
    document.documentElement.lang = lang === "si" ? "si" : "en";

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (translations[key]) el.textContent = lang === "si" ? translations[key] : key;
    });

    // Translate exact text nodes without destroying buttons, icons or child elements.
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      const original = node.__amdOriginalText || node.nodeValue;
      if (!node.__amdOriginalText) node.__amdOriginalText = original;
      const key = original.trim();
      if (!key || !translations[key]) return;
      const leading = original.match(/^\s*/)?.[0] || "";
      const trailing = original.match(/\s*$/)?.[0] || "";
      const translated = lang === "si" ? translations[key] : key;
      node.nodeValue = leading + translated + trailing;
    });

    document.querySelectorAll("[placeholder]").forEach(el => {
      if (!el.dataset.originalPlaceholder) {
        el.dataset.originalPlaceholder = el.placeholder;
      }
      const original = el.dataset.originalPlaceholder;
      if (translations[original]) {
        el.placeholder = lang === "si" ? translations[original] : original;
      }
    });

    const toggle = $("languageToggle");
    if (toggle) {
      toggle.textContent = lang === "si" ? "English" : "සිංහල";
      toggle.setAttribute("aria-label",
        lang === "si" ? "Switch to English" : "සිංහලට මාරු කරන්න");
    }

    renderAll();
  }
function toggleLanguage() {
  state.language = state.language === "en" ? "si" : "en";

  try {
    localStorage.setItem("amd-circuit-language", state.language);
  } catch (_) {}

  translatePage();

  msg(
    state.language === "si"
      ? "සිංහල භාෂාව තෝරා ගත්තා."
      : "English selected."
  );
}

  /* ---------------- Components and pins ---------------- */

  function createPart(type, x = 500, y = 300) {
    if (!library[type]) return null;
    const props = clone(library[type].props);
    const id = `C${state.nextId++}`;
    const count = state.parts.filter(p => p.type === type).length + 1;
    props.label = props.label.replace(/\d+$/, "") + count;
    return {
      id, type, x: snap(x), y: snap(y),
      rotation: 0, label: props.label, props
    };
  }

  function getPins(part) {
    const d = partDef(part);
    const angle = ((part.rotation || 0) % 360) * Math.PI / 180;
    const cx = d.w / 2, cy = d.h / 2;
    return d.pins.map(([name, x, y]) => {
      const dx = x - cx, dy = y - cy;
      return {
        id: pinId(part.id, name), partId: part.id, name,
        x: part.x + cx + dx * Math.cos(angle) - dy * Math.sin(angle),
        y: part.y + cy + dx * Math.sin(angle) + dy * Math.cos(angle)
      };
    });
  }

  function allPins() {
    return state.parts.flatMap(getPins);
  }

  function getPin(id) {
    return allPins().find(p => p.id === id);
  }

  function pointFromEvent(event) {
    const svg = $("circuitSvg");
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const matrix = svg.getScreenCTM();
    if (!matrix) return { x: 0, y: 0 };
    const p = point.matrixTransform(matrix.inverse());
    return {
      x: (p.x - state.panX) / state.zoom,
      y: (p.y - state.panY) / state.zoom
    };
  }

  function nearestPin(point, max = 20) {
    let found = null;
    let distance = max;
    allPins().forEach(pin => {
      const d = Math.hypot(pin.x - point.x, pin.y - point.y);
      if (d < distance) {
        distance = d;
        found = pin;
      }
    });
    return found;
  }

  function ensureLayers() {
    const svg = $("circuitSvg");
    if (!svg) return false;
    const layerIds = [
      "canvasBackground", "wireLayer", "componentLayer",
      "pinLayer", "selectionLayer", "previewLayer"
    ];
    layerIds.forEach(id => {
      if (!$(id)) svg.appendChild(svgEl("g", { id }));
    });
    let root = $("canvasRoot");
    if (!root) {
      root = svgEl("g", { id: "canvasRoot" });
      svg.appendChild(root);
      layerIds.forEach(id => root.appendChild($(id)));
    }
    return true;
  }

  function drawGrid() {
    const layer = $("canvasBackground");
    if (!layer) return;
    layer.replaceChildren();
    layer.appendChild(svgEl("rect", {
      x: 0, y: 0, width: 1200, height: 800, fill: "#0e172a"
    }));
    const defs = svgEl("defs");
    const pattern = svgEl("pattern", {
      id: "amdGrid", width: GRID, height: GRID, patternUnits: "userSpaceOnUse"
    });
    pattern.appendChild(svgEl("circle", {
      cx: 1, cy: 1, r: 1, fill: "#35445f"
    }));
    defs.appendChild(pattern);
    layer.appendChild(defs);
    layer.appendChild(svgEl("rect", {
      x: 0, y: 0, width: 1200, height: 800, fill: "url(#amdGrid)"
    }));
  }

  function addText(group, x, y, text, color = "#e5edff", size = 11) {
    group.appendChild(svgEl("text", {
      x, y, fill: color, "font-size": size,
      "text-anchor": "middle", "pointer-events": "none"
    }, text));
  }

  function drawSymbol(p, g) {
    const d = partDef(p);
    const c = d.color;
    const line = {
      fill: "none", stroke: c, "stroke-width": 2.2,
      "stroke-linecap": "round", "stroke-linejoin": "round"
    };
    const add = (tag, attrs, text) => g.appendChild(svgEl(tag, attrs, text));

    switch (p.type) {
      case "resistor":
        add("line", { x1: 0, y1: 30, x2: 17, y2: 30, ...line });
        add("rect", { x: 17, y: 20, width: 66, height: 20, rx: 3,
          fill: "#fbbf2418", ...line });
        add("line", { x1: 83, y1: 30, x2: 100, y2: 30, ...line });
        break;
      case "battery":
        add("line", { x1: 0, y1: 30, x2: 22, y2: 30, ...line });
        add("line", { x1: 22, y1: 12, x2: 22, y2: 48, ...line });
        add("line", { x1: 36, y1: 19, x2: 36, y2: 41, ...line });
        add("line", { x1: 36, y1: 30, x2: 80, y2: 30, ...line });
        addText(g, 22, 9, "+", c, 11);
        addText(g, 36, 56, "−", c, 11);
        break;
      case "ground":
        add("line", { x1: 25, y1: 0, x2: 25, y2: 9, ...line });
        add("line", { x1: 10, y1: 9, x2: 40, y2: 9, ...line });
        add("line", { x1: 15, y1: 16, x2: 35, y2: 16, ...line });
        add("line", { x1: 20, y1: 23, x2: 30, y2: 23, ...line });
        break;
      case "capacitor":
        add("line", { x1: 0, y1: 30, x2: 40, y2: 30, ...line });
        add("line", { x1: 40, y1: 12, x2: 40, y2: 48, ...line });
        add("line", { x1: 50, y1: 12, x2: 50, y2: 48, ...line });
        add("line", { x1: 50, y1: 30, x2: 100, y2: 30, ...line });
        break;
      case "inductor":
        add("line", { x1: 0, y1: 30, x2: 12, y2: 30, ...line });
        [20, 35, 50, 65, 80].forEach(x =>
          add("path", { d: `M${x - 8} 30 a8 8 0 0 1 16 0`, ...line }));
        add("line", { x1: 88, y1: 30, x2: 100, y2: 30, ...line });
        break;
      case "switch":
      case "pushbutton": {
        const closed = p.type === "switch" ? p.props.closed : p.props.pressed;
        add("line", { x1: 0, y1: 30, x2: 20, y2: 30, ...line });
        add("circle", { cx: 20, cy: 30, r: 3, fill: c });
        add("circle", { cx: 60, cy: 30, r: 3, fill: c });
        add("line", { x1: 20, y1: 30, x2: closed ? 60 : 52,
          y2: closed ? 30 : 15, ...line });
        add("line", { x1: 60, y1: 30, x2: 80, y2: 30, ...line });
        break;
      }
      case "led":
      case "diode":
      case "zener":
        add("line", { x1: 0, y1: 30, x2: 22, y2: 30, ...line });
        add("path", { d: "M22 15 L22 45 L52 30 Z", fill: `${c}22`, ...line });
        add("line", { x1: 53, y1: 14, x2: 53, y2: 46, ...line });
        add("line", { x1: 53, y1: 30, x2: 80, y2: 30, ...line });
        if (p.type === "led") {
          add("path", { d: "M36 12 L45 3 M40 3 L45 3 L45 8 M45 18 L54 9 M49 9 L54 9 L54 14", ...line });
          if (p.props.lit) add("circle", {
            cx: 40, cy: 30, r: 27, fill: "#fb718522", stroke: "none"
          });
        }
        break;
      case "npn":
      case "pnp":
        add("circle", { cx: 40, cy: 40, r: 27, ...line });
        add("line", { x1: 10, y1: 40, x2: 35, y2: 40, ...line });
        add("line", { x1: 35, y1: 19, x2: 35, y2: 61, ...line });
        add("line", { x1: 35, y1: 25, x2: 62, y2: 8, ...line });
        add("line", { x1: 62, y1: 8, x2: 62, y2: 0, ...line });
        add("line", { x1: 35, y1: 53, x2: 62, y2: 72, ...line });
        add("line", { x1: 62, y1: 72, x2: 62, y2: 80, ...line });
        add("path", { d: p.type === "npn"
          ? "M49 60 L62 72 L45 68 Z" : "M46 22 L35 25 L42 34 Z",
          fill: c, stroke: "none" });
        break;
      case "nmos":
        add("line", { x1: 20, y1: 15, x2: 20, y2: 65, ...line });
        add("line", { x1: 0, y1: 40, x2: 15, y2: 40, ...line });
        add("line", { x1: 35, y1: 13, x2: 35, y2: 30, ...line });
        add("line", { x1: 35, y1: 50, x2: 35, y2: 67, ...line });
        add("line", { x1: 35, y1: 13, x2: 85, y2: 15, ...line });
        add("line", { x1: 35, y1: 67, x2: 85, y2: 65, ...line });
        add("line", { x1: 35, y1: 30, x2: 35, y2: 50, ...line });
        break;
      case "motor":
        add("line", { x1: 0, y1: 35, x2: 18, y2: 35, ...line });
        add("circle", { cx: 40, cy: 35, r: 22, ...line });
        addText(g, 40, 40, "M", c, 15);
        add("line", { x1: 62, y1: 35, x2: 80, y2: 35, ...line });
        break;
      case "lamp":
        add("line", { x1: 0, y1: 35, x2: 19, y2: 35, ...line });
        add("circle", { cx: 40, cy: 35, r: 21,
          fill: p.props.lit ? "#fbbf2440" : "none", ...line });
        add("path", { d: "M25 20 L55 50 M55 20 L25 50", ...line });
        add("line", { x1: 61, y1: 35, x2: 80, y2: 35, ...line });
        break;
      case "arduino":
        add("rect", { x: 8, y: 5, width: 94, height: 90, rx: 7,
          fill: "#10b98115", ...line });
        add("rect", { x: 27, y: 25, width: 48, height: 38, rx: 3,
          fill: "#0e172a", ...line });
        addText(g, 51, 41, "ARDUINO", c, 8);
        addText(g, 51, 53, "UNO", c, 10);
        break;
      case "and":
      case "or":
      case "not":
        add("rect", { x: 10, y: 12, width: 60, height: 56, rx: 7,
          fill: "#a78bfa12", ...line });
        addText(g, 40, 43, p.type.toUpperCase(), c, 12);
        break;
    }

    if (p.type !== "ground") {
      addText(g, d.w / 2, d.h + 14, p.label, "#e5edff", 11);
      const value = p.type === "battery" ? `${p.props.voltage} V`
        : ["resistor", "motor", "lamp"].includes(p.type) ? `${p.props.resistance} Ω`
        : p.type === "led" || p.type === "diode" || p.type === "zener"
          ? `${p.props.forwardVoltage} V` : "";
      if (value) addText(g, d.w / 2, d.h + 28, value, "#91a5c5", 9);
    }
  }

  function renderParts() {
    const layer = $("componentLayer");
    const selectedLayer = $("selectionLayer");
    layer.replaceChildren();
    selectedLayer.replaceChildren();

    state.parts.forEach(p => {
      const d = partDef(p);
      const g = svgEl("g", {
        transform: `translate(${p.x} ${p.y}) rotate(${p.rotation || 0} ${d.w / 2} ${d.h / 2})`,
        "data-component-id": p.id,
        "data-part-body": p.id,
        cursor: state.tool === "delete" ? "not-allowed" : "move"
      });
      // Large transparent hit target makes selection/dragging easier.
      g.appendChild(svgEl("rect", {
        x: -8, y: -8, width: d.w + 16, height: d.h + 40,
        fill: "transparent", stroke: "transparent",
        "data-part-body": p.id
      }));
      drawSymbol(p, g);
      layer.appendChild(g);

      if (state.selected === p.id) {
        selectedLayer.appendChild(svgEl("rect", {
          x: p.x - 8, y: p.y - 8, width: d.w + 16, height: d.h + 40,
          rx: 7, fill: "none", stroke: "#60a5fa",
          "stroke-width": 1.5, "stroke-dasharray": "5 4",
          "pointer-events": "none"
        }));
      }
    });
  }

  function renderWires() {
    const layer = $("wireLayer");
    layer.replaceChildren();

    state.wires.forEach(w => {
      const a = getPin(w.from), b = getPin(w.to);
      if (!a || !b) return;
      const mx = snap((a.x + b.x) / 2);
      const d = `M${a.x} ${a.y} L${mx} ${a.y} L${mx} ${b.y} L${b.x} ${b.y}`;

      // Wide transparent hit path makes deleting/selecting a wire easier.
      layer.appendChild(svgEl("path", {
        d, fill: "none", stroke: "transparent", "stroke-width": 14,
        "data-wire-id": w.id, cursor: "pointer"
      }));
      layer.appendChild(svgEl("path", {
        d, fill: "none", stroke: w.color || "#4ea1ff",
        "stroke-width": state.selected === w.id ? 4 : 2.5,
        "stroke-linejoin": "round", "stroke-linecap": "round",
        "pointer-events": "none"
      }));
    });
  }

  function renderPins() {
    const layer = $("pinLayer");
    layer.replaceChildren();

    allPins().forEach(pin => {
      const g = svgEl("g", {
        "data-pin-id": pin.id,
        "data-component-id": pin.partId,
        cursor: state.tool === "wire" ? "crosshair" : "pointer"
      });
      g.appendChild(svgEl("circle", {
        cx: pin.x, cy: pin.y, r: 12,
        fill: "transparent", stroke: "transparent",
        "data-pin-id": pin.id
      }));
      g.appendChild(svgEl("circle", {
        cx: pin.x, cy: pin.y, r: 4,
        fill: state.wireStart === pin.id ? "#00e5ff" : "#0e172a",
        stroke: "#b8c9e8", "stroke-width": 1.5,
        "pointer-events": "none"
      }));
      addText(g, pin.x, pin.y - 9, pin.name, "#a8b8d6", 8);
      layer.appendChild(g);
    });
  }

  function renderPreview() {
    const layer = $("previewLayer");
    if (!layer) return;
    layer.replaceChildren();
    if (!state.wireStart || !state.previewPoint) return;

    const start = getPin(state.wireStart);
    if (!start) return;
    const end = state.previewPoint;
    const mx = snap((start.x + end.x) / 2);
    layer.appendChild(svgEl("path", {
      d: `M${start.x} ${start.y} L${mx} ${start.y} L${mx} ${end.y} L${end.x} ${end.y}`,
      fill: "none", stroke: "#00d9ff", "stroke-width": 2,
      "stroke-dasharray": "5 4", "pointer-events": "none"
    }));
  }

  function renderAll() {
    if (!$("circuitSvg")) return;
    ensureLayers();
    drawGrid();
    renderWires();
    renderParts();
    renderPins();
    renderPreview();

    const root = $("canvasRoot");
    if (root) root.setAttribute("transform",
      `translate(${state.panX} ${state.panY}) scale(${state.zoom})`);

    if ($("zoomValue")) $("zoomValue").textContent = `${Math.round(state.zoom * 100)}%`;
    if ($("emptyBoardMessage")) $("emptyBoardMessage").hidden = state.parts.length > 0;
    updateInspector();
    updateHistoryButtons();
  }

  /* ---------------- Add, move, wire, delete ---------------- */

  function addPart(type, x, y) {
    if (!library[type]) return;
    const svg = $("circuitSvg");
    if (x === undefined || y === undefined) {
      const rect = svg.getBoundingClientRect();
      const center = svg.createSVGPoint();
      center.x = rect.left + rect.width / 2;
      center.y = rect.top + rect.height / 2;
      const matrix = svg.getScreenCTM();
      const p = center.matrixTransform(matrix.inverse());
      x = (p.x - state.panX) / state.zoom;
      y = (p.y - state.panY) / state.zoom;
    }

    pushHistory();
    const part = createPart(type, x, y);
    if (!part) return;
    state.parts.push(part);
    state.selected = part.id;
    state.simulation = null;
    setTool("select");
    renderAll();
    msg(`${part.label} added.`);
  }

  function connectPin(pin) {
    if (!state.wireStart) {
      state.wireStart = pin.id;
      state.previewPoint = { x: pin.x, y: pin.y };
      renderPins();
      renderPreview();
      msg(state.language === "si"
        ? "පළමු pin එක තෝරා ඇත. දැන් දෙවන pin එක තෝරන්න."
        : "First pin selected. Select the destination pin.");
      return;
    }

    if (state.wireStart === pin.id) {
      state.wireStart = null;
      state.previewPoint = null;
      renderAll();
      return;
    }

    if (state.wires.some(w =>
      (w.from === state.wireStart && w.to === pin.id) ||
      (w.to === state.wireStart && w.from === pin.id))) {
      state.wireStart = null;
      state.previewPoint = null;
      renderAll();
      msg("Those pins are already connected.");
      return;
    }

    pushHistory();
    state.wires.push({
      id: `W${state.nextId++}`, from: state.wireStart,
      to: pin.id, color: "#4ea1ff"
    });
    state.wireStart = null;
    state.previewPoint = null;
    state.simulation = null;
    renderAll();
    msg(state.language === "si" ? "වයරය සම්බන්ධ කළා." : "Wire connected.");
  }

  function setTool(tool) {
    state.tool = tool;
    state.wireStart = null;
    state.previewPoint = null;

    const ids = { selectTool: "select", wireTool: "wire", deleteTool: "delete" };
    Object.entries(ids).forEach(([id, value]) =>
      $(id)?.classList.toggle("active", tool === value));

    if ($("circuitSvg")) {
      $("circuitSvg").style.cursor =
        tool === "wire" ? "crosshair" : tool === "delete" ? "not-allowed" : "default";
    }
    renderAll();
  }

  function deletePart(id) {
    pushHistory();
    state.parts = state.parts.filter(p => p.id !== id);
    state.wires = state.wires.filter(w =>
      !w.from.startsWith(`${id}:`) && !w.to.startsWith(`${id}:`));
    state.selected = null;
    state.simulation = null;
    renderAll();
  }

  function deleteWire(id) {
    pushHistory();
    state.wires = state.wires.filter(w => w.id !== id);
    state.selected = null;
    state.simulation = null;
    renderAll();
  }

  /* ---------------- Properties ---------------- */

  function updateInspector() {
    const part = state.parts.find(p => p.id === state.selected);
    if ($("noSelectionMessage")) $("noSelectionMessage").hidden = !!part;
    if ($("componentProperties")) $("componentProperties").hidden = !part;
    if (!part) return;

    if ($("selectedComponentId")) $("selectedComponentId").textContent = part.id;
    if ($("componentLabel")) $("componentLabel").value = part.label;
    if ($("componentModel")) $("componentModel").value = part.model || "default";

    const container = $("dynamicPropertyFields");
    if (!container) return;
    container.replaceChildren();

    const specs = {
      battery: [["voltage", "Voltage (V)", 0.1]],
      resistor: [["resistance", "Resistance (Ω)", 1]],
      capacitor: [["capacitance", "Capacitance (F)", 0.000001]],
      inductor: [["inductance", "Inductance (H)", 0.001]],
      led: [["forwardVoltage", "Forward voltage (V)", 0.1], ["maxCurrent", "Maximum current (A)", 0.001]],
      diode: [["forwardVoltage", "Forward voltage (V)", 0.1]],
      zener: [["forwardVoltage", "Forward voltage (V)", 0.1], ["zenerVoltage", "Zener voltage (V)", 0.1]],
      motor: [["resistance", "Resistance (Ω)", 1]],
      lamp: [["resistance", "Resistance (Ω)", 1]],
      npn: [["beta", "Current gain β", 1]],
      pnp: [["beta", "Current gain β", 1]],
      nmos: [["threshold", "Threshold voltage (V)", 0.1], ["rdsOn", "On resistance (Ω)", 0.1]],
      arduino: [["outputVoltage", "Logic voltage (V)", 0.1]],
      and: [["inputA", "Input A (0/1)", 1], ["inputB", "Input B (0/1)", 1]],
      or: [["inputA", "Input A (0/1)", 1], ["inputB", "Input B (0/1)", 1]],
      not: [["inputA", "Input A (0/1)", 1]]
    }[part.type] || [];

    specs.forEach(([key, label, step]) => {
      const wrap = document.createElement("div");
      wrap.className = "property-field";
      const lab = document.createElement("label");
      lab.textContent = label;
      const input = document.createElement("input");
      input.type = "number";
      input.step = step;
      input.value = part.props[key] ?? "";
      if (key.startsWith("input")) {
        input.min = "0";
        input.max = "1";
      }
      input.addEventListener("change", () => {
        pushHistory();
        let value = num(input.value, part.props[key]);
        if (key.startsWith("input")) value = Math.max(0, Math.min(1, Math.round(value)));
        part.props[key] = value;
        state.simulation = null;
        renderAll();
      });
      wrap.append(lab, input);
      container.appendChild(wrap);
    });

    if (["switch", "pushbutton"].includes(part.type)) {
      const wrap = document.createElement("div");
      wrap.className = "property-field";
      const label = document.createElement("label");
      label.textContent = part.type === "switch" ? "Closed" : "Pressed";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = !!part.props[part.type === "switch" ? "closed" : "pressed"];
      checkbox.addEventListener("change", () => {
        pushHistory();
        part.props[part.type === "switch" ? "closed" : "pressed"] = checkbox.checked;
        renderAll();
      });
      wrap.append(label, checkbox);
      container.appendChild(wrap);
    }
  }

  /* ---------------- Undo / redo ---------------- */

  function snapshot() {
    return JSON.stringify({
      parts: state.parts, wires: state.wires,
      nextId: state.nextId, projectName: $("projectName")?.value || "Circuit"
    });
  }

  function pushHistory() {
    const snap = snapshot();
    if (state.history[state.historyIndex] === snap) return;
    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(snap);
    if (state.history.length > 50) state.history.shift();
    state.historyIndex = state.history.length - 1;
    updateHistoryButtons();
  }

  function restoreHistory(index) {
    if (index < 0 || index >= state.history.length) return;
    const data = JSON.parse(state.history[index]);
    state.historyIndex = index;
    state.parts = data.parts || [];
    state.wires = data.wires || [];
    state.nextId = data.nextId || 1;
    if ($("projectName")) $("projectName").value = data.projectName || "Circuit";
    state.selected = null;
    state.simulation = null;
    renderAll();
  }

  function updateHistoryButtons() {
    if ($("undoButton")) $("undoButton").disabled = state.historyIndex <= 0;
    if ($("redoButton")) $("redoButton").disabled =
      state.historyIndex >= state.history.length - 1;
  }

  /* ---------------- Save / load / export ---------------- */

  function projectData() {
    return {
      format: "AMDS-CircuitStudio",
      version: 2,
      projectName: $("projectName")?.value || "Untitled Circuit",
      components: state.parts,
      wires: state.wires,
      nextId: state.nextId,
      savedAt: new Date().toISOString()
    };
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function saveProject() {
    const data = projectData();
    try { localStorage.setItem(STORAGE, JSON.stringify(data)); } catch (_) {}
    const name = (data.projectName.replace(/[^\w-]+/g, "-") || "circuit");
    download(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
      `${name}.amdcircuit.json`);
    msg("Project saved and downloaded.");
  }

  function loadProject(data) {
    if (!data || !Array.isArray(data.components) || !Array.isArray(data.wires)) {
      msg("Invalid project file.", true);
      return;
    }
    pushHistory();
    state.parts = data.components.filter(p => library[p.type]).map(p => ({
      ...p,
      props: { ...clone(library[p.type].props), ...(p.props || {}) }
    }));

    const valid = new Set(allPins().map(p => p.id));
    state.wires = data.wires.filter(w => valid.has(w.from) && valid.has(w.to));
    state.nextId = Math.max(1, num(data.nextId, 1));
    if ($("projectName")) $("projectName").value = data.projectName || "Untitled Circuit";
    state.selected = null;
    state.simulation = null;
    pushHistory();
    renderAll();
    msg("Project loaded.");
  }

  function exportSVG() {
    const svg = $("circuitSvg");
    if (!svg) return;
    const copy = svg.cloneNode(true);
    copy.setAttribute("xmlns", NS);
    copy.setAttribute("width", "1200");
    copy.setAttribute("height", "800");
    download(new Blob([new XMLSerializer().serializeToString(copy)],
      { type: "image/svg+xml;charset=utf-8" }), "circuit-schematic.svg");
  }

  function exportPNG() {
    const svg = $("circuitSvg");
    if (!svg) return;
    const copy = svg.cloneNode(true);
    copy.setAttribute("xmlns", NS);
    copy.setAttribute("width", "1200");
    copy.setAttribute("height", "800");
    const url = URL.createObjectURL(new Blob([
      new XMLSerializer().serializeToString(copy)
    ], { type: "image/svg+xml;charset=utf-8" }));

    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 2400;
      canvas.height = 1600;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#0e172a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) download(blob, "circuit-schematic.png");
        URL.revokeObjectURL(url);
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      msg("PNG export failed; try SVG.", true);
    };
    image.src = url;
  }

  /* ---------------- Basic DC solver ----------------
     Educational linear DC approximation.
     Capacitors = open circuit; inductors = short circuit.
     Transistor/MOSFET and Arduino firmware are not solved.
  --------------------------------------------------- */

  function solveLinear(A, b) {
    const n = b.length;
    const m = A.map((row, i) => [...row, b[i]]);
    for (let c = 0; c < n; c++) {
      let pivot = c;
      for (let r = c + 1; r < n; r++) {
        if (Math.abs(m[r][c]) > Math.abs(m[pivot][c])) pivot = r;
      }
      if (Math.abs(m[pivot][c]) < 1e-11) {
        throw new Error("Singular circuit. Check ground, connections, and shorts.");
      }
      [m[c], m[pivot]] = [m[pivot], m[c]];
      const d = m[c][c];
      for (let j = c; j <= n; j++) m[c][j] /= d;
      for (let r = 0; r < n; r++) {
        if (r === c) continue;
        const f = m[r][c];
        for (let j = c; j <= n; j++) m[r][j] -= f * m[c][j];
      }
    }
    return m.map(row => row[n]);
  }

  function solveDC() {
    const supported = state.parts.filter(p => [
      "battery", "resistor", "motor", "lamp", "switch",
      "pushbutton", "capacitor", "inductor"
    ].includes(p.type));
    const batteries = supported.filter(p => p.type === "battery");
    if (!batteries.length) throw new Error("Add a DC battery first.");

    const ids = allPins().map(p => p.id);
    const parent = new Map(ids.map(id => [id, id]));
    const find = x => {
      if (parent.get(x) !== x) parent.set(x, find(parent.get(x)));
      return parent.get(x);
    };
    const union = (a, b) => {
      a = find(a); b = find(b);
      if (a !== b) parent.set(b, a);
    };
    state.wires.forEach(w => union(w.from, w.to));

    const groundPart = state.parts.find(p => p.type === "ground");
    let ground = groundPart ? find(getPins(groundPart)[0].id) : null;
    const warnings = [];
    if (!ground) {
      ground = find(getPins(batteries[0]).find(p => p.name === "−").id);
      warnings.push("No ground symbol: first battery negative used as reference.");
    }

    const roots = [...new Set(ids.map(find))];
    const nodes = roots.filter(r => r !== ground);
    const nodeIndex = new Map(nodes.map((r, i) => [r, i]));
    const sourceIndex = new Map(batteries.map((p, i) => [p.id, nodes.length + i]));
    const n = nodes.length + batteries.length;
    if (!n) throw new Error("No circuit nodes to solve.");

    const A = Array.from({ length: n }, () => Array(n).fill(0));
    const b = Array(n).fill(0);
    const idx = root => nodeIndex.get(root);
    const stampG = (ra, rb, g) => {
      const a = idx(ra), c = idx(rb);
      if (a !== undefined) A[a][a] += g;
      if (c !== undefined) A[c][c] += g;
      if (a !== undefined && c !== undefined) {
        A[a][c] -= g; A[c][a] -= g;
      }
    };

    supported.forEach(p => {
      const pins = getPins(p);
      const a = find(pins[0].id), c = find(pins[1].id);
      if (p.type === "battery") {
        if (a === c) throw new Error(`${p.label}: battery terminals are shorted.`);
        const k = sourceIndex.get(p.id);
        const ia = idx(a), ic = idx(c);
        if (ia !== undefined) { A[ia][k] += 1; A[k][ia] += 1; }
        if (ic !== undefined) { A[ic][k] -= 1; A[k][ic] -= 1; }
        b[k] += num(p.props.voltage, 5);
      } else if (["resistor", "motor", "lamp"].includes(p.type)) {
        const r = num(p.props.resistance, 1000);
        if (r <= 0) throw new Error(`${p.label}: resistance must be positive.`);
        stampG(a, c, 1 / r);
      } else if (p.type === "switch" || p.type === "pushbutton") {
        const closed = p.type === "switch" ? p.props.closed : p.props.pressed;
        if (closed) stampG(a, c, 1e6);
      } else if (p.type === "inductor") {
        stampG(a, c, 1e6);
        warnings.push(`${p.label}: ideal inductor approximated as a DC short.`);
      } else if (p.type === "capacitor") {
        warnings.push(`${p.label}: capacitor approximated as an open circuit at DC.`);
      }
    });

    const solution = solveLinear(A, b);
    const volts = new Map([[ground, 0]]);
    nodes.forEach(root => volts.set(root, solution[idx(root)]));

    const nodeRows = roots.map((root, i) => ({
      name: `N${i}${root === ground ? " (GND)" : ""}`,
      voltage: volts.get(root) ?? 0
    }));
    const branchRows = supported.map(p => {
      const pins = getPins(p);
      const va = volts.get(find(pins[0].id)) ?? 0;
      const vb = volts.get(find(pins[1].id)) ?? 0;
      const v = va - vb;
      let current = null;
      if (["resistor", "motor", "lamp"].includes(p.type)) {
        current = v / num(p.props.resistance, 1000);
      } else if (p.type === "battery") {
        current = solution[sourceIndex.get(p.id)] ?? 0;
      } else if (p.type === "switch" || p.type === "pushbutton") {
        const closed = p.type === "switch" ? p.props.closed : p.props.pressed;
        current = closed ? v * 1e6 : 0;
      } else if (p.type === "capacitor") {
        current = 0;
      }
      return { name: p.label, voltage: v, current, power: current === null ? null : v * current };
    });

    state.parts.filter(p => ["and", "or", "not"].includes(p.type)).forEach(p => {
      const a = num(p.props.inputA) ? 1 : 0;
      const b = num(p.props.inputB) ? 1 : 0;
      p.props.outputY = p.type === "and" ? (a & b) : p.type === "or" ? (a | b) : (a ? 0 : 1);
      warnings.push(`${p.label}: logic is evaluated separately from the DC circuit.`);
    });
    state.parts.filter(p => ["led", "diode", "zener"].includes(p.type)).forEach(p =>
      warnings.push(`${p.label}: diode current is not included in this solver yet.`));
    state.parts.filter(p => ["npn", "pnp", "nmos", "arduino"].includes(p.type)).forEach(p =>
      warnings.push(`${p.label}: this part is visualized but not electrically simulated.`));

    return { nodeRows, branchRows, warnings: [...new Set(warnings)], iterations: 1, converged: true };
  }

  function fmt(v) {
    if (v === null || v === undefined || !Number.isFinite(v)) return "—";
    return Math.abs(v) >= 1e6 || (v !== 0 && Math.abs(v) < 1e-4)
      ? v.toExponential(3) : v.toFixed(5);
  }

  function fillTable(id, headers, rows) {
    const table = $(id);
    if (!table) return;
    table.replaceChildren();
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    headers.forEach(h => {
      const th = document.createElement("th");
      th.textContent = h;
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    if (!rows.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = headers.length;
      cell.textContent = "No results yet.";
      row.appendChild(cell);
      tbody.appendChild(row);
    } else {
      rows.forEach(data => {
        const row = document.createElement("tr");
        data.forEach(value => {
          const cell = document.createElement("td");
          cell.textContent = value;
          row.appendChild(cell);
        });
        tbody.appendChild(row);
      });
    }
    table.appendChild(tbody);
  }

  function showSimulation(result) {
    state.simulation = result;
    if ($("nodeCount")) $("nodeCount").textContent = result.nodeRows.length;
    if ($("branchCount")) $("branchCount").textContent = result.branchRows.length;
    if ($("iterationCount")) $("iterationCount").textContent = result.iterations;
    if ($("convergenceStatus")) $("convergenceStatus").textContent = "Solved";
    if ($("simulationStateText")) $("simulationStateText").textContent = "DC result calculated";
    if ($("simulationError")) $("simulationError").hidden = true;

    fillTable("nodeVoltageTable", ["Node", "Voltage (V)"],
      result.nodeRows.map(r => [r.name, fmt(r.voltage)]));
    fillTable("branchCurrentTable", ["Component", "Voltage (V)", "Current (A)", "Power (W)"],
      result.branchRows.map(r => [r.name, fmt(r.voltage), fmt(r.current), fmt(r.power)]));

    const list = $("circuitValidationList");
    if (list) {
      list.replaceChildren();
      const messages = ["DC linear analysis finished.", ...result.warnings];
      messages.forEach((text, i) => {
        const li = document.createElement("li");
        li.textContent = text;
        li.className = i === 0 ? "validation-success" : "validation-warning";
        list.appendChild(li);
      });
    }
    renderAll();
  }

  function runSimulation() {
    try {
      showSimulation(solveDC());
    } catch (error) {
      if ($("simulationStateText")) $("simulationStateText").textContent = "Simulation failed";
      if ($("simulationError")) $("simulationError").hidden = false;
      if ($("simulationErrorText")) $("simulationErrorText").textContent = error.message;
      msg(error.message, true);
    }
  }

  /* ---------------- Search and category filters ---------------- */

  function filterLibrary() {
    const query = ($("componentSearch")?.value || "").toLowerCase().trim();
    const activeCategory = document.querySelector(".category-button.active")?.dataset.category || "all";

    document.querySelectorAll(".component-item").forEach(el => {
      const type = el.dataset.part;
      const d = library[type];
      if (!d) { el.hidden = true; return; }
      const categoryMatch = activeCategory === "all" ||
        activeCategory === d.category || activeCategory === type;
      const queryMatch = `${type} ${d.name} ${d.category}`.toLowerCase().includes(query);
      el.hidden = !(categoryMatch && queryMatch);
    });
  }

  /* ---------------- Bind all controls ---------------- */

  function bindEvents() {
    // Library buttons: click-to-add and drag-and-drop.
    document.querySelectorAll("[data-part]").forEach(el => {
      el.setAttribute("draggable", "true");
      el.addEventListener("click", () => {
        if (el.dataset.part) addPart(el.dataset.part);
      });
      el.addEventListener("dragstart", event => {
        event.dataTransfer?.setData("application/x-amd-circuit-part", el.dataset.part);
        if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
      });
    });

    document.querySelectorAll(".category-button").forEach(el => {
      el.addEventListener("click", () => {
        document.querySelectorAll(".category-button").forEach(b =>
          b.classList.toggle("active", b === el));
        filterLibrary();
      });
    });
    $("componentSearch")?.addEventListener("input", filterLibrary);

    $("selectTool")?.addEventListener("click", () => setTool("select"));
    $("wireTool")?.addEventListener("click", () => setTool("wire"));
    $("deleteTool")?.addEventListener("click", () => setTool("delete"));

    $("rotateButton")?.addEventListener("click", () => {
      const p = state.parts.find(p => p.id === state.selected);
      if (!p) return msg("Select a component first.");
      pushHistory();
      p.rotation = ((p.rotation || 0) + 90) % 360;
      renderAll();
    });

    $("zoomIn")?.addEventListener("click", () => {
      state.zoom = Math.min(3.5, state.zoom * 1.2); renderAll();
    });
    $("zoomOut")?.addEventListener("click", () => {
      state.zoom = Math.max(0.35, state.zoom / 1.2); renderAll();
    });
    $("fitCanvas")?.addEventListener("click", () => {
      state.zoom = 1; state.panX = 0; state.panY = 0; renderAll();
    });

    $("languageToggle")?.addEventListener("click", toggleLanguage);
    $("saveProjectButton")?.addEventListener("click", saveProject);
    $("downloadProjectButton")?.addEventListener("click", saveProject);
    $("exportSvgButton")?.addEventListener("click", exportSVG);
    $("exportPngButton")?.addEventListener("click", exportPNG);

    $("openProjectButton")?.addEventListener("click", () => $("projectFileInput")?.click());
    $("projectFileInput")?.addEventListener("change", async e => {
      const file = e.target.files?.[0];
      if (!file) return;
      try { loadProject(JSON.parse(await file.text())); }
      catch (_) { msg("Unable to read that project file.", true); }
      e.target.value = "";
    });

    $("newProjectButton")?.addEventListener("click", () => {
      if ((state.parts.length || state.wires.length) &&
          !confirm("Start a new project? Save your work first if needed.")) return;
      pushHistory();
      state.parts = []; state.wires = []; state.selected = null;
      state.simulation = null; state.nextId = 1;
      if ($("projectName")) $("projectName").value = "Untitled Circuit";
      pushHistory(); renderAll();
    });

    $("undoButton")?.addEventListener("click", () => restoreHistory(state.historyIndex - 1));
    $("redoButton")?.addEventListener("click", () => restoreHistory(state.historyIndex + 1));
    $("clearBoardButton")?.addEventListener("click", () => {
      if (!confirm("Clear all components and wires?")) return;
      pushHistory();
      state.parts = []; state.wires = []; state.selected = null;
      state.simulation = null; renderAll();
    });

    $("componentLabel")?.addEventListener("change", () => {
      const p = state.parts.find(p => p.id === state.selected);
      if (!p) return;
      pushHistory();
      p.label = $("componentLabel").value.trim() || p.type;
      p.props.label = p.label;
      renderAll();
    });

    $("resetPropertiesButton")?.addEventListener("click", () => {
      const p = state.parts.find(p => p.id === state.selected);
      if (!p) return;
      pushHistory();
      p.props = clone(library[p.type].props);
      p.label = p.props.label;
      renderAll();
    });

    $("runSimulationButton")?.addEventListener("click", runSimulation);
    $("stopSimulationButton")?.addEventListener("click", () => msg("No background simulation is running."));

    $("mobileMenuToggle")?.addEventListener("click", () =>
      $("circuitNavLinks")?.classList.toggle("open"));

    $("themeToggle")?.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
    });

    // Delegated workspace events. Do not re-render while the mouse is dragging:
    // that was one of the main reasons the earlier drag implementation failed.
    const svg = $("circuitSvg");
    if (!svg) return;

    svg.addEventListener("dragover", event => event.preventDefault());
    svg.addEventListener("drop", event => {
      event.preventDefault();
      const type = event.dataTransfer?.getData("application/x-amd-circuit-part");
      if (!library[type]) return;
      const point = pointFromEvent(event);
      addPart(type, point.x, point.y);
    });

    svg.addEventListener("pointerdown", event => {
      if (event.button !== 0) return;
      const point = pointFromEvent(event);

      const wireTarget = event.target.closest?.("[data-wire-id]");
      if (wireTarget) {
        const id = wireTarget.dataset.wireId;
        if (state.tool === "delete") return deleteWire(id);
        state.selected = id;
        renderAll();
        return;
      }

      const pinTarget = event.target.closest?.("[data-pin-id]");
      if (pinTarget && state.tool === "wire") {
        const pin = getPin(pinTarget.dataset.pinId);
        if (pin) connectPin(pin);
        event.preventDefault();
        return;
      }

      const partTarget = event.target.closest?.("[data-part-body]");
      if (partTarget) {
        const id = partTarget.dataset.partBody;
        if (state.tool === "delete") {
          deletePart(id);
          return;
        }
        if (state.tool === "wire") {
          const pin = nearestPin(point, 28);
          if (pin) connectPin(pin);
          return;
        }

        const p = state.parts.find(p => p.id === id);
        if (!p) return;
        state.selected = id;
        state.drag = {
          id, startX: point.x, startY: point.y,
          originalX: p.x, originalY: p.y, moved: false
        };
        try { svg.setPointerCapture(event.pointerId); } catch (_) {}
        // Update only the inspector and selection outline here; don't replace
        // the element receiving pointer events.
        renderAll();
        event.preventDefault();
        return;
      }

      if (state.tool === "wire") {
        const pin = nearestPin(point, 16);
        if (pin) connectPin(pin);
      } else if (state.tool === "select") {
        state.selected = null;
        renderAll();
      }
    });

    svg.addEventListener("pointermove", event => {
      const point = pointFromEvent(event);

      if ($("coordinateReadout")) {
        $("coordinateReadout").textContent =
          `X ${Math.round(point.x)} · Y ${Math.round(point.y)}`;
      }

      if (state.wireStart) {
        state.previewPoint = point;
        renderPreview();
      }

      if (!state.drag) return;
      const p = state.parts.find(p => p.id === state.drag.id);
      if (!p) return;

      const dx = point.x - state.drag.startX;
      const dy = point.y - state.drag.startY;
      if (Math.abs(dx) + Math.abs(dy) > 2) state.drag.moved = true;
      if (!state.drag.moved) return;

      p.x = snap(state.drag.originalX + dx);
      p.y = snap(state.drag.originalY + dy);

      // Move the existing SVG group instead of rebuilding the workspace.
      const group = svg.querySelector(`[data-part-body="${p.id}"]`);
      if (group) {
        const d = partDef(p);
        group.setAttribute("transform",
          `translate(${p.x} ${p.y}) rotate(${p.rotation || 0} ${d.w / 2} ${d.h / 2})`);
      }

      // Refresh connected wires and pins while preserving the dragged group.
      renderWires();
      renderPins();
      renderPreview();
      const sel = $("selectionLayer");
      if (sel) {
        sel.replaceChildren();
        const d = partDef(p);
        sel.appendChild(svgEl("rect", {
          x: p.x - 8, y: p.y - 8, width: d.w + 16, height: d.h + 40,
          rx: 7, fill: "none", stroke: "#60a5fa",
          "stroke-width": 1.5, "stroke-dasharray": "5 4",
          "pointer-events": "none"
        }));
      }
    });

    function finishDrag(event) {
      if (!state.drag) return;
      const dragged = state.drag;
      state.drag = null;
      try { svg.releasePointerCapture(event.pointerId); } catch (_) {}
      if (dragged.moved) {
        // Push the final layout to history without recording every mouse move.
        state.historyIndex = Math.max(-1, state.historyIndex);
        pushHistory();
        state.simulation = null;
      }
      renderAll();
    }
    svg.addEventListener("pointerup", finishDrag);
    svg.addEventListener("pointercancel", finishDrag);

    svg.addEventListener("wheel", event => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      state.zoom = Math.max(0.35, Math.min(3.5,
        state.zoom * (event.deltaY < 0 ? 1.1 : 0.9)));
      renderAll();
    }, { passive: false });

    document.addEventListener("keydown", event => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (["input", "textarea", "select"].includes(tag) ||
          document.activeElement?.isContentEditable) return;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        restoreHistory(state.historyIndex + (event.shiftKey ? 1 : -1));
      } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        restoreHistory(state.historyIndex + 1);
      } else if (event.key === "Delete" || event.key === "Backspace") {
        if (!state.selected) return;
        if (String(state.selected).startsWith("W")) deleteWire(state.selected);
        else deletePart(state.selected);
      } else if (event.key.toLowerCase() === "w") {
        setTool("wire");
      } else if (event.key.toLowerCase() === "v" || event.key === "Escape") {
        setTool("select");
      } else if (event.key.toLowerCase() === "r") {
        $("rotateButton")?.click();
      }
    });
  }

  /* ---------------- Start ---------------- */

  function initialize() {
    if (!$("circuitSvg")) {
      console.error("Circuit Studio: #circuitSvg was not found in circuit.html.");
      return;
    }

    ensureLayers();
    bindEvents();
    renderAll();
    pushHistory();
    filterLibrary();
    translatePage();

    try {
      const saved = localStorage.getItem(STORAGE);
      if (saved) {
        const restore = document.createElement("button");
        restore.type = "button";
        restore.textContent = state.language === "si"
          ? "සුරැකි ව්‍යාපෘතිය නැවත ලබාගන්න"
          : "Restore saved project";
        restore.style.cssText =
          "position:fixed;right:16px;bottom:16px;z-index:9999;padding:12px 16px;cursor:pointer";
        restore.addEventListener("click", () => {
          try { loadProject(JSON.parse(saved)); restore.remove(); }
          catch (_) { msg("Saved project could not be restored.", true); }
        });
        document.body.appendChild(restore);
      }
    } catch (_) {}

    console.info("AM Digital Studio Circuit Studio ready.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
