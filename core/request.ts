import http, { IncomingHttpHeaders } from 'http';

export class HttpRequest {
    constructor(message: http.IncomingMessage) {
        const url = decodeURI(message.url!);
        this.message = message;
        this.headers = message.headers;
        this.method = message.method!;
        this.url = url!;
        this.statusCode = message.statusCode!;
        this.statusMessage = message.statusMessage!;
        const index = url.includes('?') ? url.indexOf('?') : url.length;
        this.path = url.substring(0, index);
        this.path = this.path.endsWith('/') ? this.path : `${this.path}/`;
        if (/\?\w+=/.test(url)) {
            const regex = /(?<key>\w+)=(?<value>[^&]*)/g;
            let matches;
            while ((matches = regex.exec(url)) !== null) {
                const { key, value } = matches.groups!;
                this.queryParams[key] = value;
            }
        }
    }
    message: http.IncomingMessage;
    headers: IncomingHttpHeaders;
    method: string;
    url: string;
    path: string;
    statusCode: number;
    statusMessage: string;
    routeParams: Record<string, any> = {};
    queryParams: Record<string, any> = {};
    body: Record<string, any>;
}