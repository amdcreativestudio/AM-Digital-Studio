
/* ==========================================================
   AM DIGITAL STUDIO — CIRCUIT STUDIO
   circuit.js | DC Electronics Learning Simulator
========================================================== */
(() => {
    "use strict";

    const $ = id => document.getElementById(id);
    const NS = "http://www.w3.org/2000/svg";
    const GRID = 20;
    const STORAGE_KEY = "amd-circuit-studio-v1";

    const S = {
        parts: [],
        wires: [],
        selected: null,
        tool: "select",
        nextId: 1,
        zoom: 1,
        history: [],
        historyIndex: -1,
        wireStart: null,
        wirePreview: null,
        result: null,
        three: null
    };

    const defs = {
        battery: {
            name: "DC Battery", category: "source", w: 70, h: 70,
            pins: [["+", 0, 35], ["−", 70, 35]],
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
            props: { forwardVoltage: 2, maxCurrent: 0.02, label: "LED1" }, color: "#fb7185"
        },
        diode: {
            name: "Diode", category: "semiconductor", w: 80, h: 60,
            pins: [["A", 0, 30], ["K", 80, 30]],
            props: { forwardVoltage: 0.7, label: "D1" }, color: "#fb7185"
        },
        zener: {
            name: "Zener Diode", category: "semiconductor", w: 80, h: 60,
            pins: [["A", 0, 30], ["K", 80, 30]],
            props: { forwardVoltage: 0.7, zenerVoltage: 5.1, label: "DZ1" }, color: "#fb7185"
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
            name: "Arduino Uno (board model)", category: "digital", w: 110, h: 100,
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

    const clone = value => JSON.parse(JSON.stringify(value));
    const snap = value => Math.round(value / GRID) * GRID;
    const number = (value, fallback = 0) =>
        Number.isFinite(Number(value)) ? Number(value) : fallback;
    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
    const pinId = (partId, pinName) => `${partId}:${pinName}`;

    function notify(message, error = false) {
        const toast = $("circuitToast");
        const live = $("circuitLiveRegion");
        if (live) live.textContent = message;
        if (!toast) {
            console[error ? "error" : "log"](message);
            return;
        }
        toast.textContent = message;
        toast.hidden = false;
        toast.dataset.type = error ? "error" : "info";
        clearTimeout(notify.timer);
        notify.timer = setTimeout(() => { toast.hidden = true; }, 3500);
    }

    function svgEl(tag, attrs = {}, text = "") {
        const el = document.createElementNS(NS, tag);
        Object.entries(attrs).forEach(([key, value]) =>
            el.setAttribute(key, String(value))
        );
        if (text !== "") el.textContent = text;
        return el;
    }

    function def(part) {
        return defs[part.type] || defs.resistor;
    }

    function newPart(type, x = 420, y = 300) {
        const d = defs[type];
        if (!d) return null;
        const props = clone(d.props);
        const id = `C${S.nextId++}`;
        const sameType = S.parts.filter(p => p.type === type).length + 1;
        if (props.label && sameType > 1) {
            props.label = props.label.replace(/\d+$/, "") + sameType;
        }
        return {
            id, type, x: snap(x), y: snap(y), rotation: 0,
            label: props.label || d.name, props
        };
    }

    function getPins(part) {
        const d = def(part);
        const angle = (number(part.rotation) % 360) * Math.PI / 180;
        const cx = d.w / 2, cy = d.h / 2;
        return d.pins.map(([name, x, y]) => {
            const dx = x - cx, dy = y - cy;
            return {
                id: pinId(part.id, name),
                partId: part.id, name,
                x: part.x + cx + dx * Math.cos(angle) - dy * Math.sin(angle),
                y: part.y + cy + dx * Math.sin(angle) + dy * Math.cos(angle)
            };
        });
    }

    function allPins() {
        return S.parts.flatMap(getPins);
    }

    function getPin(id) {
        const split = String(id).split(":");
        const part = S.parts.find(p => p.id === split.shift());
        return part ? getPins(part).find(p => p.name === split.join(":")) : null;
    }

    function pointFromEvent(event) {
        const svg = $("circuitSvg");
        const p = svg.createSVGPoint();
        p.x = event.clientX;
        p.y = event.clientY;
        const matrix = svg.getScreenCTM();
        if (!matrix) return { x: 0, y: 0 };
        const point = p.matrixTransform(matrix.inverse());
        return {
            x: (point.x - S.panX) / S.zoom,
            y: (point.y - S.panY) / S.zoom
        };
    }

    function ensureLayers() {
        const svg = $("circuitSvg");
        if (!svg) return false;

        const ids = [
            "canvasBackground", "wireLayer", "componentLayer",
            "pinLayer", "selectionLayer", "previewLayer"
        ];

        ids.forEach(id => {
            if (!$(id)) {
                const el = svgEl("g", { id });
                svg.appendChild(el);
            }
        });

        let root = $("canvasRoot");
        if (!root) {
            root = svgEl("g", { id: "canvasRoot" });
            svg.appendChild(root);
            ids.forEach(id => root.appendChild($(id)));
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

        const defsEl = svgEl("defs");
        const pattern = svgEl("pattern", {
            id: "csGrid", width: GRID, height: GRID,
            patternUnits: "userSpaceOnUse"
        });
        pattern.appendChild(svgEl("circle", {
            cx: 1, cy: 1, r: 1, fill: "#34435e"
        }));
        defsEl.appendChild(pattern);
        layer.appendChild(defsEl);
        layer.appendChild(svgEl("rect", {
            x: 0, y: 0, width: 1200, height: 800, fill: "url(#csGrid)"
        }));
    }

    function componentValue(part) {
        const p = part.props;
        if (part.type === "resistor" || part.type === "motor" || part.type === "lamp") {
            const r = number(p.resistance);
            return r >= 1000 ? `${(r / 1000).toFixed(2)} kΩ` : `${r} Ω`;
        }
        if (part.type === "battery") return `${number(p.voltage, 5)} V`;
        if (part.type === "capacitor") return `${number(p.capacitance)} F`;
        if (part.type === "inductor") return `${number(p.inductance)} H`;
        if (["led", "diode", "zener"].includes(part.type)) {
            return `${number(p.forwardVoltage, 0.7)} V`;
        }
        return "";
    }

    function drawSymbol(part, group) {
        const d = def(part);
        const color = d.color;
        const line = { fill: "none", stroke: color, "stroke-width": 2.2,
            "stroke-linecap": "round", "stroke-linejoin": "round" };
        const add = (tag, attrs, text) => group.appendChild(svgEl(tag, attrs, text));

        switch (part.type) {
            case "resistor":
                add("line", { x1: 0, y1: 30, x2: 17, y2: 30, ...line });
                add("rect", { x: 17, y: 20, width: 66, height: 20, rx: 3,
                    fill: "#fbbf2418", ...line });
                add("line", { x1: 83, y1: 30, x2: 100, y2: 30, ...line });
                break;

            case "battery":
                add("line", { x1: 0, y1: 35, x2: 22, y2: 35, ...line });
                add("line", { x1: 22, y1: 16, x2: 22, y2: 54, ...line });
                add("line", { x1: 35, y1: 23, x2: 35, y2: 47, ...line });
                add("line", { x1: 35, y1: 35, x2: 70, y2: 35, ...line });
                add("text", { x: 22, y: 11, fill: color, "font-size": 11, "text-anchor": "middle" }, "+");
                add("text", { x: 35, y: 60, fill: color, "font-size": 11, "text-anchor": "middle" }, "−");
                break;

            case "ground":
                add("line", { x1: 25, y1: 0, x2: 25, y2: 10, ...line });
                add("line", { x1: 10, y1: 10, x2: 40, y2: 10, ...line });
                add("line", { x1: 15, y1: 17, x2: 35, y2: 17, ...line });
                add("line", { x1: 20, y1: 24, x2: 30, y2: 24, ...line });
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
                    add("path", { d: `M${x - 8} 30 a8 8 0 0 1 16 0`, ...line })
                );
                add("line", { x1: 88, y1: 30, x2: 100, y2: 30, ...line });
                break;

            case "switch":
            case "pushbutton": {
                const closed = part.type === "switch" ? part.props.closed : part.props.pressed;
                add("line", { x1: 0, y1: 30, x2: 20, y2: 30, ...line });
                add("circle", { cx: 20, cy: 30, r: 3, fill: color });
                add("circle", { cx: 60, cy: 30, r: 3, fill: color });
                add("line", {
                    x1: 20, y1: 30, x2: closed ? 60 : 52,
                    y2: closed ? 30 : 15, ...line
                });
                add("line", { x1: 60, y1: 30, x2: 80, y2: 30, ...line });
                break;
            }

            case "led":
            case "diode":
            case "zener":
                add("line", { x1: 0, y1: 30, x2: 22, y2: 30, ...line });
                add("path", { d: "M22 15 L22 45 L52 30 Z", fill: `${color}22`, ...line });
                add("line", { x1: 53, y1: 14, x2: 53, y2: 46, ...line });
                add("line", { x1: 53, y1: 30, x2: 80, y2: 30, ...line });
                if (part.type === "zener") {
                    add("path", { d: "M53 14 L47 14 L47 20 M53 46 L59 46 L59 40", ...line });
                }
                if (part.type === "led") {
                    add("path", { d: "M37 11 L47 3 M42 3 L47 3 L47 8 M45 17 L55 9 M50 9 L55 9 L55 14", ...line });
                    if (part.props.lit) {
                        add("circle", { cx: 39, cy: 30, r: 27, fill: "#fb718522", stroke: "none" });
                    }
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
                add("path", {
                    d: part.type === "npn" ? "M49 60 L62 72 L45 68 Z" : "M46 22 L35 25 L42 34 Z",
                    fill: color, stroke: "none"
                });
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
                add("text", { x: 40, y: 40, fill: color, "font-size": 15, "text-anchor": "middle" }, "M");
                add("line", { x1: 62, y1: 35, x2: 80, y2: 35, ...line });
                break;

            case "lamp":
                add("line", { x1: 0, y1: 35, x2: 19, y2: 35, ...line });
                add("circle", { cx: 40, cy: 35, r: 21, fill: part.props.lit ? "#fbbf2440" : "none", ...line });
                add("path", { d: "M25 20 L55 50 M55 20 L25 50", ...line });
                add("line", { x1: 61, y1: 35, x2: 80, y2: 35, ...line });
                break;

            case "arduino":
                add("rect", { x: 8, y: 5, width: 94, height: 90, rx: 7, fill: "#10b98115", ...line });
                add("rect", { x: 27, y: 25, width: 48, height: 38, rx: 3, fill: "#0e172a", ...line });
                add("text", { x: 51, y: 41, fill: color, "font-size": 8, "text-anchor": "middle" }, "ARDUINO");
                add("text", { x: 51, y: 53, fill: color, "font-size": 10, "text-anchor": "middle" }, "UNO");
                break;

            case "and":
            case "or":
            case "not":
                add("rect", { x: 10, y: 12, width: 60, height: 56, rx: 7, fill: "#a78bfa12", ...line });
                add("text", { x: 40, y: 43, fill: color, "font-size": 12, "text-anchor": "middle", "font-weight": "bold" }, part.type.toUpperCase());
                break;
        }

        if (part.type !== "ground") {
            add("text", {
                x: d.w / 2, y: d.h + 14, fill: "#dce7fa",
                "font-size": 11, "text-anchor": "middle",
                "font-family": "Poppins, sans-serif", "pointer-events": "none"
            }, part.label || d.name);

            const value = componentValue(part);
            if (value) add("text", {
                x: d.w / 2, y: d.h + 28, fill: "#91a5c5",
                "font-size": 9, "text-anchor": "middle",
                "font-family": "Poppins, sans-serif", "pointer-events": "none"
            }, value);
        }
    }

    function renderPart(part, layer, selectionLayer) {
        const d = def(part);
        const group = svgEl("g", {
            transform: `translate(${part.x} ${part.y}) rotate(${part.rotation || 0} ${d.w / 2} ${d.h / 2})`,
            "data-component-id": part.id,
            tabindex: 0,
            role: "button",
            "aria-label": part.label
        });

        group.appendChild(svgEl("rect", {
            x: -5, y: -5, width: d.w + 10, height: d.h + 35,
            fill: "transparent", stroke: "transparent",
            "data-component-id": part.id
        }));

        drawSymbol(part, group);

        group.addEventListener("pointerdown", event => {
            if (event.button !== 0) return;
            if (S.tool === "delete") {
                event.stopPropagation();
                deletePart(part.id);
                return;
            }
            if (S.tool === "wire") {
                event.stopPropagation();
                const point = pointFromEvent(event);
                const pin = nearestPin(point, 28);
                if (pin) connectPin(pin);
                return;
            }
            if (S.tool === "select") {
                S.selected = part.id;
                S.drag = {
                    id: part.id,
                    start: pointFromEvent(event),
                    x: part.x, y: part.y,
                    moved: false
                };
                event.stopPropagation();
                renderAll();
            }
        });

        group.addEventListener("dblclick", event => {
            event.stopPropagation();
            if (part.type === "switch" || part.type === "pushbutton") {
                pushHistory();
                const key = part.type === "switch" ? "closed" : "pressed";
                part.props[key] = !part.props[key];
                renderAll();
                return;
            }
            S.selected = part.id;
            renderAll();
        });

        layer.appendChild(group);

        if (S.selected === part.id) {
            selectionLayer.appendChild(svgEl("rect", {
                x: part.x - 7, y: part.y - 7,
                width: d.w + 14, height: d.h + 38,
                rx: 8, fill: "none", stroke: "#60a5fa",
                "stroke-width": 1.5, "stroke-dasharray": "5 4",
                "pointer-events": "none"
            }));
        }
    }

    function nearestPin(point, maxDistance = 18) {
        let best = null, bestDistance = maxDistance;
        allPins().forEach(pin => {
            const distance = Math.hypot(pin.x - point.x, pin.y - point.y);
            if (distance < bestDistance) {
                best = pin;
                bestDistance = distance;
            }
        });
        return best;
    }

    function renderWires(layer) {
        S.wires.forEach(wire => {
            const a = getPin(wire.from), b = getPin(wire.to);
            if (!a || !b) return;
            const midX = snap((a.x + b.x) / 2);
            const path = svgEl("path", {
                d: `M${a.x} ${a.y} L${midX} ${a.y} L${midX} ${b.y} L${b.x} ${b.y}`,
                fill: "none",
                stroke: wire.color || "#4ea1ff",
                "stroke-width": S.selected === wire.id ? 4 : 2.4,
                "stroke-linejoin": "round",
                "stroke-linecap": "round",
                "data-wire-id": wire.id
            });
            path.addEventListener("click", event => {
                event.stopPropagation();
                if (S.tool === "delete") {
                    deleteWire(wire.id);
                } else {
                    S.selected = wire.id;
                    renderAll();
                }
            });
            layer.appendChild(path);
        });
    }

    function renderPins(layer) {
        allPins().forEach(pin => {
            const group = svgEl("g", {
                "data-pin-id": pin.id,
                "data-component-id": pin.partId,
                tabindex: 0, role: "button",
                "aria-label": `${pin.partId} ${pin.name}`
            });
            group.appendChild(svgEl("circle", {
                cx: pin.x, cy: pin.y, r: 10,
                fill: "transparent", stroke: "transparent",
                "data-pin-id": pin.id
            }));
            group.appendChild(svgEl("circle", {
                cx: pin.x, cy: pin.y, r: 3.7,
                fill: "#0e172a", stroke: "#91a5c5",
                "stroke-width": 1.5, "pointer-events": "none"
            }));
            group.addEventListener("click", event => {
                event.stopPropagation();
                if (S.tool === "wire") connectPin(pin);
            });
            layer.appendChild(group);
        });
    }

    function renderPreview() {
        const layer = $("previewLayer");
        if (!layer) return;
        layer.replaceChildren();
        if (!S.wireStart || !S.wirePreview) return;
        const start = getPin(S.wireStart);
        if (!start) return;
        const end = S.wirePreview;
        const midX = snap((start.x + end.x) / 2);
        layer.appendChild(svgEl("path", {
            d: `M${start.x} ${start.y} L${midX} ${start.y} L${midX} ${end.y} L${end.x} ${end.y}`,
            fill: "none", stroke: "#00c7e8",
            "stroke-width": 2, "stroke-dasharray": "5 4",
            "pointer-events": "none"
        }));
    }

    function updateTransform() {
        const root = $("canvasRoot");
        if (root) root.setAttribute("transform", `translate(${S.panX || 0} ${S.panY || 0}) scale(${S.zoom})`);
        if ($("zoomValue")) $("zoomValue").textContent = `${Math.round(S.zoom * 100)}%`;
    }

    function renderAll() {
        if (!$("circuitSvg")) return;
        ensureLayers();
        drawGrid();

        $("wireLayer")?.replaceChildren();
        $("componentLayer")?.replaceChildren();
        $("pinLayer")?.replaceChildren();
        $("selectionLayer")?.replaceChildren();

        renderWires($("wireLayer"));
        S.parts.forEach(part => renderPart(part, $("componentLayer"), $("selectionLayer")));
        renderPins($("pinLayer"));
        renderPreview();
        updateTransform();

        const empty = $("emptyBoardMessage");
        if (empty) empty.hidden = S.parts.length > 0;
        updateInspector();
        updateHistoryButtons();
        if (S.three) render3D();
    }

    function addPart(type) {
        if (!defs[type]) {
            notify(`Unknown component: ${type}`, true);
            return;
        }
        pushHistory();
        const part = newPart(type);
        S.parts.push(part);
        S.selected = part.id;
        setTool("select");
        S.result = null;
        renderAll();
        notify(`${part.label} added.`);
    }

    function connectPin(pin) {
        if (!S.wireStart) {
            S.wireStart = pin.id;
            S.wirePreview = { x: pin.x, y: pin.y };
            renderPreview();
            notify(`Wire started at ${pin.name}. Select another pin.`);
            return;
        }
        if (S.wireStart === pin.id) {
            S.wireStart = null;
            S.wirePreview = null;
            renderPreview();
            return;
        }
        if (S.wires.some(w =>
            (w.from === S.wireStart && w.to === pin.id) ||
            (w.to === S.wireStart && w.from === pin.id)
        )) {
            S.wireStart = null;
            S.wirePreview = null;
            renderPreview();
            notify("These pins are already connected.");
            return;
        }

        pushHistory();
        S.wires.push({
            id: `W${S.nextId++}`,
            from: S.wireStart, to: pin.id,
            color: "#4ea1ff"
        });
        S.wireStart = null;
        S.wirePreview = null;
        S.result = null;
        renderAll();
        notify("Wire connected.");
    }

    function setTool(tool) {
        S.tool = tool;
        S.wireStart = null;
        S.wirePreview = null;

        const ids = {
            selectTool: "select",
            wireTool: "wire",
            deleteTool: "delete"
        };
        Object.entries(ids).forEach(([id, value]) =>
            $(id)?.classList.toggle("active", value === tool)
        );

        const svg = $("circuitSvg");
        if (svg) svg.style.cursor = tool === "wire" ? "crosshair" :
            tool === "delete" ? "not-allowed" : "default";
        renderPreview();
    }

    function deletePart(id) {
        pushHistory();
        S.parts = S.parts.filter(part => part.id !== id);
        S.wires = S.wires.filter(wire =>
            !wire.from.startsWith(`${id}:`) && !wire.to.startsWith(`${id}:`)
        );
        S.selected = null;
        S.result = null;
        renderAll();
    }

    function deleteWire(id) {
        pushHistory();
        S.wires = S.wires.filter(wire => wire.id !== id);
        S.selected = null;
        S.result = null;
        renderAll();
    }

    function selectedPart() {
        return S.parts.find(part => part.id === S.selected);
    }

    function updateInspector() {
        const part = selectedPart();
        if ($("noSelectionMessage")) $("noSelectionMessage").hidden = !!part;
        if ($("componentProperties")) $("componentProperties").hidden = !part;
        if (!part) {
            if ($("selectedComponentId")) $("selectedComponentId").textContent = "—";
            return;
        }

        if ($("selectedComponentId")) $("selectedComponentId").textContent = part.id;
        if ($("componentLabel")) $("componentLabel").value = part.label || "";
        if ($("componentModel")) {
            $("componentModel").value = part.model || "default";
            $("componentModel").disabled = !["resistor", "diode", "led", "zener", "battery"].includes(part.type);
        }

        const container = $("dynamicPropertyFields");
        if (!container) return;
        container.replaceChildren();

        const fields = {
            battery: [["voltage", "Voltage (V)", 0.1]],
            resistor: [["resistance", "Resistance (Ω)", 0.1]],
            capacitor: [["capacitance", "Capacitance (F)", 0.000000001]],
            inductor: [["inductance", "Inductance (H)", 0.000001]],
            led: [["forwardVoltage", "Forward voltage (V)", 0.01], ["maxCurrent", "Maximum current (A)", 0.001]],
            diode: [["forwardVoltage", "Forward voltage (V)", 0.01]],
            zener: [["forwardVoltage", "Forward voltage (V)", 0.01], ["zenerVoltage", "Zener voltage (V)", 0.1]],
            motor: [["resistance", "Resistance (Ω)", 0.1]],
            lamp: [["resistance", "Resistance (Ω)", 0.1]],
            npn: [["beta", "Approx. current gain β", 1]],
            pnp: [["beta", "Approx. current gain β", 1]],
            nmos: [["threshold", "Threshold voltage (V)", 0.1], ["rdsOn", "On resistance (Ω)", 0.01]],
            arduino: [["outputVoltage", "Nominal logic voltage (V)", 0.1]],
            and: [["inputA", "Input A (0 or 1)", 1], ["inputB", "Input B (0 or 1)", 1]],
            or: [["inputA", "Input A (0 or 1)", 1], ["inputB", "Input B (0 or 1)", 1]],
            not: [["inputA", "Input A (0 or 1)", 1]]
        }[part.type] || [];

        fields.forEach(([key, label, step]) => {
            const wrapper = document.createElement("div");
            wrapper.className = "property-field";
            const labelEl = document.createElement("label");
            labelEl.textContent = label;
            labelEl.htmlFor = `cs-prop-${key}`;

            const input = document.createElement("input");
            input.id = `cs-prop-${key}`;
            input.type = "number";
            input.step = step;
            input.min = key.startsWith("input") ? "0" : "0";
            if (key.startsWith("input")) input.max = "1";
            input.value = part.props[key] ?? "";
            input.addEventListener("change", () => {
                pushHistory();
                let value = number(input.value, part.props[key]);
                if (key.startsWith("input")) value = clamp(Math.round(value), 0, 1);
                part.props[key] = value;
                S.result = null;
                renderAll();
            });
            wrapper.append(labelEl, input);
            container.appendChild(wrapper);
        });

        if (["switch", "pushbutton"].includes(part.type)) {
            const wrapper = document.createElement("div");
            wrapper.className = "property-field";
            const label = document.createElement("label");
            label.textContent = part.type === "switch" ? "Closed" : "Pressed";
            const input = document.createElement("input");
            input.type = "checkbox";
            input.checked = !!part.props[part.type === "switch" ? "closed" : "pressed"];
            input.addEventListener("change", () => {
                pushHistory();
                part.props[part.type === "switch" ? "closed" : "pressed"] = input.checked;
                S.result = null;
                renderAll();
            });
            wrapper.append(label, input);
            container.appendChild(wrapper);
        }
    }

    /* -------------------- History -------------------- */

    function snapshot() {
        return JSON.stringify({
            parts: S.parts, wires: S.wires,
            nextId: S.nextId,
            projectName: $("projectName")?.value || "Untitled Circuit"
        });
    }

    function pushHistory() {
        const current = snapshot();
        if (S.history[S.historyIndex] === current) return;
        S.history = S.history.slice(0, S.historyIndex + 1);
        S.history.push(current);
        if (S.history.length > 60) S.history.shift();
        S.historyIndex = S.history.length - 1;
        updateHistoryButtons();
    }

    function restoreHistory(index) {
        if (index < 0 || index >= S.history.length) return;
        S.historyIndex = index;
        const data = JSON.parse(S.history[index]);
        S.parts = data.parts || [];
        S.wires = data.wires || [];
        S.nextId = data.nextId || 1;
        if ($("projectName")) $("projectName").value = data.projectName || "Untitled Circuit";
        S.selected = null;
        S.result = null;
        renderAll();
    }

    function updateHistoryButtons() {
        if ($("undoButton")) $("undoButton").disabled = S.historyIndex <= 0;
        if ($("redoButton")) $("redoButton").disabled = S.historyIndex >= S.history.length - 1;
    }

    /* -------------------- Save / Load / Export -------------------- */

    function projectData() {
        return {
            format: "AMDS-CircuitStudio",
            version: 1,
            projectName: $("projectName")?.value || "Untitled Circuit",
            components: S.parts,
            wires: S.wires,
            nextId: S.nextId,
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
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function saveProject() {
        const data = projectData();
        const safeName = data.projectName.replace(/[^\w-]+/g, "-") || "circuit";
        download(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
            `${safeName}.amdcircuit.json`);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {}
        notify("Project downloaded as JSON.");
    }

    function loadProject(data) {
        if (!data || data.format !== "AMDS-CircuitStudio" ||
            !Array.isArray(data.components) || !Array.isArray(data.wires)) {
            notify("Invalid Circuit Studio project file.", true);
            return;
        }

        pushHistory();
        S.parts = data.components.filter(p => defs[p.type]).map(p => ({
            ...p,
            props: { ...clone(defs[p.type].props), ...(p.props || p.properties || {}) }
        }));

        const validPins = new Set(allPins().map(pin => pin.id));
        S.wires = data.wires.filter(w => validPins.has(w.from) && validPins.has(w.to));
        S.nextId = Math.max(1, number(data.nextId, 1));
        if ($("projectName")) $("projectName").value = data.projectName || "Untitled Circuit";
        S.selected = null;
        S.result = null;
        pushHistory();
        renderAll();
        notify("Project loaded.");
    }

    function exportSVG() {
        const svg = $("circuitSvg");
        if (!svg) return;
        const copy = svg.cloneNode(true);
        copy.setAttribute("xmlns", NS);
        copy.setAttribute("width", "1200");
        copy.setAttribute("height", "800");
        download(new Blob([new XMLSerializer().serializeToString(copy)], {
            type: "image/svg+xml;charset=utf-8"
        }), "circuit-schematic.svg");
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
            notify("PNG export failed. Try SVG export.", true);
        };
        image.src = url;
    }

    /* -------------------- DC MNA Solver -------------------- */

    function unionFind(ids) {
        const parent = new Map(ids.map(id => [id, id]));
        function find(id) {
            if (!parent.has(id)) parent.set(id, id);
            if (parent.get(id) !== id) parent.set(id, find(parent.get(id)));
            return parent.get(id);
        }
        function union(a, b) {
            const ra = find(a), rb = find(b);
            if (ra !== rb) parent.set(rb, ra);
        }
        return { find, union };
    }

    function gaussianSolve(matrix, vector, tolerance = 1e-11) {
        const n = vector.length;
        const a = matrix.map((row, i) => [...row, vector[i]]);

        for (let col = 0; col < n; col++) {
            let pivot = col;
            for (let row = col + 1; row < n; row++) {
                if (Math.abs(a[row][col]) > Math.abs(a[pivot][col])) pivot = row;
            }

            if (Math.abs(a[pivot][col]) < tolerance) {
                throw new Error("Circuit matrix is singular. Check the ground, open wires, floating nodes, and short circuits.");
            }

            [a[col], a[pivot]] = [a[pivot], a[col]];
            const divisor = a[col][col];
            for (let j = col; j <= n; j++) a[col][j] /= divisor;

            for (let row = 0; row < n; row++) {
                if (row === col) continue;
                const factor = a[row][col];
                for (let j = col; j <= n; j++) a[row][j] -= factor * a[col][j];
            }
        }
        return a.map(row => row[n]);
    }

    function solveDC() {
        const electrical = S.parts.filter(p => [
            "battery", "resistor", "capacitor", "inductor", "switch",
            "pushbutton", "led", "diode", "zener", "motor", "lamp"
        ].includes(p.type));

        const batteries = electrical.filter(p => p.type === "battery");
        if (!batteries.length) throw new Error("Add a DC Battery before running the solver.");

        const uf = unionFind(allPins().map(pin => pin.id));
        S.wires.forEach(wire => uf.union(wire.from, wire.to));

        const groundPart = S.parts.find(p => p.type === "ground");
        let ground = groundPart ? uf.find(getPins(groundPart)[0].id) : null;
        const warnings = [];

        if (!ground) {
            const firstBattery = batteries[0];
            const negativePin = getPins(firstBattery).find(pin => pin.name === "−");
            ground = uf.find(negativePin.id);
            warnings.push("No ground symbol found; the first battery's negative terminal was used as the voltage reference.");
        }

        const nodeRoots = [...new Set(allPins().map(pin => uf.find(pin.id)))];
        const unknownNodes = nodeRoots.filter(root => root !== ground);
        const nodeIndex = new Map(unknownNodes.map((root, i) => [root, i]));
        const sourceIndex = new Map(batteries.map((battery, i) => [battery.id, unknownNodes.length + i]));
        const n = unknownNodes.length + batteries.length;

        if (!n) throw new Error("The circuit has no solvable nodes.");

        const nodeOf = (part, pinName) => {
            const pin = getPins(part).find(p => p.name === pinName);
            return pin ? uf.find(pin.id) : null;
        };

        const stampG = (G, a, b, g) => {
            if (!Number.isFinite(g) || g < 0) throw new Error("Invalid component conductance.");
            const ia = nodeIndex.get(a), ib = nodeIndex.get(b);
            if (ia !== undefined) G[ia][ia] += g;
            if (ib !== undefined) G[ib][ib] += g;
            if (ia !== undefined && ib !== undefined) {
                G[ia][ib] -= g;
                G[ib][ia] -= g;
            }
        };

        const stampI = (I, a, b, current) => {
            const ia = nodeIndex.get(a), ib = nodeIndex.get(b);
            if (ia !== undefined) I[ia] -= current;
            if (ib !== undefined) I[ib] += current;
        };

        const stampV = (G, I, battery, a, b) => {
            const k = sourceIndex.get(battery.id);
            const ia = nodeIndex.get(a), ib = nodeIndex.get(b);
            if (ia !== undefined) { G[ia][k] += 1; G[k][ia] += 1; }
            if (ib !== undefined) { G[ib][k] -= 1; G[k][ib] -= 1; }
            I[k] += number(battery.props.voltage, 5);
        };

        const nonlinear = electrical.filter(p => ["led", "diode", "zener"].includes(p.type));
        let solution = Array(n).fill(0);
        let converged = false;
        let iterations = 0;
        const tolerance = Math.max(1e-9, number($("solverTolerance")?.value, 1e-6));

        for (iterations = 1; iterations <= 60; iterations++) {
            const G = Array.from({ length: n }, () => Array(n).fill(0));
            const I = Array(n).fill(0);

            for (const part of electrical) {
                const p = part.props;
                const pins = getPins(part);

                if (["resistor", "motor", "lamp"].includes(part.type)) {
                    const r = number(p.resistance, 1000);
                    if (r <= 0) throw new Error(`${part.label}: resistance must be greater than zero.`);
                    stampG(G, uf.find(pins[0].id), uf.find(pins[1].id), 1 / r);
                } else if (part.type === "switch" || part.type === "pushbutton") {
                    const closed = part.type === "switch" ? p.closed : p.pressed;
                    if (closed) stampG(G, uf.find(pins[0].id), uf.find(pins[1].id), 1e6);
                } else if (part.type === "capacitor") {
                    warnings.push(`${part.label}: capacitor is open-circuit at DC steady state.`);
                } else if (part.type === "inductor") {
                    warnings.push(`${part.label}: ideal inductor is approximated as a short at DC steady state.`);
                    stampG(G, uf.find(pins[0].id), uf.find(pins[1].id), 1e6);
                } else if (part.type === "battery") {
                    const a = nodeOf(part, "+"), b = nodeOf(part, "−");
                    if (a === b) throw new Error(`${part.label}: battery terminals are shorted together.`);
                    stampV(G, I, part, a, b);
                } else if (["led", "diode", "zener"].includes(part.type)) {
                    const a = uf.find(pins[0].id), b = uf.find(pins[1].id);
                    const va = a === ground ? 0 : solution[nodeIndex.get(a)] || 0;
                    const vb = b === ground ? 0 : solution[nodeIndex.get(b)] || 0;
                    const vd = va - vb;
                    const vf = Math.max(0.1, number(p.forwardVoltage, part.type === "led" ? 2 : 0.7));

                    // Educational piecewise-linear approximation, not a SPICE diode model.
                    let g = 1e-9, ieq = 0;
                    if (part.type === "zener" && vd < -number(p.zenerVoltage, 5.1)) {
                        g = 0.02;
                        ieq = g * number(p.zenerVoltage, 5.1);
                    } else if (vd > vf) {
                        g = 0.02;
                        ieq = -g * vf;
                    }
                    stampG(G, a, b, g);
                    stampI(I, a, b, ieq);
                }
            }

            const next = gaussianSolve(G, I);
            let delta = 0;
            next.forEach((value, i) => delta = Math.max(delta, Math.abs(value - solution[i])));
            solution = next;

            if (!nonlinear.length || delta < tolerance) {
                converged = true;
                break;
            }
        }

        if (!converged) warnings.push("Nonlinear iteration did not reach the selected tolerance; treat the result as approximate.");

        const volts = new Map([[ground, 0]]);
        unknownNodes.forEach(root => volts.set(root, solution[nodeIndex.get(root)]));

        const nodeRows = [...new Set(nodeRoots)].map((root, index) => {
            const names = allPins().filter(pin => uf.find(pin.id) === root).map(pin => {
                const part = S.parts.find(p => p.id === pin.partId);
                return `${part?.label || pin.partId}.${pin.name}`;
            });
            return {
                name: `N${index}${root === ground ? " (GND)" : ""}: ${names.join(", ")}`,
                voltage: volts.get(root) ?? 0
            };
        });

        const branchRows = [];
        for (const part of electrical) {
            const pins = getPins(part);
            const a = uf.find(pins[0].id), b = uf.find(pins[1].id);
            const va = volts.get(a) ?? 0, vb = volts.get(b) ?? 0;
            const v = va - vb;
            let current = null;

            if (["resistor", "motor", "lamp"].includes(part.type)) {
                const r = number(part.props.resistance, 1000);
                current = r > 0 ? v / r : null;
            } else if (part.type === "battery") {
                current = solution[sourceIndex.get(part.id)] ?? 0;
            } else if (["led", "diode", "zener"].includes(part.type)) {
                const vf = number(part.props.forwardVoltage, 0.7);
                current = v > vf ? (v - vf) * 0.02 : 0;
                if (part.type === "led") {
                    part.props.lit = current > 0.001;
                    if (Math.abs(current) > number(part.props.maxCurrent, 0.02)) {
                        warnings.push(`${part.label}: estimated current exceeds its configured maximum.`);
                    }
                }
            } else if (part.type === "switch" || part.type === "pushbutton") {
                const closed = part.type === "switch" ? part.props.closed : part.props.pressed;
                current = closed ? v * 1e6 : 0;
            } else if (part.type === "capacitor") {
                current = 0;
            } else if (part.type === "inductor") {
                current = null;
            }

            branchRows.push({
                name: part.label,
                voltage: v,
                current,
                power: current === null ? null : v * current
            });
        }

        const logicRows = S.parts.filter(p => ["and", "or", "not"].includes(p.type)).map(p => {
            const a = clamp(Math.round(number(p.props.inputA)), 0, 1);
            const b = clamp(Math.round(number(p.props.inputB)), 0, 1);
            const y = p.type === "and" ? (a & b) : p.type === "or" ? (a | b) : (a ? 0 : 1);
            p.props.outputY = y;
            return { name: p.label, result: `${a}${p.type === "not" ? "" : `, ${b}`} → ${y}` };
        });

        S.parts.filter(p => p.type === "arduino").forEach(p =>
            warnings.push(`${p.label}: board and pin visualization only; Arduino sketches are not executed.`)
        );
        if (logicRows.length) warnings.push("Digital gates are evaluated separately; their outputs are not electrically coupled to the analog solver.");
        if (S.parts.some(p => ["npn", "pnp", "nmos"].includes(p.type))) {
            warnings.push("Transistor/MOSFET symbols are not included in the analog solver yet.");
        }

        return {
            nodeRows, branchRows, logicRows,
            warnings: [...new Set(warnings)],
            iterations, converged,
            nodeCount: nodeRows.length,
            branchCount: branchRows.length
        };
    }

    function fmt(value) {
        if (value === null || value === undefined || !Number.isFinite(value)) return "—";
        if (value !== 0 && (Math.abs(value) >= 1e6 || Math.abs(value) < 1e-4)) {
            return value.toExponential(3);
        }
        return value.toFixed(5);
    }

    function renderTable(id, headers, rows) {
        const table = $(id);
        if (!table) return;
        table.replaceChildren();

        const thead = document.createElement("thead");
        const headRow = document.createElement("tr");
        headers.forEach(text => {
            const th = document.createElement("th");
            th.textContent = text;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        if (!rows.length) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = headers.length;
            td.textContent = "Run the DC solver to view results.";
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            rows.forEach(row => {
                const tr = document.createElement("tr");
                row.forEach(value => {
                    const td = document.createElement("td");
                    td.textContent = value;
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        }
        table.appendChild(tbody);
    }

    function showResult(result) {
        S.result = result;
        if ($("nodeCount")) $("nodeCount").textContent = result.nodeCount;
        if ($("branchCount")) $("branchCount").textContent = result.branchCount;
        if ($("iterationCount")) $("iterationCount").textContent = result.iterations;
        if ($("convergenceStatus")) $("convergenceStatus").textContent = result.converged ? "Converged" : "Approx.";

        const status = $("simulationState");
        status?.classList.remove("error");
        status?.classList.add("running");
        if ($("simulationStateText")) {
            $("simulationStateText").textContent = result.converged ? "DC solution calculated" : "Approximate result";
        }
        if ($("simulationError")) $("simulationError").hidden = true;

        renderTable("nodeVoltageTable", ["Node / Pins", "Voltage (V)"],
            result.nodeRows.map(row => [row.name, fmt(row.voltage)]));

        renderTable("branchCurrentTable", ["Component", "Voltage (V)", "Current (A)", "Power (W)"],
            result.branchRows.map(row => [row.name, fmt(row.voltage), fmt(row.current), fmt(row.power)]));

        const list = $("circuitValidationList");
        if (list) {
            list.replaceChildren();
            const items = [
                [result.converged ? "success" : "warning",
                    result.converged ? "DC operating point calculated." : "Approximate result; inspect the circuit."]
            ].concat(result.warnings.map(w => ["warning", w]));

            if (!items.length) items.push(["success", "No warnings."]);
            items.forEach(([type, text]) => {
                const li = document.createElement("li");
                li.className = `validation-${type}`;
                const icon = document.createElement("i");
                icon.className = type === "success"
                    ? "fa-solid fa-circle-check"
                    : "fa-solid fa-triangle-exclamation";
                const span = document.createElement("span");
                span.textContent = text;
                li.append(icon, span);
                list.appendChild(li);
            });
        }

        renderAll();
    }

    function simulationError(message) {
        $("simulationState")?.classList.remove("running");
        $("simulationState")?.classList.add("error");
        if ($("simulationStateText")) $("simulationStateText").textContent = "Simulation failed";
        if ($("simulationError")) $("simulationError").hidden = false;
        if ($("simulationErrorText")) $("simulationErrorText").textContent = message;
        renderTable("nodeVoltageTable", ["Node / Pins", "Voltage (V)"], []);
        renderTable("branchCurrentTable", ["Component", "Voltage (V)", "Current (A)", "Power (W)"], []);
        notify(message, true);
    }

    function validateBeforeRun() {
        const list = $("circuitValidationList");
        if (!list) return;
        list.replaceChildren();

        const items = [];
        if (!S.parts.length) items.push(["warning", "Add components first."]);
        if (!S.parts.some(p => p.type === "battery")) items.push(["warning", "Add a DC battery/source."]);
        if (!S.parts.some(p => p.type === "ground")) items.push(["warning", "Add a ground reference."]);
        if (S.parts.length > 1 && !S.wires.length) items.push(["warning", "Connect component pins with the Wire tool."]);
        if (S.parts.some(p => p.type === "arduino")) items.push(["neutral", "Arduino firmware is not executed by this simulator."]);
        if (!items.length) items.push(["success", "Ready for a DC analysis attempt."]);

        items.forEach(([type, text]) => {
            const li = document.createElement("li");
            li.className = `validation-${type}`;
            const icon = document.createElement("i");
            icon.className = type === "success" ? "fa-solid fa-circle-check" :
                type === "warning" ? "fa-solid fa-triangle-exclamation" : "fa-solid fa-circle-info";
            const span = document.createElement("span");
            span.textContent = text;
            li.append(icon, span);
            list.appendChild(li);
        });
    }

    /* -------------------- Learning panels -------------------- */

    function openLesson(key) {
        const lessons = {
            ohm: {
                title: "Ohm’s Law",
                text: "Ohm’s law: V = I × R. Current is I = V/R. A 5 V supply across a 1 kΩ resistor gives about 5 mA in a correctly connected circuit."
            },
            kirchhoff: {
                title: "Kirchhoff’s Laws",
                text: "KCL: the algebraic sum of currents at a node is zero. KVL: the algebraic sum of voltages around a closed loop is zero. Nodal analysis forms equations from these relationships."
            },
            logic: {
                title: "Digital Logic",
                text: "AND outputs 1 when both inputs are 1. OR outputs 1 when either input is 1. NOT reverses its input. Gate values in this version are educational models, not connected analog voltage sources."
            }
        };
        const lesson = lessons[key];
        if (!lesson || !$("lessonContentBody")) return;

        const body = $("lessonContentBody");
        body.replaceChildren();
        const heading = document.createElement("h3");
        heading.textContent = lesson.title;
        const paragraph = document.createElement("p");
        paragraph.textContent = lesson.text;
        body.append(heading, paragraph);
        if ($("lessonContent")) {
            $("lessonContent").hidden = false;
            $("lessonContent").scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }

    /* -------------------- Three.js 3D view -------------------- */

    function init3D() {
        const viewport = $("threeDViewport");
        if (!viewport) return;
        if (!window.THREE) {
            notify("Three.js failed to load. Check the CDN scripts and internet connection.", true);
            return;
        }
        if (S.three) {
            if ($("threeDPlaceholder")) $("threeDPlaceholder").hidden = true;
            render3D();
            return;
        }

        try {
            const T = window.THREE;
            const scene = new T.Scene();
            scene.background = new T.Color(0x0d1527);

            const camera = new T.PerspectiveCamera(45, 1, 0.1, 100);
            camera.position.set(0, 6, 10);

            const renderer = new T.WebGLRenderer({ antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderer.shadowMap.enabled = true;
            renderer.setSize(viewport.clientWidth || 600, viewport.clientHeight || 380);
            viewport.querySelector("canvas")?.remove();
            viewport.appendChild(renderer.domElement);

            scene.add(new T.HemisphereLight(0xddeaff, 0x18233b, 1.8));
            const light = new T.DirectionalLight(0xffffff, 2.1);
            light.position.set(5, 9, 5);
            light.castShadow = true;
            scene.add(light);

            const grid = new T.GridHelper(14, 28, 0x45658d, 0x243652);
            grid.position.y = -0.4;
            scene.add(grid);

            const board = new T.Mesh(
                new T.BoxGeometry(11, 0.2, 7),
                new T.MeshStandardMaterial({ color: 0x14233a, roughness: 0.7 })
            );
            board.position.y = -0.52;
            board.receiveShadow = true;
            scene.add(board);

            const objects = new T.Group();
            const wires = new T.Group();
            scene.add(objects, wires);

            let controls = null;
            if (T.OrbitControls) {
                controls = new T.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.target.set(0, 0, 0);
            }

            S.three = { T, scene, camera, renderer, controls, objects, wires };
            const resize = () => {
                const width = Math.max(1, viewport.clientWidth);
                const height = Math.max(1, viewport.clientHeight);
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            };
            if (window.ResizeObserver) {
                S.three.observer = new ResizeObserver(resize);
                S.three.observer.observe(viewport);
            } else {
                window.addEventListener("resize", resize);
            }
            resize();
            if ($("threeDPlaceholder")) $("threeDPlaceholder").hidden = true;
            render3D();

            const animate = () => {
                if (!S.three) return;
                S.three.frame = requestAnimationFrame(animate);
                controls?.update();
                renderer.render(scene, camera);
            };
            animate();
            notify("3D view ready. Drag to orbit; scroll to zoom.");
        } catch (error) {
            console.error(error);
            notify("Unable to start the 3D view in this browser.", true);
        }
    }

    function render3D() {
        const t = S.three;
        if (!t) return;
        const { T } = t;

        function clearGroup(group) {
            while (group.children.length) {
                const child = group.children[0];
                group.remove(child);
                child.traverse?.(obj => {
                    obj.geometry?.dispose?.();
                    if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose?.());
                    else obj.material?.dispose?.();
                });
                child.geometry?.dispose?.();
                child.material?.dispose?.();
            }
        }
        clearGroup(t.objects);
        clearGroup(t.wires);

        const columns = Math.max(1, Math.ceil(Math.sqrt(S.parts.length)));
        const spacing = Math.min(2.1, 9 / Math.max(3, columns));
        const positions = new Map();

        S.parts.forEach((part, index) => {
            const col = index % columns;
            const row = Math.floor(index / columns);
            const x = (col - (columns - 1) / 2) * spacing;
            const z = (row - (Math.ceil(S.parts.length / columns) - 1) / 2) * spacing;
            positions.set(part.id, { x, z });

            const group = new T.Group();
            group.position.set(x, 0, z);

            const mat = (color, metalness = 0.2, roughness = 0.45) =>
                new T.MeshStandardMaterial({ color, metalness, roughness });
            const bodyColor = part.type === "arduino" ? 0x16865f :
                part.type === "led" ? 0xb51f49 :
                part.type === "resistor" ? 0xb58a45 :
                part.type === "battery" ? 0x365b9b : 0x50627f;
            const body = mat(bodyColor);
            const metal = mat(0xc7d2e1, 0.8, 0.25);

            const mesh = (geometry, material, px, py, pz, rx = 0, ry = 0, rz = 0) => {
                const object = new T.Mesh(geometry, material);
                object.position.set(px, py, pz);
                object.rotation.set(rx, ry, rz);
                object.castShadow = true;
                object.receiveShadow = true;
                group.add(object);
                return object;
            };

            switch (part.type) {
                case "resistor":
                    mesh(new T.CylinderGeometry(0.16, 0.16, 0.65, 20), body, 0, 0.2, 0, 0, 0, Math.PI / 2);
                    mesh(new T.CylinderGeometry(0.035, 0.035, 0.42, 10), metal, -0.53, 0.2, 0, 0, 0, Math.PI / 2);
                    mesh(new T.CylinderGeometry(0.035, 0.035, 0.42, 10), metal, 0.53, 0.2, 0, 0, 0, Math.PI / 2);
                    break;
                case "battery":
                    mesh(new T.CylinderGeometry(0.25, 0.25, 0.9, 24), body, 0, 0.35, 0);
                    mesh(new T.CylinderGeometry(0.13, 0.13, 0.08, 20), metal, 0, 0.84, 0);
                    break;
                case "led":
                case "diode":
                case "zener":
                    mesh(new T.CylinderGeometry(0.19, 0.19, 0.45, 20), body, 0, 0.24, 0, 0, 0, Math.PI / 2);
                    mesh(new T.CylinderGeometry(0.035, 0.035, 0.35, 10), metal, -0.38, 0.24, 0, 0, 0, Math.PI / 2);
                    mesh(new T.CylinderGeometry(0.035, 0.035, 0.35, 10), metal, 0.38, 0.24, 0, 0, 0, Math.PI / 2);
                    break;
                case "capacitor":
                    mesh(new T.CylinderGeometry(0.25, 0.25, 0.5, 24), body, 0, 0.3, 0);
                    break;
                case "inductor":
                    mesh(new T.CylinderGeometry(0.19, 0.19, 0.55, 20), body, 0, 0.24, 0, 0, 0, Math.PI / 2);
                    break;
                case "arduino":
                    mesh(new T.BoxGeometry(1.25, 0.13, 0.9), mat(0x167a5b), 0, 0.08, 0);
                    mesh(new T.BoxGeometry(0.35, 0.1, 0.35), mat(0x182438), 0, 0.18, 0);
                    break;
                case "npn":
                case "pnp":
                    mesh(new T.SphereGeometry(0.28, 20, 16), body, 0, 0.28, 0);
                    break;
                case "nmos":
                    mesh(new T.BoxGeometry(0.48, 0.48, 0.32), body, 0, 0.25, 0);
                    break;
                case "ground":
                    mesh(new T.CylinderGeometry(0.23, 0.23, 0.08, 20), mat(0x10b981), 0, 0.04, 0);
                    break;
                case "switch":
                case "pushbutton":
                    mesh(new T.BoxGeometry(0.55, 0.2, 0.45), body, 0, 0.1, 0);
                    mesh(new T.BoxGeometry(0.22, 0.22, 0.22), metal, 0, 0.28, 0);
                    break;
                case "motor":
                    mesh(new T.CylinderGeometry(0.28, 0.28, 0.65, 24), body, 0, 0.3, 0, 0, 0, Math.PI / 2);
                    break;
                case "lamp":
                    mesh(new T.SphereGeometry(0.3, 24, 16), mat(0xffd166), 0, 0.3, 0);
                    break;
                default:
                    mesh(new T.BoxGeometry(0.8, 0.18, 0.55), body, 0, 0.1, 0);
            }

            const labelCanvas = document.createElement("canvas");
            labelCanvas.width = 512;
            labelCanvas.height = 128;
            const ctx = labelCanvas.getContext("2d");
            ctx.fillStyle = "#e9f1ff";
            ctx.font = "bold 34px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(String(part.label || part.type).slice(0, 25), 256, 75);

            const texture = new T.CanvasTexture(labelCanvas);
            const sprite = new T.Sprite(new T.SpriteMaterial({
                map: texture, transparent: true, depthWrite: false
            }));
            sprite.scale.set(1.5, 0.38, 1);
            sprite.position.set(0, 0.95, 0);
            group.add(sprite);
            t.objects.add(group);
        });

        S.wires.forEach(wire => {
            const a = getPin(wire.from), b = getPin(wire.to);
            if (!a || !b) return;
            const pa = positions.get(a.partId), pb = positions.get(b.partId);
            if (!pa || !pb) return;
            const points = [
                new T.Vector3(pa.x, 0.55, pa.z),
                new T.Vector3((pa.x + pb.x) / 2, 0.62, (pa.z + pb.z) / 2),
                new T.Vector3(pb.x, 0.55, pb.z)
            ];
            const geometry = new T.BufferGeometry().setFromPoints(points);
            t.wires.add(new T.Line(geometry, new T.LineBasicMaterial({
                color: wire.color || "#4ea1ff"
            })));
        });
    }

    /* -------------------- Interface events -------------------- */

    function bindEvents() {
        document.querySelectorAll("[data-part]").forEach(button => {
            button.addEventListener("click", () => addPart(button.dataset.part));
        });

        document.querySelectorAll(".category-button").forEach(button => {
            button.addEventListener("click", () => {
                document.querySelectorAll(".category-button").forEach(b => b.classList.toggle("active", b === button));
                const category = button.dataset.category || "all";
                filterParts(category);
            });
        });

        $("componentSearch")?.addEventListener("input", () => filterParts());
        $("selectTool")?.addEventListener("click", () => setTool("select"));
        $("wireTool")?.addEventListener("click", () => setTool("wire"));
        $("deleteTool")?.addEventListener("click", () => setTool("delete"));

        $("rotateButton")?.addEventListener("click", () => {
            const part = selectedPart();
            if (!part) return notify("Select a component to rotate.");
            pushHistory();
            part.rotation = ((part.rotation || 0) + 90) % 360;
            S.result = null;
            renderAll();
        });

        $("zoomIn")?.addEventListener("click", () => {
            S.zoom = clamp(S.zoom * 1.2, 0.35, 3.5);
            updateTransform();
        });
        $("zoomOut")?.addEventListener("click", () => {
            S.zoom = clamp(S.zoom / 1.2, 0.35, 3.5);
            updateTransform();
        });
        $("fitCanvas")?.addEventListener("click", () => {
            S.zoom = 1;
            S.panX = 0;
            S.panY = 0;
            updateTransform();
        });

        $("exportSvgButton")?.addEventListener("click", exportSVG);
        $("exportPngButton")?.addEventListener("click", exportPNG);
        $("downloadProjectButton")?.addEventListener("click", saveProject);
        $("saveProjectButton")?.addEventListener("click", saveProject);

        $("openProjectButton")?.addEventListener("click", () => $("projectFileInput")?.click());
        $("projectFileInput")?.addEventListener("change", async event => {
            const file = event.target.files?.[0];
            if (!file) return;
            try {
                loadProject(JSON.parse(await file.text()));
            } catch (_) {
                notify("Could not open that project file.", true);
            }
            event.target.value = "";
        });

        $("newProjectButton")?.addEventListener("click", () => {
            if ((S.parts.length || S.wires.length) &&
                !confirm("Start a new circuit? Save the current project first if needed.")) return;
            pushHistory();
            S.parts = [];
            S.wires = [];
            S.selected = null;
            S.result = null;
            if ($("projectName")) $("projectName").value = "Untitled Circuit";
            pushHistory();
            renderAll();
        });

        $("undoButton")?.addEventListener("click", () => restoreHistory(S.historyIndex - 1));
        $("redoButton")?.addEventListener("click", () => restoreHistory(S.historyIndex + 1));

        $("clearBoardButton")?.addEventListener("click", () => {
            if (!S.parts.length && !S.wires.length) return;
            if (!confirm("Clear all components and wires?")) return;
            pushHistory();
            S.parts = [];
            S.wires = [];
            S.selected = null;
            S.result = null;
            renderAll();
        });

        $("componentLabel")?.addEventListener("change", () => {
            const part = selectedPart();
            if (!part) return;
            pushHistory();
            part.label = $("componentLabel").value.trim() || defs[part.type].name;
            part.props.label = part.label;
            renderAll();
        });

        $("componentModel")?.addEventListener("change", () => {
            const part = selectedPart();
            if (!part) return;
            pushHistory();
            part.model = $("componentModel").value;
        });

        $("resetPropertiesButton")?.addEventListener("click", () => {
            const part = selectedPart();
            if (!part) return;
            pushHistory();
            part.props = clone(defs[part.type].props);
            part.label = part.props.label || defs[part.type].name;
            renderAll();
        });

        $("runSimulationButton")?.addEventListener("click", () => {
            try {
                S.result = null;
                showResult(solveDC());
            } catch (error) {
                simulationError(error.message || "DC solver error.");
            }
        });

        $("stopSimulationButton")?.addEventListener("click", () =>
            notify("The DC calculation is synchronous and has already finished.")
        );

        $("themeToggle")?.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            document.body.dataset.theme =
                document.body.classList.contains("light-mode") ? "light" : "dark";
        });

        $("languageToggle")?.addEventListener("click", () =>
            notify("Sinhala interface translations need to be added to the interface text.")
        );

        $("mobileMenuToggle")?.addEventListener("click", () =>
            $("circuitNavLinks")?.classList.toggle("open")
        );

        $("open3DButton")?.addEventListener("click", init3D);
        $("reset3DButton")?.addEventListener("click", () => {
            if (!S.three) return init3D();
            S.three.camera.position.set(0, 6, 10);
            S.three.controls?.reset();
            S.three.controls?.update();
        });

        document.querySelectorAll("[data-lesson]").forEach(button =>
            button.addEventListener("click", () => openLesson(button.dataset.lesson))
        );
        $("closeLessonButton")?.addEventListener("click", () => {
            if ($("lessonContent")) $("lessonContent").hidden = true;
        });

        const svg = $("circuitSvg");

        svg?.addEventListener("pointermove", event => {
            const point = pointFromEvent(event);
            if ($("coordinateReadout")) {
                $("coordinateReadout").textContent = `X ${Math.round(point.x)} · Y ${Math.round(point.y)}`;
            }

            if (S.wireStart) {
                S.wirePreview = point;
                renderPreview();
            }

            if (S.drag) {
                const part = S.parts.find(p => p.id === S.drag.id);
                if (!part) return;
                const dx = point.x - S.drag.start.x;
                const dy = point.y - S.drag.start.y;
                if (Math.abs(dx) + Math.abs(dy) > 3) S.drag.moved = true;
                if (S.drag.moved) {
                    part.x = snap(S.drag.x + dx);
                    part.y = snap(S.drag.y + dy);
                    renderAll();
                }
            }
        });

        svg?.addEventListener("pointerup", () => {
            if (S.drag?.moved) {
                // Record the resulting layout after a drag.
                pushHistory();
                renderAll();
            }
            S.drag = null;
        });

        svg?.addEventListener("pointerleave", () => {
            if (S.drag) {
                S.drag = null;
                renderAll();
            }
        });

        svg?.addEventListener("click", event => {
            if (event.target.closest("[data-component-id], [data-pin-id], [data-wire-id]")) return;
            if (S.tool === "select") {
                S.selected = null;
                renderAll();
            }
        });

        svg?.addEventListener("wheel", event => {
            if (!event.ctrlKey && !event.metaKey) return;
            event.preventDefault();
            S.zoom = clamp(S.zoom * (event.deltaY < 0 ? 1.1 : 0.9), 0.35, 3.5);
            updateTransform();
        }, { passive: false });

        document.addEventListener("keydown", event => {
            const tag = document.activeElement?.tagName?.toLowerCase();
            if (["input", "textarea", "select"].includes(tag) || document.activeElement?.isContentEditable) return;

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
                event.preventDefault();
                restoreHistory(S.historyIndex + (event.shiftKey ? 1 : -1));
            } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
                event.preventDefault();
                restoreHistory(S.historyIndex + 1);
            } else if (event.key === "Delete" || event.key === "Backspace") {
                if (S.selected) {
                    if (S.selected.startsWith("W")) deleteWire(S.selected);
                    else deletePart(S.selected);
                }
            } else if (event.key.toLowerCase() === "w") {
                setTool("wire");
            } else if (event.key.toLowerCase() === "v" || event.key === "Escape") {
                setTool("select");
            } else if (event.key.toLowerCase() === "r") {
                $("rotateButton")?.click();
            }
        });
    }

    function filterParts(category = "all") {
        const query = ($("componentSearch")?.value || "").toLowerCase().trim();
        document.querySelectorAll(".component-item").forEach(button => {
            const d = defs[button.dataset.part];
            if (!d) return;
            const categoryMatch = category === "all" || d.category === category;
            const queryMatch = `${d.name} ${button.dataset.part} ${d.category}`.toLowerCase().includes(query);
            button.hidden = !(categoryMatch && queryMatch);
        });
    }

    function initialize() {
        if (!$("circuitSvg")) {
            console.error("Circuit Studio: #circuitSvg not found. Check circuit.html.");
            return;
        }

        ensureLayers();
        bindEvents();
        renderAll();
        validateBeforeRun();
        pushHistory();

        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                if (data.format === "AMDS-CircuitStudio") {
                    const button = document.createElement("button");
                    button.type = "button";
                    button.className = "circuit-button secondary-button";
                    button.textContent = "Restore saved project";
                    button.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:1500";
                    button.addEventListener("click", () => {
                        loadProject(data);
                        button.remove();
                    });
                    document.body.appendChild(button);
                    setTimeout(() => button.remove(), 12000);
                }
            }
        } catch (_) {}

        console.info("AM Digital Studio Circuit Studio initialized.");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize, { once: true });
    } else {
        initialize();
    }
})();
