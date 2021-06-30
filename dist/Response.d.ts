declare type ResponseOptions = {
    url: string;
    id: string;
    key: string;
    license: string;
    xfdf: string;
};
/**
 * A class representing a response from the API. Should not be created directly, but should be retrieved from methods in the ExpressUtils class.
 * @property {string} url The URL that you can download the file from
 * @property {string} id The ID of the file
 * @property {string} key The key used for authenticating the request when downloading the file from 'url'
 * @property {string} xfdf The XFDF returned from the response. Only set if calling an endpoint that extracts XFDF
 * @property {string} license The license that was passed to the API
 */
export declare class Response {
    private blob?;
    url?: string;
    id?: string;
    key?: string;
    xfdf?: string;
    license?: string;
    constructor({ url, id, key, license, xfdf, }: ResponseOptions);
    /**
     * Fetches and returns the file as a Blob
     * @returns {Promise<Blob>}
     */
    getBlob(): Promise<Blob>;
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
    deleteFile(): Promise<void>;
}
export {};
