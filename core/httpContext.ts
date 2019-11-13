import http, { IncomingHttpHeaders } from 'http';
import { ActionResult } from "./result";
import { ParamSource } from "./route";

export class HttpContext {
    constructor(request: HttpRequest, response: HttpResponse) {
        this.request = request;
        this.response = response;
    }
    request: HttpRequest;
    response: HttpResponse;
    result: ActionResult;
    /**
     * 获取API绑定的参数
     * @param source 数据源
     * @param name 参数名称
     * @param type 参数类型
     */
    getParamValue(source: ParamSource, name: string, type?: Function) {
        const paramsSource = new Map([
            [ParamSource.ROUTE, this.request.routeParams],
            [ParamSource.QUERY, this.request.queryParams],
            [ParamSource.BODY, this.request.body]
        ]);
        if (!paramsSource.has(source)) throw new Error(`unknown param source '${source}'`);
        const value = paramsSource.get(source)![name];
        if (value === undefined) return;
        return typeof type === 'function' ? type(value) : value;
    }
}

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

export class HttpResponse extends http.ServerResponse {

}