"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_FILE_SIZE = exports.ENDPOINTS = exports.ROOT_URL = void 0;
var env_1 = require("./util/env");
exports.ROOT_URL = env_1.env === 'test' ?
    'https://d24tmkhit7.execute-api.us-east-1.amazonaws.com/staging' :
    'https://api.pdfjs.express';
exports.ENDPOINTS = {
    MERGE: {
        url: exports.ROOT_URL + "/xfdf/merge",
        method: 'post'
    },
    SET: {
        url: exports.ROOT_URL + "/xfdf/set",
        method: 'post'
    },
    EXTRACT: {
        url: exports.ROOT_URL + "/xfdf/extract",
        method: 'post'
    },
    DELETE: {
        url: exports.ROOT_URL + "/delete",
        method: 'post'
    },
    WATERMARK: {
        url: exports.ROOT_URL + "/watermark",
        method: 'post'
    },
};
exports.MAX_FILE_SIZE = 5.5e+6; // 5.5mb
