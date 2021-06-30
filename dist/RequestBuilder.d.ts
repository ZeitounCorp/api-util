import { Response } from './Response';
import { Endpoint } from './spec/endpoint';
import { FileType } from './ExpressUtils';
declare class RequestBuilder {
    private file?;
    private xfdf?;
    private license?;
    private endpoint?;
    private otherData?;
    private headers?;
    setFile(file: FileType): this;
    setData(data: Record<string, any>): this;
    setHeaders(headers: Record<string, string>): RequestBuilder;
    setXFDF(xfdf: string): this;
    setLicense(license?: string): this;
    setEndpoint(endpoint: Endpoint): this;
    make(): Promise<Response>;
}
export default RequestBuilder;
