export var throwFileTooLargeError = function () {
    throw new Error("That file is too large to upload directly to the API. Please upload the file to a public URL first.");
};
export var throwInvalidFileTypeError = function () {
    throw new Error("File must be of type File, Blob, Buffer, Array (or TypedArray), or string (url)");
};
export var throwInvalidXFDFError = function () {
    throw new Error("XFDF must be a string and cannot be empty");
};
export var throwMissingDataError = function (funcName, required) {
    throw new Error(funcName + " requires properties " + required.join(', ') + " to be set.");
};
export var throwInvalidRequestError = function (funcName, reason) {
    throw new Error(funcName + " cannot be executed in this instance: " + reason);
};
