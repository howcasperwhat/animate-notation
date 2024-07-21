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

// src/path-generator.ts
var path_generator_exports = {};
__export(path_generator_exports, {
  default: () => PathGenerator
});
module.exports = __toCommonJS(path_generator_exports);
var import_generator2 = require("roughjs/bin/generator");

// src/notation-store.ts
var import_generator = require("roughjs/bin/generator");
var DEFAULT_ROUGH_OPTIONS = __spreadProps(__spreadValues({}, new import_generator.RoughGenerator().defaultOptions), {
  disableMultiStroke: true
});

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

// src/path-generator.ts
var PathGenerator = class extends import_generator2.RoughGenerator {
  constructor(options = {}) {
    super({
      options: __spreadValues(__spreadValues({}, DEFAULT_ROUGH_OPTIONS), options)
    });
  }
  bracket(x, y, w, h, bracket, s = 5) {
    switch (bracket) {
      case 8:
        return this.linearPath([
          [x, y + s],
          [x, y],
          [x + w, y],
          [x + w, y + s]
        ]);
      case 4:
        return this.linearPath([
          [x + s, y],
          [x, y],
          [x, y + h],
          [x + s, y + h]
        ]);
      case 2:
        return this.linearPath([
          [x, y + h - s],
          [x, y + h],
          [x + w, y + h],
          [x + w, y + h - s]
        ]);
      case 1:
        return this.linearPath([
          [x + w - s, y],
          [x + w, y],
          [x + w, y + h],
          [x + w - s, y + h]
        ]);
    }
  }
  d(m, b = 5) {
    switch (m) {
      case "-":
      case "=":
        return (w, h) => [
          toPaths(this.line(0, h / 2, w, h / 2)),
          toPaths(this.line(w, h / 2, 0, h / 2))
        ].flat();
      case "_":
        return (w, h) => [
          toPaths(this.line(0, h, w, h)),
          toPaths(this.line(w, h, 0, h))
        ].flat();
      case "o":
        return (w, h) => [
          toPaths(this.ellipse(w / 2, h / 2, w, h)),
          toPaths(this.ellipse(w / 2, h / 2, w, h))
        ].flat();
      case "box":
        return (w, h) => [
          toPaths(this.rectangle(0, 0, w, h)),
          toPaths(this.rectangle(0, 0, w, h))
        ].flat();
      case "[]":
        return (w, h) => Array.from({ length: 4 }, (_, i) => {
          if (b & 1 << 3 - i)
            return toPaths(
              this.bracket(
                0,
                0,
                w,
                h,
                1 << 3 - i
              )
            );
          return void 0;
        }).filter((x) => !!x).flat();
      case "x":
        return (w, h) => [
          toPaths(this.linearPath([[0, 0], [w, h]])),
          toPaths(this.linearPath([[w, 0], [0, h]]))
        ].flat();
    }
  }
};
