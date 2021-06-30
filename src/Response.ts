import { ENDPOINTS } from './config';
import { isClient } from './util/env';
import fetch from 'isomorphic-fetch';
import ISOFormData from 'isomorphic-form-data';
import { throwInvalidRequestError } from './util/errors';
import Blob from 'cross-blob';

type ResponseOptions = {
  url: string,
  id: string,
  key: string,
  license: string,
  xfdf: string
}

/**
 * A class representing a response from the API. Should not be created directly, but should be retrieved from methods in the ExpressUtils class.
 * @property {string} url The URL that you can download the file from
 * @property {string} id The ID of the file
 * @property {string} key The key used for authenticating the request when downloading the file from 'url'
 * @property {string} xfdf The XFDF returned from the response. Only set if calling an endpoint that extracts XFDF
 * @property {string} license The license that was passed to the API
 */
export class Response {
  private blob?: Blob;
  private buffer?: Buffer;
  public url?: string;
  public id?: string;
  public key?: string;
  public xfdf?: string;
  public license?: string;

  constructor({ url, id, key, license, xfdf }: ResponseOptions) {
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
  async getBlob(): Promise<Blob> {
    if (!this.url) {
      throwInvalidRequestError('getBlob', 'There is no output file to fetch');
    }

    if (this.blob) {
      return this.blob;
    }

    let blob: Blob = await fetch(this.url, {
      method: 'get',
      headers: {
        Authorization: this.key,
      },
    }).then((resp: any) => resp.blob());

    blob = blob.slice(0, blob.size, 'application/pdf');

    this.blob = blob;
    return blob;
  }

  /**
   * Fetches and returns the file as a Buffer
   * @returns {Promise<Buffer>}
   */
  async getBuffer(): Promise<Buffer> {
    if (!this.url) {
      throwInvalidRequestError('getBuffer', 'There is no output file to fetch');
    }

    if (this.buffer) {
      return this.buffer;
    }

    let buffer: Buffer = await fetch(this.url, {
      method: 'get',
      headers: {
        Authorization: this.key,
      },
    }).then((resp) => resp.arrayBuffer().then((arrBuffer) => this.toBuffer(arrBuffer)));

    buffer = (buffer instanceof ArrayBuffer) ? this.toBuffer(buffer) : buffer;

    this.buffer = buffer;
    return buffer;
  }

  toBuffer(ab: ArrayBuffer) {
    var buf = Buffer.alloc(ab.byteLength);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

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
  async deleteFile() {
    if (!this.id) {
      throwInvalidRequestError('deleteFile', 'There is no temporary file to delete');
    }

    const data = new ISOFormData();
    if (this.license) {
      data.append('license', this.license);
    }
    data.append('id', this.id);

    await fetch(ENDPOINTS.DELETE.url, {
      method: ENDPOINTS.DELETE.method,
      body: data as unknown as FormData,
    });

    this.blob = undefined;
    this.url = undefined;
    this.key = undefined;
    this.id = undefined;
  }
}
