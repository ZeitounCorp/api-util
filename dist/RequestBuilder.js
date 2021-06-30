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
import { Response } from './Response';
import { throwMissingDataError } from './util/errors';
import fetch from 'isomorphic-fetch';
import ISOFormData from 'isomorphic-form-data';
var RequestBuilder = /** @class */ (function () {
    function RequestBuilder() {
    }
    RequestBuilder.prototype.setFile = function (file) {
        this.file = file;
        return this;
    };
    RequestBuilder.prototype.setData = function (data) {
        this.otherData = data;
        return this;
    };
    RequestBuilder.prototype.setHeaders = function (headers) {
        if (!headers)
            return this;
        try {
            var keys = Object.keys(headers);
            if (keys.length === 0)
                return this;
        }
        catch (e) {
            return this;
        }
        this.headers = headers;
        return this;
    };
    RequestBuilder.prototype.setXFDF = function (xfdf) {
        this.xfdf = xfdf;
        return this;
    };
    RequestBuilder.prototype.setLicense = function (license) {
        if (license === void 0) { license = ''; }
        this.license = license;
        return this;
    };
    RequestBuilder.prototype.setEndpoint = function (endpoint) {
        this.endpoint = endpoint;
        return this;
    };
    RequestBuilder.prototype.make = function () {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var form, json, data, e_1, error, url, id, key, xfdf;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        form = new ISOFormData();
                        if (!this.file || !this.endpoint) {
                            throwMissingDataError('make', ['file', 'endpoint']);
                        }
                        form.append('file', this.file);
                        if (this.license) {
                            form.append('license', this.license);
                        }
                        if (this.otherData) {
                            Object.keys(this.otherData).forEach(function (key) {
                                form.append(key, _this.otherData[key]);
                            });
                        }
                        if (this.headers) {
                            form.append('headers', JSON.stringify(this.headers));
                        }
                        if (this.xfdf) {
                            form.append('xfdf', this.xfdf);
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, fetch((_a = this.endpoint) === null || _a === void 0 ? void 0 : _a.url, {
                                method: (_b = this.endpoint) === null || _b === void 0 ? void 0 : _b.method,
                                body: form,
                            })];
                    case 2:
                        data = _c.sent();
                        return [4 /*yield*/, data.json()];
                    case 3:
                        json = _c.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _c.sent();
                        throw e_1;
                    case 5:
                        error = json.error;
                        if (error) {
                            throw new Error(error.message || error);
                        }
                        url = json.url, id = json.id, key = json.key, xfdf = json.xfdf;
                        return [2 /*return*/, new Response({
                                url: url,
                                id: id,
                                key: key,
                                license: this.license,
                                xfdf: xfdf || this.xfdf
                            })];
                }
            });
        });
    };
    return RequestBuilder;
}());
export default RequestBuilder;
