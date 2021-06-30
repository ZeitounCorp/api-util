"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwInvalidRequestError = exports.throwMissingDataError = exports.throwInvalidXFDFError = exports.throwInvalidFileTypeError = exports.throwFileTooLargeError = void 0;
var throwFileTooLargeError = function () {
    throw new Error("That file is too large to upload directly to the API. Please upload the file to a public URL first.");
};
exports.throwFileTooLargeError = throwFileTooLargeError;
var throwInvalidFileTypeError = function () {
    throw new Error("File must be of type File, Blob, Buffer, Array (or TypedArray), or string (url)");
};
exports.throwInvalidFileTypeError = throwInvalidFileTypeError;
var throwInvalidXFDFError = function () {
    throw new Error("XFDF must be a string and cannot be empty");
};
exports.throwInvalidXFDFError = throwInvalidXFDFError;
var throwMissingDataError = function (funcName, required) {
    throw new Error(funcName + " requires properties " + required.join(', ') + " to be set.");
};
exports.throwMissingDataError = throwMissingDataError;
var throwInvalidRequestError = function (funcName, reason) {
    throw new Error(funcName + " cannot be executed in this instance: " + reason);
};
exports.throwInvalidRequestError = throwInvalidRequestError;
