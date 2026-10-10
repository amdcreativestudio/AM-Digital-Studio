
/* ==========================================================
   AM DIGITAL STUDIO — CIRCUIT STUDIO
   Interactive DC Electronics Learning Editor
   Requires: circuit.html + circuit.css
========================================================== */

(() => {
    "use strict";

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const svgNS = "http://www.w3.org/2000/svg";
    const STORAGE_KEY = "amCircuitStudioProject_v2";
    const MAX_HISTORY = 60;

    const svg = $("#circuitSvg");
    const canvas = $("#schematicCanvas");
    const componentLayer = $("#componentLayer");
    const wireLayer = $("#wireLayer");
    const interactionLayer = $("#interactionLayer");

    if (!svg || !canvas || !componentLayer || !wireLayer) {
        console.error("Circuit Studio: required HTML elements are missing.");
        return;
    }

    const partInfo = {
        battery:    { name: "DC Battery", value: 5, unit: "V", color: "#6366f1" },
        resistor:   { name: "Resistor", value: 220, unit: "ohm", color: "#d97706" },
        led:        { name: "LED", value: 2, unit: "V", color: "#fb526f" },
        switch:     { name: "Switch", value: 1, unit: "none", color: "#0284c7" },
        capacitor:  { name: "Capacitor", value: 100, unit: "uF", color: "#8b5cf6" },
        diode:      { name: "Diode", value: 0.7, unit: "V", color: "#0d9488" },
        transistor: { name: "Transistor", value: 100, unit: "none", color: "#64748b" },
        motor:      { name: "DC Motor", value: 5, unit: "V", color: "#0284c7" },
        arduino:    { name: "Arduino Uno", value: 5, unit: "V", color: "#059669" },
        logic:      { name: "Logic gate", value: 0, unit: "none", color: "#9333ea" }
    };

    const state = {
        components: [],
        wires: [],
        selectedId: null,
        tool: "select",
        wireStartId: null,
        zoom: 1,
        language: "en",
        counter: 0,
        history: [],
        historyIndex: -1,
        drag: null,
        suppressClick: false,
        simulation: null
    };

    const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

    function uid(prefix = "part") {
        state.counter += 1;
        return `${prefix}_${Date.now().toString(36)}_${state.counter}`;
    }

    function notify(message) {
        const toast = $("#circuitToast");

        if (!toast) {
            console.log(message);
            return;
        }

        toast.textContent = message;
        toast.hidden = false;

        clearTimeout(notify.timer);
        notify.timer = setTimeout(() => {
            toast.hidden = true;
        }, 2800);
    }

    function svgElement(tag, attributes = {}, parent = componentLayer) {
        const el = document.createElementNS(svgNS, tag);

        Object.entries(attributes).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                el.setAttribute(key, String(value));
            }
        });

        parent.appendChild(el);
        return el;
    }

    function addText(parent, x, y, text, options = {}) {
        const el = document.createElementNS(svgNS, "text");

        el.setAttribute("x", x);
        el.setAttribute("y", y);
        el.setAttribute("fill", options.fill || "#dbeafe");
        el.setAttribute("font-size", options.size || 12);
        el.setAttribute("font-weight", options.weight || 600);
        el.setAttribute("text-anchor", options.anchor || "middle");

        el.textContent = text;
        parent.appendChild(el);

        return el;
    }

    function getPart(id) {
        return state.components.find(part => part.id === id);
    }

    function getWire(id) {
        return state.wires.find(wire => wire.id === id);
    }

    function selectedPart() {
        return getPart(state.selectedId);
    }

    function getPorts(part) {
        const rad = (part.rotation || 0) * Math.PI / 180;
        const dx = Math.cos(rad) * 48;
        const dy = Math.sin(rad) * 48;

        return [
            { x: part.x - dx, y: part.y - dy },
            { x: part.x + dx, y: part.y + dy }
        ];
    }

    function pointOnCanvas(event) {
        const point = svg.createSVGPoint();

        point.x = event.clientX;
        point.y = event.clientY;

        const matrix = svg.getScreenCTM();

        if (!matrix) return { x: 500, y: 325 };

        const transformed = point.matrixTransform(matrix.inverse());

        return {
            x: clamp(transformed.x, 25, 975),
            y: clamp(transformed.y, 25, 625)
        };
    }

    function makePart(type, x, y) {
        const info = partInfo[type];

        if (!info) {
            notify("Unknown component type.");
            return null;
        }

        const part = {
            id: uid(),
            type,
            label: `${type.toUpperCase()}${state.components.filter(p => p.type === type).length + 1}`,
            value: info.value,
            unit: info.unit,
            rotation: 0,
            x: clamp(x, 60, 940),
            y: clamp(y, 60, 590),
            switchClosed: true,
            logicType: "AND",
            inputA: 0,
            inputB: 0
        };

        state.components.push(part);
        state.selectedId = part.id;
        state.simulation = null;

        return part;
    }

    function recordHistory() {
        const snapshot = JSON.stringify({
            components: state.components,
            wires: state.wires,
            selectedId: state.selectedId,
            counter: state.counter
        });

        if (state.history[state.historyIndex] === snapshot) return;

        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push(snapshot);

        if (state.history.length > MAX_HISTORY) {
            state.history.shift();
        }

        state.historyIndex = state.history.length - 1;
        updateHistoryButtons();
    }

    function restoreSnapshot(snapshot) {
        const data = JSON.parse(snapshot);

        state.components = data.components || [];
        state.wires = data.wires || [];
        state.selectedId = data.selectedId || null;
        state.counter = Math.max(state.counter, data.counter || 0);
        state.wireStartId = null;
        state.simulation = null;

        render();
        renderProperties();
        updateSimulationDisplay();
        updateHistoryButtons();
    }

    function undo() {
        if (state.historyIndex <= 0) return;

        state.historyIndex--;
        restoreSnapshot(state.history[state.historyIndex]);
    }

    function redo() {
        if (state.historyIndex >= state.history.length - 1) return;

        state.historyIndex++;
        restoreSnapshot(state.history[state.historyIndex]);
    }

    function updateHistoryButtons() {
        const undoBtn = $("#undoCircuit");
        const redoBtn = $("#redoCircuit");

        if (undoBtn) undoBtn.disabled = state.historyIndex <= 0;

        if (redoBtn) {
            redoBtn.disabled =
                state.historyIndex >= state.history.length - 1;
        }
    }

    /* ---------------- COMPONENT DRAWING ---------------- */

    function drawBattery(g, part) {
        svgElement("line", {
            x1: -12, y1: -14, x2: -12, y2: 14,
            stroke: partInfo.battery.color, "stroke-width": 4
        }, g);

        svgElement("line", {
            x1: 1, y1: -25, x2: 1, y2: 25,
            stroke: partInfo.battery.color, "stroke-width": 4
        }, g);

        addText(g, -12, -24, "−", { fill: "#93c5fd", size: 13 });
        addText(g, 1, -34, "+", { fill: "#fca5a5", size: 13 });

        addText(g, 0, 43, `${part.value} ${part.unit}`, {
            fill: "#a5b4fc",
            size: 11
        });
    }

    function drawResistor(g, part) {
        svgElement("rect", {
            x: -28, y: -11, width: 56, height: 22, rx: 4,
            fill: "#f5d8a5", stroke: "#d97706", "stroke-width": 2
        }, g);

        [-17, -7, 3, 13, 23].forEach((x, i) => {
            svgElement("line", {
                x1: x, y1: -10, x2: x, y2: 10,
                stroke: ["#78350f", "#b91c1c", "#78350f", "#92400e", "#78350f"][i],
                "stroke-width": 3
            }, g);
        });

        addText(g, 0, -20, `${part.value} Ω`, {
            fill: "#fbbf24",
            size: 11
        });
    }

    function drawLED(g, part) {
        const lit = Boolean(
            state.simulation &&
            state.simulation.ledOn &&
            state.simulation.pathIds.includes(part.id)
        );

        if (lit) {
            svgElement("circle", {
                cx: 0, cy: 0, r: 23,
                fill: "#fb526f", opacity: 0.18
            }, g);
        }

        svgElement("path", {
            d: "M -14 -15 L -14 15 L 14 0 Z",
            fill: lit ? "#fb7185" : "#be7187",
            stroke: "#fb7185",
            "stroke-width": 2
        }, g);

        svgElement("line", {
            x1: 17, y1: -16, x2: 17, y2: 16,
            stroke: "#fda4af", "stroke-width": 3
        }, g);

        svgElement("path", {
            d: "M 4 -20 L 14 -29 M 9 -29 L 14 -29 L 14 -24",
            fill: "none", stroke: "#fda4af", "stroke-width": 1.7
        }, g);

        addText(g, 0, 43, "LED", {
            fill: lit ? "#fb7185" : "#cbd5e1",
            size: 11
        });
    }

    function drawSwitch(g, part) {
        const closed = part.switchClosed !== false;

        svgElement("circle", {
            cx: -24, cy: 0, r: 4, fill: "#f8fafc"
        }, g);

        svgElement("circle", {
            cx: 24, cy: 0, r: 4, fill: "#f8fafc"
        }, g);

        svgElement("line", {
            x1: -24, y1: 0,
            x2: closed ? 24 : 15,
            y2: closed ? 0 : -20,
            stroke: closed ? "#10b981" : "#94a3b8",
            "stroke-width": 3,
            "stroke-linecap": "round"
        }, g);

        addText(g, 0, 38, closed ? "CLOSED" : "OPEN", {
            fill: closed ? "#6ee7b7" : "#fca5a5",
            size: 10
        });
    }

    function drawCapacitor(g, part) {
        svgElement("line", {
            x1: -7, y1: -22, x2: -7, y2: 22,
            stroke: "#c4b5fd", "stroke-width": 4
        }, g);

        svgElement("line", {
            x1: 7, y1: -22, x2: 7, y2: 22,
            stroke: "#c4b5fd", "stroke-width": 4
        }, g);

        addText(g, 0, 42, `${part.value} µF`, {
            fill: "#c4b5fd", size: 11
        });
    }

    function drawDiode(g) {
        svgElement("path", {
            d: "M -15 -15 L -15 15 L 15 0 Z",
            fill: "#5eead4",
            stroke: "#0d9488",
            "stroke-width": 2
        }, g);

        svgElement("line", {
            x1: 16, y1: -16, x2: 16, y2: 16,
            stroke: "#5eead4", "stroke-width": 3
        }, g);
    }

    function drawTransistor(g, part) {
        svgElement("circle", {
            cx: 0, cy: 0, r: 26,
            fill: "#1e293b", stroke: "#94a3b8", "stroke-width": 2
        }, g);

        svgElement("line", {
            x1: -12, y1: -18, x2: -12, y2: 18,
            stroke: "#cbd5e1", "stroke-width": 3
        }, g);

        svgElement("line", {
            x1: -12, y1: -8, x2: 12, y2: -22,
            stroke: "#cbd5e1", "stroke-width": 2
        }, g);

        svgElement("line", {
            x1: -12, y1: 8, x2: 12, y2: 22,
            stroke: "#cbd5e1", "stroke-width": 2
        }, g);

        addText(g, 0, 44, part.label, {
            fill: "#cbd5e1", size: 10
        });
    }

    function drawMotor(g) {
        svgElement("circle", {
            cx: 0, cy: 0, r: 23,
            fill: "#dbeafe", stroke: "#0284c7", "stroke-width": 3
        }, g);

        addText(g, 0, 6, "M", {
            fill: "#075985", size: 20, weight: 800
        });
    }

    function drawArduino(g) {
        svgElement("rect", {
            x: -43, y: -29, width: 86, height: 58, rx: 7,
            fill: "#065f46", stroke: "#34d399", "stroke-width": 2
        }, g);

        svgElement("rect", {
            x: -12, y: -13, width: 25, height: 25, rx: 3,
            fill: "#d1fae5"
        }, g);

        addText(g, 0, 5, "IC", {
            fill: "#065f46", size: 10
        });

        addText(g, 0, 44, "ARDUINO", {
            fill: "#6ee7b7", size: 10
        });

        for (let x = -32; x <= 32; x += 16) {
            svgElement("circle", {
                cx: x, cy: -34, r: 3, fill: "#fbbf24"
            }, g);

            svgElement("circle", {
                cx: x, cy: 34, r: 3, fill: "#fbbf24"
            }, g);
        }
    }

    function drawLogic(g, part) {
        const type = part.logicType || "AND";

        let d;

        if (type === "NOT") {
            d = "M -20 -24 L -20 24 L 15 0 Z";
        } else if (type === "OR") {
            d = "M -25 -25 Q -5 0 -25 25 Q 8 20 23 0 Q 8 -20 -25 -25 Z";
        } else {
            d = "M -25 -25 L 0 -25 Q 26 -25 26 0 Q 26 25 0 25 L -25 25 Z";
        }

        svgElement("path", {
            d,
            fill: "#312e81",
            stroke: "#a78bfa",
            "stroke-width": 2
        }, g);

        addText(g, 0, 5, type, {
            fill: "#ede9fe", size: type === "NOT" ? 10 : 11
        });
    }

    function renderComponent(part) {
        const g = svgElement("g", {
            "data-component-id": part.id,
            transform: `translate(${part.x} ${part.y}) rotate(${part.rotation || 0})`,
            class: state.selectedId === part.id ? "selected-component" : ""
        });

        const info = partInfo[part.type];

        svgElement("rect", {
            x: -44, y: -39, width: 88, height: 78, rx: 9,
            fill: state.selectedId === part.id ? "#2563eb" : "transparent",
            "fill-opacity": state.selectedId === part.id ? 0.09 : 0,
            stroke: state.selectedId === part.id ? "#60a5fa" : "transparent",
            "stroke-dasharray": "4 3"
        }, g);

        // Hit area makes small symbols easier to select and drag.
        svgElement("rect", {
            x: -43, y: -35, width: 86, height: 70, rx: 8,
            fill: "transparent",
            stroke: "none",
            "pointer-events": "all"
        }, g);

        switch (part.type) {
            case "battery": drawBattery(g, part); break;
            case "resistor": drawResistor(g, part); break;
            case "led": drawLED(g, part); break;
            case "switch": drawSwitch(g, part); break;
            case "capacitor": drawCapacitor(g, part); break;
            case "diode": drawDiode(g); break;
            case "transistor": drawTransistor(g, part); break;
            case "motor": drawMotor(g); break;
            case "arduino": drawArduino(g); break;
            case "logic": drawLogic(g, part); break;
        }

        // Two conceptual connection terminals per component.
        const ports = getPorts(part);

        ports.forEach((port, index) => {
            const localX = index === 0 ? -48 : 48;

            svgElement("circle", {
                cx: localX, cy: 0, r: 5,
                fill: "#f8fafc",
                stroke: "#64748b",
                "stroke-width": 1.5,
                "data-port": index,
                "data-component-id": part.id
            }, g);
        });

        addText(g, 0, 58, part.label, {
            fill: state.selectedId === part.id ? "#93c5fd" : "#cbd5e1",
            size: 11
        });

        return g;
    }

    /* ---------------- WIRE DRAWING ---------------- */

    function renderWire(wire) {
        const a = getPart(wire.from);
        const b = getPart(wire.to);

        if (!a || !b) return;

        const portsA = getPorts(a);
        const portsB = getPorts(b);

        const p1 = portsA[wire.fromPort ?? 1];
        const p2 = portsB[wire.toPort ?? 0];

        const selected = wire.id === state.selectedId;

        const g = svgElement("g", {
            "data-wire-id": wire.id,
            class: selected ? "selected-wire" : ""
        }, wireLayer);

        // Orthogonal path with a middle bend.
        const midX = (p1.x + p2.x) / 2;

        const path = svgElement("path", {
            d: `M ${p1.x} ${p1.y} H ${midX} V ${p2.y} H ${p2.x}`,
            fill: "none",
            stroke: selected ? "#60a5fa" : "#64748b",
            "stroke-width": selected ? 4 : 3,
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
        }, g);

        // Wider invisible line for easier selection.
        svgElement("path", {
            d: path.getAttribute("d"),
            fill: "none",
            stroke: "transparent",
            "stroke-width": 14,
            "pointer-events": "stroke",
            "data-wire-id": wire.id
        }, g);

        svgElement("circle", {
            cx: p1.x, cy: p1.y, r: 3,
            fill: "#93c5fd"
        }, g);

        svgElement("circle", {
            cx: p2.x, cy: p2.y, r: 3,
            fill: "#93c5fd"
        }, g);
    }

    function render() {
        componentLayer.replaceChildren();
        wireLayer.replaceChildren();

        state.wires.forEach(renderWire);
        state.components.forEach(renderComponent);

        const emptyMessage = $("#emptyBoardMessage");

        if (emptyMessage) {
            emptyMessage.hidden = state.components.length > 0;
        }

        const count = $("#componentCount");

        if (count) {
            count.textContent = String(state.components.length);
        }

        const boardStatus = $("#boardStatus");

        if (boardStatus) {
            boardStatus.textContent = state.components.length
                ? `${state.components.length} components · ${state.wires.length} wires`
                : "Empty workspace · Ready to design";
        }

        updateToolStatus();
    }

    /* ---------------- SELECTION / PROPERTIES ---------------- */

    function selectComponent(id) {
        state.selectedId = id;
        render();
        renderProperties();
    }

    function renderProperties() {
        const part = selectedPart();
        const noSelection = $("#noSelectionMessage");
        const props = $("#componentProperties");

        if (!props || !noSelection) return;

        noSelection.hidden = Boolean(part);
        props.hidden = !part;

        if (!part) return;

        $("#selectedComponentName").textContent =
            partInfo[part.type]?.name || part.type;

        $("#componentLabel").value = part.label;
        $("#componentValue").value = part.value;
        $("#componentUnit").value = part.unit;
        $("#componentType").value =
            part.type === "logic" ? (part.logicType || "and").toLowerCase() :
            part.type === "transistor" ? "npn" : "default";

        // Component type selector is only applicable to relevant parts.
        $("#componentType").disabled =
            !["logic", "transistor"].includes(part.type);

        const switchValue = $("#switchValue");

        if (switchValue) {
            switchValue.value = part.switchClosed === false ? "open" : "closed";
        }
    }

    function applyProperties() {
        const part = selectedPart();

        if (!part) {
            notify("Select a component first.");
            return;
        }

        const label = $("#componentLabel").value.trim();
        const value = Number($("#componentValue").value);

        if (!Number.isFinite(value) || value < 0) {
            notify("Enter a valid component value.");
            return;
        }

        if (label) part.label = label.slice(0, 40);

        part.value = value;
        part.unit = $("#componentUnit").value;

        const type = $("#componentType").value;

        if (part.type === "logic" && ["and", "or", "not"].includes(type)) {
            part.logicType = type.toUpperCase();
        }

        if (part.type === "transistor" && ["npn", "pnp"].includes(type)) {
            part.transistorType = type.toUpperCase();
        }

        state.simulation = null;

        recordHistory();
        render();
        renderProperties();
        updateSimulationDisplay();

        notify("Component properties updated.");
    }

    /* ---------------- ADD / MOVE / ROTATE ---------------- */

    function addComponent(type) {
        if (!partInfo[type]) return;

        const offset = state.components.length % 8;

        const part = makePart(
            type,
            500 + offset * 12,
            300 + offset * 12
        );

        if (!part) return;

        recordHistory();
        render();
        renderProperties();

        notify(`${partInfo[type].name} added to the board.`);
    }

    function removeSelected() {
        if (state.selectedId) {
            const part = getPart(state.selectedId);

            if (part) {
                state.components = state.components.filter(
                    item => item.id !== part.id
                );

                state.wires = state.wires.filter(
                    wire => wire.from !== part.id && wire.to !== part.id
                );

                state.selectedId = null;
                state.wireStartId = null;
                state.simulation = null;

                recordHistory();
                render();
                renderProperties();
                updateSimulationDisplay();

                notify("Component deleted.");
                return;
            }

            const wire = getWire(state.selectedId);

            if (wire) {
                state.wires = state.wires.filter(item => item.id !== wire.id);
                state.selectedId = null;

                recordHistory();
                render();
                renderProperties();

                notify("Wire deleted.");
                return;
            }
        }

        notify("Select a component or wire to delete.");
    }

    function rotateSelected() {
        const part = selectedPart();

        if (!part) {
            notify("Select a component to rotate.");
            return;
        }

        part.rotation = ((part.rotation || 0) + 90) % 360;

        recordHistory();
        render();

        notify("Component rotated.");
    }

    function clearBoard() {
        if (!state.components.length && !state.wires.length) {
            notify("The board is already empty.");
            return;
        }

        if (!window.confirm("Clear all components and wires from the board?")) {
            return;
        }

        state.components = [];
        state.wires = [];
        state.selectedId = null;
        state.wireStartId = null;
        state.simulation = null;

        recordHistory();
        render();
        renderProperties();
        updateSimulationDisplay();

        notify("Workspace cleared.");
    }

    function setTool(tool) {
        state.tool = tool;
        state.wireStartId = null;

        ["selectTool", "wireMode", "deleteTool"].forEach(id => {
            const btn = $("#" + id);

            if (btn) {
                btn.classList.toggle(
                    "active",
                    (id === "selectTool" && tool === "select") ||
                    (id === "wireMode" && tool === "wire") ||
                    (id === "deleteTool" && tool === "delete")
                );
            }
        });

        updateToolStatus();
    }

    function updateToolStatus() {
        const el = $("#toolStatus");

        if (!el) return;

        const messages = {
            select: state.language === "si"
                ? "Component එකක් තෝරාගෙන ගෙනියන්න."
                : "Select and drag components to position them.",
            wire: state.language === "si"
                ? "සම්බන්ධ කිරීමට components දෙකක් තෝරන්න."
                : "Select two components to connect them with a wire.",
            delete: state.language === "si"
                ? "මකා දැමීමට component එකක් හෝ wire එකක් තෝරන්න."
                : "Select a component or wire to delete it."
        };

        el.textContent = messages[state.tool] || messages.select;
    }

    /* ---------------- DRAGGING ---------------- */

    svg.addEventListener("pointerdown", event => {
        const componentGroup = event.target.closest("[data-component-id]");

        if (!componentGroup) return;

        const id = componentGroup.getAttribute("data-component-id");
        const part = getPart(id);

        if (!part) return;

        if (state.tool === "delete") {
            event.preventDefault();
            state.selectedId = id;
            removeSelected();
            return;
        }

        if (state.tool === "wire") return;

        if (event.target.hasAttribute("data-port")) return;

        if (event.button !== 0) return;

        event.preventDefault();

        selectComponent(id);

        const point = pointOnCanvas(event);

        state.drag = {
            id,
            startX: part.x,
            startY: part.y,
            pointerX: point.x,
            pointerY: point.y,
            moved: false
        };

        try {
            svg.setPointerCapture(event.pointerId);
        } catch (_) {}
    });

    svg.addEventListener("pointermove", event => {
        if (!state.drag) return;

        const point = pointOnCanvas(event);
        const part = getPart(state.drag.id);

        if (!part) return;

        const dx = point.x - state.drag.pointerX;
        const dy = point.y - state.drag.pointerY;

        if (Math.abs(dx) + Math.abs(dy) > 1) {
            state.drag.moved = true;
        }

        part.x = clamp(state.drag.startX + dx, 45, 955);
        part.y = clamp(state.drag.startY + dy, 45, 605);

        render();
    });

    function finishDrag() {
        if (!state.drag) return;

        const moved = state.drag.moved;

        state.drag = null;

        if (moved) {
            state.suppressClick = true;
            recordHistory();
            setTimeout(() => {
                state.suppressClick = false;
            }, 80);
        }
    }

    svg.addEventListener("pointerup", finishDrag);
    svg.addEventListener("pointercancel", finishDrag);

    /* ---------------- WIRE MODE ---------------- */

    function connectComponents(fromId, toId) {
        if (fromId === toId) {
            notify("Choose a different component.");
            return;
        }

        const exists = state.wires.some(wire =>
            (wire.from === fromId && wire.to === toId) ||
            (wire.from === toId && wire.to === fromId)
        );

        if (exists) {
            notify("These components already have a wire.");
            return;
        }

        state.wires.push({
            id: uid("wire"),
            from: fromId,
            to: toId,
            fromPort: 1,
            toPort: 0
        });

        state.selectedId = null;
        state.wireStartId = null;
        state.simulation = null;

        recordHistory();
        render();
        renderProperties();
        updateSimulationDisplay();

        notify("Wire connected.");
    }

    svg.addEventListener("click", event => {
        if (state.suppressClick) return;

        const wireGroup = event.target.closest("[data-wire-id]");

        if (wireGroup) {
            const id = wireGroup.getAttribute("data-wire-id");

            if (state.tool === "delete") {
                state.selectedId = id;
                removeSelected();
            } else if (state.tool === "select") {
                state.selectedId = id;
                render();
                renderProperties();
            }

            return;
        }

        const componentGroup = event.target.closest("[data-component-id]");

        if (!componentGroup) {
            if (state.tool === "wire") {
                state.wireStartId = null;
                updateToolStatus();
            }

            return;
        }

        const id = componentGroup.getAttribute("data-component-id");

        if (state.tool === "delete") {
            state.selectedId = id;
            removeSelected();
            return;
        }

        if (state.tool !== "wire") return;

        if (!state.wireStartId) {
            state.wireStartId = id;
            state.selectedId = id;

            render();
            updateToolStatus();

            notify("Now select the second component.");
            return;
        }

        connectComponents(state.wireStartId, id);
    });

    /* ---------------- BASIC DC CIRCUIT ANALYSIS ---------------- */

    function findPath(startId, targetId, excludedId) {
        const queue = [{
            id: startId,
            path: [startId],
            edges: []
        }];

        const visited = new Set([startId]);

        while (queue.length) {
            const current = queue.shift();

            if (current.id === targetId) {
                return current;
            }

            const part = getPart(current.id);

            if (!part) continue;

            // A switch in its open state breaks the circuit.
            if (part.type === "switch" && part.switchClosed === false) {
                continue;
            }

            for (const wire of state.wires) {
                let nextId = null;

                if (wire.from === current.id) nextId = wire.to;
                if (wire.to === current.id) nextId = wire.from;

                if (!nextId || nextId === excludedId || visited.has(nextId)) {
                    continue;
                }

                const nextPart = getPart(nextId);

                if (!nextPart) continue;

                visited.add(nextId);

                queue.push({
                    id: nextId,
                    path: [...current.path, nextId],
                    edges: [...current.edges, wire.id]
                });
            }
        }

        return null;
    }

    function analyseCircuit() {
        const supply = clamp(Number($("#supplyVoltage")?.value) || 5, 1, 12);
        const defaultR = clamp(Number($("#resistanceValue")?.value) || 220, 100, 10000);
        const switchOpen = $("#switchValue")?.value === "open";

        const batteries = state.components.filter(p => p.type === "battery");
        const leds = state.components.filter(p => p.type === "led");

        if (!state.components.length) {
            return {
                ok: false,
                message: "Add components to begin."
            };
        }

        if (switchOpen) {
            return {
                ok: true,
                current: 0,
                power: 0,
                ledVoltage: 0,
                ledOn: false,
                pathIds: [],
                message: "The switch is open. The circuit path is broken."
            };
        }

        if (!batteries.length || !leds.length) {
            return {
                ok: false,
                message: "For this simplified demo, add a DC battery and an LED."
            };
        }

        const battery = batteries[0];

        let best = null;

        // Treat the battery as the source. Search for a connected path
        // between other components; this is a simplified teaching model.
        for (const led of leds) {
            const path = findPath(battery.id, led.id, battery.id);

            if (path) {
                best = { battery, led, path };
                break;
            }
        }

        // A practical two-terminal circuit needs wires on both sides of
        // the component chain. This prototype uses a simplified topology.
        if (!best || state.wires.length < 2) {
            return {
                ok: false,
                message: "Connect the battery, resistor and LED with wires to form a closed path."
            };
        }

        const pathParts = best.path.path
            .map(id => getPart(id))
            .filter(Boolean);

        const hasResistor = pathParts.some(p => p.type === "resistor");
        const resistancePart = pathParts.find(p => p.type === "resistor");

        if (!hasResistor) {
            return {
                ok: false,
                message: "Add a resistor in the LED circuit to limit current."
            };
        }

        const r = Math.max(
            1,
            Number(resistancePart.value) || defaultR
        );

        const ledForwardVoltage = Math.max(
            0.1,
            Number(best.led.value) || 2
        );

        const batteryVoltage = clamp(
            Number(battery.value) || supply,
            0,
            12
        );

        const voltage = Math.min(supply, batteryVoltage);

        if (voltage <= ledForwardVoltage) {
            return {
                ok: true,
                current: 0,
                power: 0,
                ledVoltage: voltage,
                ledOn: false,
                pathIds: best.path.path,
                message: "The supply voltage is not enough for the simplified LED model."
            };
        }

        const current = (voltage - ledForwardVoltage) / r;
        const power = current * current * r;

        return {
            ok: true,
            current,
            power,
            ledVoltage: ledForwardVoltage,
            ledOn: current > 0,
            pathIds: best.path.path,
            message: "A connected DC path was found in the simplified teaching model."
        };
    }

    function updateSimulationDisplay() {
        const result = state.simulation;

        const current = $("#currentResult");
        const led = $("#ledResult");
        const power = $("#powerResult");
        const voltage = $("#ledVoltageResult");
        const explanation = $("#explanationText");
        const status = $("#simulationStatus");

        if (!result) {
            if (current) current.textContent = "—";
            if (led) led.textContent = "—";
            if (power) power.textContent = "—";
            if (voltage) voltage.textContent = "—";

            if (explanation) {
                explanation.textContent = "Add components, connect wires and run the simulation.";
            }

            if (status) {
                status.textContent = "Not simulated";
                status.className = "simulation-status";
            }

            return;
        }

        if (!result.ok) {
            if (current) current.textContent = "—";
            if (led) led.textContent = "—";
            if (power) power.textContent = "—";
            if (voltage) voltage.textContent = "—";

            if (explanation) explanation.textContent = result.message;

            if (status) {
                status.textContent = "Check connections";
                status.className = "simulation-status error";
            }

            return;
        }

        if (current) current.textContent = `${(result.current * 1000).toFixed(2)} mA`;
        if (led) {
            led.textContent = result.ledOn ? "ON" : "OFF";
            led.style.color = result.ledOn ? "#10b981" : "#94a3b8";
        }
        if (power) power.textContent = `${result.power.toFixed(4)} W`;
        if (voltage) voltage.textContent = `${result.ledVoltage.toFixed(2)} V`;

        if (explanation) explanation.textContent = result.message;

        if (status) {
            status.textContent = "Simulation complete";
            status.className = "simulation-status running";
        }
    }

    function runSimulation() {
        // Synchronize the main supply control with the demo battery.
        const voltage = clamp(Number($("#supplyVoltage")?.value) || 5, 1, 12);
        const resistance = clamp(Number($("#resistanceValue")?.value) || 220, 100, 10000);

        const battery = state.components.find(p => p.type === "battery");

        if (battery) battery.value = voltage;

        const resistor = state.components.find(p => p.type === "resistor");

        if (resistor) resistor.value = resistance;

        const switchState = $("#switchValue")?.value === "open";

        state.components
            .filter(p => p.type === "switch")
            .forEach(p => {
                p.switchClosed = !switchState;
            });

        state.simulation = analyseCircuit();

        updateSimulationDisplay();
        render();

        if (state.simulation.ok) {
            notify("Simulation completed.");
        } else {
            notify(state.simulation.message);
        }
    }

    /* ---------------- SAVE / LOAD / EXPORT ---------------- */

    function projectData() {
        return {
            app: "AM Digital Studio Circuit Studio",
            version: 2,
            savedAt: new Date().toISOString(),
            components: state.components,
            wires: state.wires,
            counter: state.counter
        };
    }

    function saveProject() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(projectData()));
            notify("Project saved in this browser.");
        } catch (error) {
            console.error(error);
            notify("Unable to save. Browser storage may be unavailable.");
        }
    }

    function downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        link.remove();

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function downloadProject() {
        const blob = new Blob(
            [JSON.stringify(projectData(), null, 2)],
            { type: "application/json" }
        );

        downloadBlob(blob, "am-circuit-studio-project.json");
        notify("Project JSON downloaded.");
    }

    function exportSVG() {
        const copy = svg.cloneNode(true);

        copy.setAttribute("xmlns", svgNS);
        copy.setAttribute("width", "1000");
        copy.setAttribute("height", "650");

        // Exclude temporary interaction overlays.
        const interaction = copy.querySelector("#interactionLayer");

        if (interaction) interaction.replaceChildren();

        const style = document.createElementNS(svgNS, "style");

        style.textContent = `
            text { font-family: Arial, sans-serif; }
            .selected-component { filter: none; }
        `;

        copy.insertBefore(style, copy.firstChild);

        const blob = new Blob(
            [new XMLSerializer().serializeToString(copy)],
            { type: "image/svg+xml;charset=utf-8" }
        );

        downloadBlob(blob, "am-circuit-studio-schematic.svg");
        notify("Schematic SVG exported.");
    }

    function loadProject() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (!saved) return false;

            const data = JSON.parse(saved);

            if (!Array.isArray(data.components) || !Array.isArray(data.wires)) {
                return false;
            }

            state.components = data.components
                .filter(p => partInfo[p.type])
                .map(p => ({
                    ...p,
                    x: clamp(Number(p.x) || 500, 45, 955),
                    y: clamp(Number(p.y) || 325, 45, 605)
                }));

            const ids = new Set(state.components.map(p => p.id));

            state.wires = data.wires.filter(w =>
                ids.has(w.from) && ids.has(w.to)
            );

            state.counter = Number(data.counter) || state.components.length;
            state.selectedId = null;
            state.simulation = null;

            return true;
        } catch (error) {
            console.warn("Saved circuit could not be loaded.", error);
            return false;
        }
    }

    /* ---------------- ZOOM ---------------- */

    function setZoom(value) {
        state.zoom = clamp(value, 0.5, 2);

        const bg = $("#canvasBackground");

        if (bg) {
            // Zoom content around the centre of the viewBox.
            const width = 1000 / state.zoom;
            const height = 650 / state.zoom;
            const x = (1000 - width) / 2;
            const y = (650 - height) / 2;

            svg.setAttribute("viewBox", `${x} ${y} ${width} ${height}`);
        }

        const reset = $("#zoomReset");

        if (reset) reset.textContent = `${Math.round(state.zoom * 100)}%`;
    }

    /* ---------------- 3D PREVIEW ---------------- */

    function open3DPreview() {
        const modal = $("#threeDModal");
        const content = $("#threeDContent");

        if (!modal || !content) return;

        content.replaceChildren();

        if (!state.components.length) {
            content.textContent = "Add components to your board to preview them here.";
        } else {
            const scene = document.createElement("div");

            scene.style.cssText = `
                position:relative;
                width:min(90%,520px);
                min-height:220px;
                display:flex;
                flex-wrap:wrap;
                align-items:center;
                justify-content:center;
                gap:14px;
                padding:25px;
                border-radius:18px;
                border:1px solid #64748b55;
                background:linear-gradient(145deg,#e8edf5,#cbd5e1);
                box-shadow:0 22px 45px #0002;
                transform:rotateX(10deg);
            `;

            state.components.forEach(part => {
                const tile = document.createElement("div");

                tile.style.cssText = `
                    min-width:74px;
                    min-height:58px;
                    padding:12px;
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    justify-content:center;
                    gap:5px;
                    border-radius:10px;
                    border:1px solid #94a3b8;
                    background:linear-gradient(145deg,#fff,#dce4f0);
                    color:#172033;
                    box-shadow:3px 6px 7px #33415533;
                    font-size:11px;
                    font-weight:700;
                    transform:rotateX(-4deg);
                `;

                const symbol = document.createElement("strong");

                symbol.style.cssText = `
                    color:${partInfo[part.type].color};
                    font-size:20px;
                `;

                const symbols = {
                    battery: "＋ −",
                    resistor: "▱",
                    led: "◉",
                    switch: "↗",
                    capacitor: "║",
                    diode: "▷",
                    transistor: "N",
                    motor: "M",
                    arduino: "IC",
                    logic: part.logicType || "AND"
                };

                symbol.textContent = symbols[part.type] || "?";

                const label = document.createElement("span");
                label.textContent = part.label;

                tile.append(symbol, label);
                scene.appendChild(tile);
            });

            content.appendChild(scene);

            const note = document.createElement("p");

            note.style.cssText = `
                flex-basis:100%;
                padding:0 12px;
                color:#94a3b8;
                font-size:10px;
            `;

            note.textContent =
                "Conceptual 3D-style preview. This is not a dimensionally accurate CAD model.";

            content.appendChild(note);
        }

        modal.hidden = false;
    }

    function close3DPreview() {
        const modal = $("#threeDModal");

        if (modal) modal.hidden = true;
    }

    /* ---------------- LESSONS ---------------- */

    function showLesson(type) {
        const output = $("#lessonOutput");

        if (!output) return;

        const lessons = {
            ohm: `
                <h3>Ohm's law — V = I × R</h3>
                <p>Voltage equals current multiplied by resistance.</p>
                <p>For a simplified LED circuit:</p>
                <p><strong>I = (V<sub>supply</sub> − V<sub>LED</sub>) / R</strong></p>
                <p>Example: (5 V − 2 V) / 220 Ω ≈ 13.64 mA.</p>
                <p>Change the supply voltage and resistor values in the simulator to compare results.
                This example assumes an idealized LED voltage drop.</p>
            `,
            series: `
                <h3>Series and parallel circuits</h3>
                <p><strong>Series:</strong> the same current flows through every component in a single path.</p>
                <p><strong>Parallel:</strong> each branch shares the same voltage, while current divides between branches.</p>
                <p>The current editor supports basic component wiring, but it does not yet solve arbitrary multi-branch networks.</p>
            `,
            logic: `
                <h3>Digital logic</h3>
                <p>AND outputs 1 only when both inputs are 1.</p>
                <p>OR outputs 1 when at least one input is 1.</p>
                <p>NOT inverts its input: 0 becomes 1 and 1 becomes 0.</p>
                <label>Input A
                    <select id="lessonInputA"><option value="0">0</option><option value="1">1</option></select>
                </label>
                <label>Input B
                    <select id="lessonInputB"><option value="0">0</option><option value="1">1</option></select>
                </label>
                <label>Gate
                    <select id="lessonGate">
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                        <option value="NOT">NOT</option>
                    </select>
                </label>
                <p><strong id="lessonLogicResult">Output: 0</strong></p>
            `
        };

        output.innerHTML = lessons[type] || "<p>Lesson not found.</p>";
        output.hidden = false;

        if (type === "logic") {
            const update = () => {
                const a = Number($("#lessonInputA").value);
                const b = Number($("#lessonInputB").value);
                const gate = $("#lessonGate").value;

                const result = gate === "AND"
                    ? a & b
                    : gate === "OR"
                        ? a | b
                        : 1 - a;

                $("#lessonLogicResult").textContent = `Output: ${result}`;
            };

            ["lessonInputA", "lessonInputB", "lessonGate"].forEach(id => {
                $("#" + id).addEventListener("change", update);
            });

            update();
        }

        output.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    /* ---------------- LANGUAGE ---------------- */

    function setLanguage(language) {
        state.language = language;

        $$("[data-en], [data-si]").forEach(el => {
            const value = el.getAttribute(`data-${language}`);

            if (value !== null) {
                el.textContent = value;
            }
        });

        $$("[data-en-html], [data-si-html]").forEach(el => {
            const value = el.getAttribute(`data-${language}-html`);

            if (value !== null) {
                // These HTML strings are authored locally in this file.
                el.innerHTML = value;
            }
        });

        const button = $("#languageToggle");

        if (button) {
            button.textContent = language === "en" ? "සිංහල" : "English";
        }

        updateToolStatus();
    }

    /* ---------------- THEME ---------------- */

    function toggleTheme() {
        const body = document.body;
        const light = !body.classList.contains("light-mode");

        body.classList.toggle("light-mode", light);
        body.dataset.theme = light ? "light" : "dark";

        const btn = $("#themeToggle");

        if (btn) {
            const icon = $(".theme-icon", btn);
            const text = $(".theme-text", btn);

            if (icon) icon.textContent = light ? "☾" : "☀";
            if (text) text.textContent = light ? "Dark Mode" : "Light Mode";
        }

        try {
            localStorage.setItem("amCircuitTheme", light ? "light" : "dark");
        } catch (_) {}
    }

    function restoreTheme() {
        try {
            const theme = localStorage.getItem("amCircuitTheme");

            if (theme === "light") {
                document.body.classList.add("light-mode");
                document.body.dataset.theme = "light";

                const icon = $(".theme-icon");
                const text = $(".theme-text");

                if (icon) icon.textContent = "☾";
                if (text) text.textContent = "Dark Mode";
            }
        } catch (_) {}
    }

    /* ---------------- EVENT BINDINGS ---------------- */

    $$(".component-choice[data-part]").forEach(button => {
        button.addEventListener("click", () => {
            addComponent(button.dataset.part);
        });
    });

    $("#undoCircuit")?.addEventListener("click", undo);
    $("#redoCircuit")?.addEventListener("click", redo);
    $("#clearCircuit")?.addEventListener("click", clearBoard);
    $("#saveCircuit")?.addEventListener("click", saveProject);
    $("#downloadProject")?.addEventListener("click", downloadProject);
    $("#exportCircuit")?.addEventListener("click", exportSVG);
    $("#applyProperties")?.addEventListener("click", applyProperties);

    $("#selectTool")?.addEventListener("click", () => setTool("select"));
    $("#wireMode")?.addEventListener("click", () => setTool("wire"));
    $("#deleteTool")?.addEventListener("click", () => setTool("delete"));

    $("#rotateComponent")?.addEventListener("click", rotateSelected);
    $("#simulateCircuit")?.addEventListener("click", runSimulation);

    $("#open3D")?.addEventListener("click", open3DPreview);
    $("#close3D")?.addEventListener("click", close3DPreview);

    $("#threeDModal")?.addEventListener("click", event => {
        if (event.target.id === "threeDModal") close3DPreview();
    });

    $("#zoomIn")?.addEventListener("click", () => setZoom(state.zoom + 0.1));
    $("#zoomOut")?.addEventListener("click", () => setZoom(state.zoom - 0.1));
    $("#zoomReset")?.addEventListener("click", () => setZoom(1));

    $("#languageToggle")?.addEventListener("click", () => {
        setLanguage(state.language === "en" ? "si" : "en");
    });

    $("#themeToggle")?.addEventListener("click", toggleTheme);

    $("#switchValue")?.addEventListener("change", () => {
        const part = selectedPart();

        if (part && part.type === "switch") {
            part.switchClosed = $("#switchValue").value === "closed";
            recordHistory();
            render();
        }
    });

    $$("[data-lesson]").forEach(button => {
        button.addEventListener("click", () => {
            showLesson(button.dataset.lesson);
        });
    });

    // Mobile navigation.
    $("#circuitMenuToggle")?.addEventListener("click", () => {
        const nav = $("#circuitNavLinks");
        const button = $("#circuitMenuToggle");

        if (!nav) return;

        const isOpen = nav.classList.toggle("open");

        button.setAttribute("aria-expanded", String(isOpen));

        const icon = $("i", button);

        if (icon) {
            icon.className = isOpen
                ? "fa-solid fa-xmark"
                : "fa-solid fa-bars";
        }
    });

    // Keyboard shortcuts.
    document.addEventListener("keydown", event => {
        const target = event.target;
        const editing = target &&
            (target.matches("input, textarea, select") || target.isContentEditable);

        if (event.key === "Escape") {
            close3DPreview();
            state.wireStartId = null;
            return;
        }

        if (editing) return;

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
            event.preventDefault();

            if (event.shiftKey) redo();
            else undo();
        }

        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
            event.preventDefault();
            redo();
        }

        if (event.key === "Delete" || event.key === "Backspace") {
            removeSelected();
        }

        if (event.key.toLowerCase() === "r") {
            rotateSelected();
        }
    });

    /* ---------------- INITIALIZE ---------------- */

    restoreTheme();

    const hasSavedProject = loadProject();

    if (!hasSavedProject) {
        state.components = [];
        state.wires = [];
        state.selectedId = null;
    }

    render();
    renderProperties();
    updateSimulationDisplay();
    updateHistoryButtons();
    setZoom(1);
    setTool("select");

    if (hasSavedProject) {
        notify("Saved project loaded.");
    }

    console.info("AM Circuit Studio initialized.");
})();
