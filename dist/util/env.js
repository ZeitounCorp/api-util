export var isClient = (function () { return typeof window !== 'undefined'; })();
export var isServer = (function () { return typeof window === 'undefined'; })();
// @ts-ignore
export var env = (function () { return typeof ENV === 'undefined' ? 'test' : ENV; })();
