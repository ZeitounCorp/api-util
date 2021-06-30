/// <reference types="node" />
import { Response } from './Response';
import Blob from 'cross-blob';
declare type ExpressUtilsOptions = {
    serverKey?: string;
    clientKey?: string;
};
export declare type FileType = string | Blob | File | Buffer | BlobPart;
export declare type WatermarkOptions = {
    text?: string;
    color?: string;
    position?: 'center' | 'top' | 'bottom';
    scale?: number;
    fontSize?: number;
    opacity?: number;
    rotation?: number;
};
/**
 * A class for interacting with the PDF.js Express REST APIs
 */
declare class ExpressUtils {
    private activeKey;
    private activeFile?;
    private activeXFDF?;
    private activeHeaders?;
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
    constructor({ serverKey, clientKey, }?: ExpressUtilsOptions);
    /**
     * Sets the file to process. Throws if the file is in memory and is too big (5.5 MB max).
     * @param {string|Blob|File|Buffer} file The file to process. Type must be 'string' (url) if the file is over 5.5mb
     * @returns {ExpressUtils} Returns current instance for function chaining
     */
    setFile(file: FileType): this;
    /**
     * Sets headers to be passed when the API downloads your document. Only used when 'file' is a URL.
     * @param {Object} headers An object representing the headers to forward
     * @returns {ExpressUtils} Returns current instance for function chaining
     */
    setHeaders(headers: Record<string, string>): this;
    /**
     * Sets the XFDF to process. Throws if XFDF is empty or not a string
     * @param {string} xfdf The XFDF to use in the conversion
     * @returns {ExpressUtils} Returns current instance for function chaining
     */
    setXFDF(xfdf: string): this;
    private done;
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
    merge(): Promise<Response>;
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
    set(): Promise<Response>;
    /**
     * Calls the PDF.js Express to extract the xfdf from a document
     * @returns {Promise<Response>} Resolves to a Response object. You can access the xfdf with `response.xfdf`
     * @example
     * const instance = new ExpressUtils({ serverKey: '', clientKey: '' });
     * instance.setFile(myFile)
     * const resp = await instance.extract();
     * const xfdfString = resp.xfdf;
     */
    extract(): Promise<Response>;
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
    watermark(options: WatermarkOptions): Promise<Response>;
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
    static fromResponse(response: Response): ExpressUtils;
}
export default ExpressUtils;
