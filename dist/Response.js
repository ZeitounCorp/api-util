"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
var config_1 = require("./config");
var isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
var isomorphic_form_data_1 = __importDefault(require("isomorphic-form-data"));
var errors_1 = require("./util/errors");
/**
 * A class representing a response from the API. Should not be created directly, but should be retrieved from methods in the ExpressUtils class.
 * @property {string} url The URL that you can download the file from
 * @property {string} id The ID of the file
 * @property {string} key The key used for authenticating the request when downloading the file from 'url'
 * @property {string} xfdf The XFDF returned from the response. Only set if calling an endpoint that extracts XFDF
 * @property {string} license The license that was passed to the API
 */
var Response = /** @class */ (function () {
    function Response(_a) {
        var url = _a.url, id = _a.id, key = _a.key, license = _a.license, xfdf = _a.xfdf;
        this.url = url;
        this.id = id;
        this.key = key;
        this.license = license;
        this.xfdf = xfdf;
    }
    /**
     * Fetches and returns the file as a Blob
     * @returns {Promise<Blob>}
     */
    Response.prototype.getBlob = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blob;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.url) {
                            errors_1.throwInvalidRequestError('getBlob', 'There is no output file to fetch');
                        }
                        if (this.blob) {
                            return [2 /*return*/, this.blob];
                        }
                        return [4 /*yield*/, isomorphic_fetch_1.default(this.url, {
                                method: 'get',
                                headers: {
                                    Authorization: this.key,
                                },
                            }).then(function (resp) { return resp.blob(); })];
                    case 1:
                        blob = _a.sent();
                        blob = blob.slice(0, blob.size, 'application/pdf');
                        this.blob = blob;
                        return [2 /*return*/, blob];
                }
            });
        });
    };
    /**
     * Fetches and returns the file as a Buffer
     * @returns {Promise<Buffer>}
     */
    Response.prototype.getBuffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var buffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.url) {
                            errors_1.throwInvalidRequestError('getBuffer', 'There is no output file to fetch');
                        }
                        if (this.buffer) {
                            return [2 /*return*/, this.buffer];
                        }
                        return [4 /*yield*/, isomorphic_fetch_1.default(this.url, {
                                method: 'get',
                                headers: {
                                    Authorization: this.key,
                                },
                            }).then(function (resp) { return resp.buffer(); })];
                    case 1:
                        buffer = _a.sent();
                        buffer = (buffer instanceof ArrayBuffer) ? this.toBuffer(buffer) : buffer;
                        this.buffer = buffer;
                        return [2 /*return*/, buffer];
                }
            });
        });
    };
    Response.prototype.toBuffer = function (ab) {
        var buf = Buffer.alloc(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            buf[i] = view[i];
        }
        return buf;
    };
    /**
     * Deletes the file from the server and destroys the instance.
     * If delete is not called, the file will still becoming inaccessible after 3 hours,
     * and will be permanently deleted after ~24 hours.
     *
     * Deleting a file does not count as a transaction
     * @returns {Promise<void>}
     * @example
     * const instance = new APIUtils({ serverKey: '', clientKey: '' });
     * instance.setFile(myFile)
     * instance.setXFDF(xfdfString)
     * const resp = await instance.set();
     * const blob = await resp.getBlob(); // get the blob for your apps usage
     * await resp.deleteFile(); // delete the file
     */
    Response.prototype.deleteFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.id) {
                            errors_1.throwInvalidRequestError('deleteFile', 'There is no temporary file to delete');
                        }
                        data = new isomorphic_form_data_1.default();
                        if (this.license) {
                            data.append('license', this.license);
                        }
                        data.append('id', this.id);
                        return [4 /*yield*/, isomorphic_fetch_1.default(config_1.ENDPOINTS.DELETE.url, {
                                method: config_1.ENDPOINTS.DELETE.method,
                                body: data,
                            })];
                    case 1:
                        _a.sent();
                        this.blob = undefined;
                        this.url = undefined;
                        this.key = undefined;
                        this.id = undefined;
                        return [2 /*return*/];
                }
            });
        });
    };
    return Response;
}());
exports.Response = Response;
