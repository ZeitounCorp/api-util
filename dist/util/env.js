"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = exports.isServer = exports.isClient = void 0;
exports.isClient = (function () { return typeof window !== 'undefined'; })();
exports.isServer = (function () { return typeof window === 'undefined'; })();
// @ts-ignore
exports.env = (function () { return typeof ENV === 'undefined' ? 'test' : ENV; })();
