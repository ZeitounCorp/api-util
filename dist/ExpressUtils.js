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
import { isClient } from './util/env';
import { throwFileTooLargeError, throwInvalidFileTypeError, throwInvalidXFDFError, throwMissingDataError } from './util/errors';
import { MAX_FILE_SIZE, ENDPOINTS } from './config';
import RequestBuilder from './RequestBuilder';
/**
 * A class for interacting with the PDF.js Express REST APIs
 */
var ExpressUtils = /** @class */ (function () {
    /**
     * Initialize the class
     * @param {Object} [options]
     * @param {string} [options.serverKey] Your server side license key. Can be fetched from your profile at https://pdfjs.express
     * @param {string} [options.clientKey] Your client side license key. Can be fetched from your profile at https://pdfjs.express
     * @example
     * import ExpressUtils from '@pdftron/pdfjs-express-utils'
     *
     * const util = new ExpressUtils({
     *  serverKey: 'my_server_key',
     *  clientKey: 'my_client_key'
     * })
     */
    function ExpressUtils(_a) {
        var _b = _a === void 0 ? {} : _a, serverKey = _b.serverKey, clientKey = _b.clientKey;
        if (!serverKey && !clientKey) {
            console.warn('No license key was provided, running in demo mode');
        }
        //@ts-ignore
        this.activeKey = isClient ? clientKey : serverKey;
        this.activeHeaders = {};
    }
    /**
     * Sets the file to process. Throws if the file is in memory and is too big (5.5 MB max).
     * @param {string|Blob|File|Buffer} file The file to process. Type must be 'string' (url) if the file is over 5.5mb
     * @returns {ExpressUtils} Returns current instance for function chaining
     */
    ExpressUtils.prototype.setFile = function (file) {
        // try to convert to a blob first
        if (isClient && typeof file !== 'string' && !(file instanceof Blob) && !(file instanceof File)) {
            try {
                // @ts-ignore
                file = new Blob([file], { type: 'application/pdf' });
            }
            catch (e) { }
        }
        var size;
        if (typeof file === 'string') {
            size = 0; // string doesnt have a size
        }
        else if (isClient && (file instanceof File || file instanceof Blob)) {
            size = file.size;
        }
        else if (!isClient && file instanceof Buffer) {
            size = file.length;
        }
        else {
            throwInvalidFileTypeError();
        }
        if (size > MAX_FILE_SIZE) {
            throwFileTooLargeError();
        }
        this.activeFile = file;
        return this;
    };
    /**
     * Sets headers to be passed when the API downloads your document. Only used when 'file' is a URL.
     * @param {Object} headers An object representing the headers to forward
     * @returns {ExpressUtils} Returns current instance for function chaining
     */
    ExpressUtils.prototype.setHeaders = function (headers) {
        this.activeHeaders = headers;
        return this;
    };
    /**
     * Sets the XFDF to process. Throws if XFDF is empty or not a string
     * @param {string} xfdf The XFDF to use in the conversion
     * @returns {ExpressUtils} Returns current instance for function chaining
     */
    ExpressUtils.prototype.setXFDF = function (xfdf) {
        if (typeof xfdf !== 'string' || xfdf.trim() === '') {
            throwInvalidXFDFError();
        }
        this.activeXFDF = xfdf;
        return this;
    };
    ExpressUtils.prototype.done = function () {
        this.activeFile = undefined;
        this.activeXFDF = undefined;
        this.activeHeaders = undefined;
    };
    /**
     * Calls the PDF.js Express API to merge the current file and XFDF together.
     * @returns {Promise<Response>} Resolves to a Response object
     * @example
     * const instance = new ExpressUtils({ serverKey: '', clientKey: '' });
     * instance.setFile(myFile)
     * instance.setXFDF(xfdfString)
     * const resp = await instance.merge();
     *
     * const url = resp.url; // the URL of the new file
     * const key = resp.key; // The key used to fetch the file
     *
     * const blob = await resp.getBlob(); // downloads the 'url' and returns a blob
     */
    ExpressUtils.prototype.merge = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.activeXFDF || !this.activeFile) {
                            return [2 /*return*/, throwMissingDataError('merge', ['file, xfdf'])];
                        }
                        return [4 /*yield*/, new RequestBuilder()
                                .setEndpoint(ENDPOINTS.MERGE)
                                .setFile(this.activeFile)
                                .setXFDF(this.activeXFDF)
                                .setLicense(this.activeKey)
                                .setHeaders(this.activeHeaders)
                                .make()];
                    case 1:
                        response = _a.sent();
                        this.done();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Calls the PDF.js Express API to set the XFDF of a document. This will overwrite any existing annotations/xfdf the document may have.
     * @returns {Promise<Response>} Resolves to a Response object
     * @example
     * const instance = new ExpressUtils({ serverKey: '', clientKey: '' });
     * instance.setFile(myFile)
     * instance.setXFDF(xfdfString)
     * const resp = await instance.set();
     *
     * const url = resp.url; // the URL of the new file
     * const key = resp.key; // The key used to fetch the file
     *
     * const blob = await resp.getBlob(); // downloads the 'url' and returns a blob
     */
    ExpressUtils.prototype.set = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.activeXFDF || !this.activeFile) {
                            return [2 /*return*/, throwMissingDataError('set', ['file, xfdf'])];
                        }
                        return [4 /*yield*/, new RequestBuilder()
                                .setEndpoint(ENDPOINTS.SET)
                                .setFile(this.activeFile)
                                .setXFDF(this.activeXFDF)
                                .setLicense(this.activeKey)
                                .setHeaders(this.activeHeaders)
                                .make()];
                    case 1:
                        response = _a.sent();
                        this.done();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Calls the PDF.js Express to extract the xfdf from a document
     * @returns {Promise<Response>} Resolves to a Response object. You can access the xfdf with `response.xfdf`
     * @example
     * const instance = new ExpressUtils({ serverKey: '', clientKey: '' });
     * instance.setFile(myFile)
     * const resp = await instance.extract();
     * const xfdfString = resp.xfdf;
     */
    ExpressUtils.prototype.extract = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.activeFile) {
                            return [2 /*return*/, throwMissingDataError('extract', ['file'])];
                        }
                        return [4 /*yield*/, new RequestBuilder()
                                .setEndpoint(ENDPOINTS.EXTRACT)
                                .setFile(this.activeFile)
                                .setLicense(this.activeKey)
                                .setHeaders(this.activeHeaders)
                                .make()];
                    case 1:
                        response = _a.sent();
                        this.done();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Calls the PDF.js Express to apply a watermark to the document
     * @param {Object} options
     * @param {string} [options.text] The text to apply as the watermark
     * @param {string} [options.color] The color to set the text to. Must be a valid CSS color. Defaults to 'blue'
     * @param {string} [options.position] The position of the watermark. Must be 'center', 'top', or 'bottom'. Defaults to 'center'
     * @param {number} [options.scale] The scale of the watermark relative to the document. Must be a number between 0 and 1. Ignored if fontSize is set. Defaults to 0.5
     * @param {number} [options.fontSize] The font size to use. Overrides the 'scale' option
     * @param {number} [options.opacity] The opacity of the watermark. Must be value between 0 and 1. Defaults to 0.3
     * @param {number} [options.rotation] The rotation of the watermark in degrees. Defaults to 45
     * @returns {Promise<Response>} Resolves to a Response object.
     * @example
     * const instance = new ExpressUtils({ serverKey: '', clientKey: '' });
     * instance.setFile(myFile)
     * const resp = await instance.watermark({
     *   text: "Property of Joe",
     *   color: "red"
     * });
     */
    ExpressUtils.prototype.watermark = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.activeFile) {
                            return [2 /*return*/, throwMissingDataError('watermark', ['file'])];
                        }
                        return [4 /*yield*/, new RequestBuilder()
                                .setEndpoint(ENDPOINTS.WATERMARK)
                                .setFile(this.activeFile)
                                .setLicense(this.activeKey)
                                .setData(options)
                                .setHeaders(this.activeHeaders)
                                .make()];
                    case 1:
                        response = _a.sent();
                        this.done();
                        return [2 /*return*/, response];
                }
            });
        });
    };
    /**
     * Creates a new instance of the utility request from the response of another. Used for chaining API calls
     * @param {Response} response The response object from a previous API request
     * @returns {ExpressUtils}
     * @example
     * const instance = new ExpressUtils({ serverKey: '', clientKey: '' });
     * instance.setFile(myFile)
     * instance.setXFDF(xfdfString)
     * const resp = await instance.merge();
     *
     * const chainedInstance = ExpressUtils.fromResponse(resp)
     * const resp2 = await instance.watermark({
     *   text: "Property of Joe",
     *   color: "red"
     * })
     *
     * const watermarkedBlob = await resp2.getBlob()
     */
    ExpressUtils.fromResponse = function (response) {
        var inst = new ExpressUtils({
            serverKey: (response === null || response === void 0 ? void 0 : response.license) || '',
            clientKey: (response === null || response === void 0 ? void 0 : response.license) || ''
        });
        inst.setFile(response.url);
        inst.setHeaders({
            Authorization: response.key
        });
        return inst;
    };
    return ExpressUtils;
}());
export default ExpressUtils;
