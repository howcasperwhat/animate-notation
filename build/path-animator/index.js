"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/path-animator.ts
var path_animator_exports = {};
__export(path_animator_exports, {
  default: () => PathAnimatior
});
module.exports = __toCommonJS(path_animator_exports);

// src/stroke-animator.ts
var StrokeAnimator = class {
  constructor(path, trace = -1, start = false) {
    this.startTime = -1;
    this.duration = 0;
    this.process = "freeze";
    this.painted = this.listen;
    this.erased = this.listen;
    this.path = path;
    this.length = path.getTotalLength();
    this.trace = this.clacInitTrace(trace);
    this.path.style.strokeDasharray = `${this.length}px`;
    this.path.style.strokeDashoffset = `${this.length - this.trace}px`;
    start && this.start();
  }
  done() {
    if (this.process === "paint" && this.trace >= this.length) return true;
    if (this.process === "erase" && this.trace <= 0) return true;
    return false;
  }
  clacInitTrace(trace) {
    if (trace === -1) return this.length;
    return trace;
  }
  update() {
    this.trace = Math.min(this.trace, this.length);
    this.trace = Math.max(this.trace, 0);
    let offset = this.length - this.trace;
    this.path.style.strokeDashoffset = `${offset}px`;
  }
  initStartTime(currentTime) {
    if (this.startTime === -1)
      this.startTime = currentTime;
  }
  calcStep(currentTime, previousTime) {
    if (this.duration === 0) return this.length;
    const rate = (currentTime - previousTime) / this.duration;
    if (rate >= 1) return this.length;
    return this.length * rate;
  }
  _paint(currentTime, previousTime) {
    this.initStartTime(currentTime);
    const step = this.calcStep(currentTime, previousTime != null ? previousTime : this.startTime);
    this.trace += step;
    this.update();
    this.done() && this.painted();
    this._listen(currentTime);
  }
  _erase(currentTime, previousTime) {
    this.initStartTime(currentTime);
    const step = this.calcStep(currentTime, previousTime != null ? previousTime : this.startTime);
    this.trace -= step;
    this.update();
    this.done() && this.erased();
    this._listen(currentTime);
  }
  _listen(previousTime) {
    requestAnimationFrame((currentTime) => {
      switch (this.process) {
        case "paint":
          this._paint(currentTime, previousTime);
          break;
        case "erase":
          this._erase(currentTime, previousTime);
          break;
        case "listen":
          this._listen(currentTime);
          break;
        default:
          break;
      }
    });
  }
  paint(duration, initTrace = this.trace) {
    this.duration = duration;
    this.process = "paint";
    this.startTime = -1;
    this.trace = this.clacInitTrace(initTrace);
  }
  erase(duration, initTrace = this.trace) {
    this.duration = duration;
    this.process = "erase";
    this.startTime = -1;
    this.trace = this.clacInitTrace(initTrace);
  }
  stop() {
    this.process = "freeze";
    this.startTime = -1;
  }
  listen() {
    this.process = "listen";
    this.startTime = -1;
  }
  start() {
    if (this.process !== "freeze") return;
    this.process = "listen";
    this._listen();
  }
  onPainted(fn) {
    this.painted = () => {
      this.listen();
      fn();
    };
  }
  onErased(fn) {
    this.erased = () => {
      this.listen();
      fn();
    };
  }
};

// src/notation-store.ts
var import_generator = require("roughjs/bin/generator");
var DEFAULT_ROUGH_OPTIONS = __spreadProps(__spreadValues({}, new import_generator.RoughGenerator().defaultOptions), {
  disableMultiStroke: true
});
var DEFAULT_NOTATION_OPTIONS = {
  linecap: "round",
  zIndexOffset: 0,
  color: "currentColor",
  strokeWidth: 2,
  iterations: 1,
  brackets: 5,
  opacity: 1,
  class: ""
};

// src/utility.ts
function toPaths(d) {
  return opsToPath(d.sets);
}
function opsToPath(opList) {
  const paths = [];
  for (const drawing of opList) {
    let path = "";
    for (const item of drawing.ops) {
      const data = item.data;
      switch (item.op) {
        case "move":
          if (path.trim())
            paths.push(path.trim());
          path = `M${data[0]} ${data[1]} `;
          break;
        case "bcurveTo":
          path += `C${data[0]} ${data[1]}, ${data[2]} ${data[3]}, ${data[4]} ${data[5]} `;
          break;
        case "lineTo":
          path += `L${data[0]} ${data[1]} `;
          break;
      }
    }
    if (path.trim())
      paths.push(path.trim());
  }
  return paths;
}

// src/path-animator.ts
var SVG_NS = "http://www.w3.org/2000/svg";
var PathAnimatior = class {
  constructor(tar, pcs, options) {
    this.pathLengths = [];
    this.pathsTotalLength = 0;
    this.options = __spreadValues(__spreadValues({}, DEFAULT_NOTATION_OPTIONS), options);
    this.target = tar;
    this.rect = tar.getBoundingClientRect();
    if (typeof pcs === "function")
      pcs = pcs(this.rect.width, this.rect.height);
    switch (typeof pcs) {
      case "string":
        this.pathDatas = [pcs];
        break;
      case "object":
        if (!Array.isArray(pcs)) {
          this.pathDatas = toPaths(pcs);
        } else {
          this.pathDatas = pcs.map((pc) => {
            if (typeof pc === "string") return [pc];
            else return toPaths(pc);
          }).flat();
        }
        break;
    }
    this.cur = 0;
    this.duration = 1e3;
    this.svg = this.createSVG();
    this.initTarget();
    this.paths = this.cratePaths();
    this.animators = this.createAnimators();
    this.animators[this.cur].start();
  }
  createSVG() {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${this.rect.width} ${this.rect.height}`);
    this.options.class.length && svg.setAttribute("class", this.options.class);
    const style = svg.style;
    style.zIndex = this.target.style.zIndex + this.options.zIndexOffset;
    style.overflow = "visible";
    style.pointerEvents = "none";
    style.position = "absolute";
    style.top = "0";
    style.left = "0";
    return svg;
  }
  createPath(data, color, linecap, thickness, opacity) {
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", data);
    path.setAttribute("stroke", color);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", linecap);
    path.setAttribute("stroke-width", thickness.toString());
    path.setAttribute("stroke-opacity", opacity.toString());
    return path;
  }
  initTarget() {
    this.target.style.setProperty("position", "relative");
    this.target.appendChild(this.svg);
    return this.target;
  }
  cratePaths() {
    const paths = [];
    for (const data of this.pathDatas) {
      const path = this.createPath(
        data,
        this.options.color,
        this.options.linecap,
        this.options.strokeWidth,
        this.options.opacity
      );
      paths.push(path);
      const length = path.getTotalLength();
      this.pathLengths.push(length);
      this.pathsTotalLength += length;
      this.svg.appendChild(path);
    }
    return paths;
  }
  durationOf(idx) {
    return this.duration * this.pathLengths[idx] / this.pathsTotalLength;
  }
  createAnimators() {
    const animators = this.paths.map((path) => new StrokeAnimator(path, 0));
    for (let i = 0; i < animators.length; ++i) {
      i !== animators.length - 1 && animators[i].onPainted(() => {
        animators[i].stop();
        this.cur = i + 1;
        animators[this.cur].start();
        animators[this.cur].paint(this.durationOf(this.cur));
      });
      i !== 0 && animators[i].onErased(() => {
        animators[i].stop();
        this.cur = i - 1;
        animators[this.cur].start();
        animators[this.cur].erase(this.durationOf(this.cur));
      });
    }
    return animators;
  }
  show(duration = 1e3) {
    this.duration = duration;
    this.animators[this.cur].paint(
      this.durationOf(this.cur)
    );
  }
  stop() {
    this.animators[this.cur].listen();
  }
  hide(duration = 1e3) {
    this.duration = duration;
    this.animators[this.cur].erase(
      this.durationOf(this.cur)
    );
  }
  remove() {
    this.animators.forEach((notation) => notation.stop());
    this.target.removeChild(this.svg);
  }
  onShowed(fn) {
    this.animators[this.animators.length - 1].onPainted(fn);
  }
  onHidden(fn) {
    this.animators[0].onErased(fn);
  }
};
