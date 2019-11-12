import { HttpMethod } from "./method";
import { getBoundParams } from './param';
import { HttpContext } from "./httpContext";
import { HttpRequest } from "./request";
import { NotFoundResult } from "./result";

export class Router {
    /**
     * API绑定的路径
     */
    path: string;
    /**
     * API方法
     */
    action: Function;
    /**
     * API方法名称
     */
    actionName: string;
    /**
     * Http请求方式
     */
    method: HttpMethod;
    /**
     * API所在构造函数
     */
    ctor: new (...args: any) => any;
    /**
     * API绑定的路径对应的正则表达式
     */
    regex: RegExp;
    constructor(options: Router) {
        let { path } = options;
        if (path) {
            path = path.replace(/\/{2,}/g, '/');
            path = path.startsWith('/') ? path : `/${path}`;
            path = path.endsWith('/') ? path : `${path}/`;
        }
        this.regex = new RegExp(`^${path}$`);
        Object.assign(this, options, { path });
    }
    public static routers: Router[] = [];
    public static register(options: Router) {
        this.routers.push(new Router(options));
    }
    public static match(request: HttpRequest) {
        const { path, method } = request;
        const pathMatched = (route: Router) => route.path === path || route.regex.test(path);
        const route = Router.routers.find(item => item.method === method && pathMatched(item));
        if (route) {
            const { groups } = route.regex.exec(request.path)!;
            request.routeParams = groups || {};
        }
        return route;
    }
    public static async resolve(context: HttpContext, next: () => void) {
        const { request } = context;
        const route = Router.match(request)
        if (route) {
            const { ctor, action, actionName } = route;
            const caller = Object.assign(new ctor(), { context });
            const params = getBoundParams(request, ctor, actionName);
            const result = await action.apply(caller, params);
            context.result = result;
        } else {
            console.debug(request.path, Router.routers);
            context.result = new NotFoundResult();
        }
        return await next();
    }
}

const ROUTER_KEY = Symbol();

/**
 * 将当前的API注册到全局路由
 * @param path 要注册的路径，会自动根据请求URL路径进行匹配，可以是正则表达式，也可以在正则表达式中添加命名分组
 * @param method 定义Http请求方式
 */
export function router(path?: string | RegExp, method = HttpMethod.GET): any {
    path = path || '';
    return function (target: any, actionName?: string, descriptor?: PropertyDescriptor) {
        if (typeof target === 'function') {
            const metadata: Router[] = Reflect.getMetadata(ROUTER_KEY, target.prototype) || [];
            metadata.forEach(item => {
                item.path = `${path}/${item.path}`;
                Router.register({ ...item, ctor: target });
            });
        } else {
            const data: any = { method, actionName, action: descriptor!.value };
            data.path = typeof path === 'string' ? path : path instanceof RegExp ? path.source : '';
            const metadata = Reflect.getMetadata(ROUTER_KEY, target) || [];
            metadata.push(data);
            Reflect.defineMetadata(ROUTER_KEY, metadata, target);
        }
    }
}

/**
 * 以GET的请求方式将当前API注册到全局路由
 * @param path 要注册的路径，会自动根据请求URL路径进行匹配，可以是正则表达式，也可以在正则表达式中添加命名分组
 */
export function httpGet(path?: string | RegExp) {
    return router(path, HttpMethod.GET);
}

/**
 * 以POST的请求方式将当前API注册到全局路由
 * @param path 要注册的路径，会自动根据请求URL路径进行匹配，可以是正则表达式，也可以在正则表达式中添加命名分组
 */
export function httpPost(path?: string | RegExp) {
    return router(path, HttpMethod.POST);
}

/**
 * 以PUT的请求方式将当前API注册到全局路由
 * @param path 要注册的路径，会自动根据请求URL路径进行匹配，可以是正则表达式，也可以在正则表达式中添加命名分组
 */
export function httpPut(path?: string | RegExp) {
    return router(path, HttpMethod.PUT);
}

/**
 * 以DELETE的请求方式将当前API注册到全局路由
 * @param path 要注册的路径，会自动根据请求URL路径进行匹配，可以是正则表达式，也可以在正则表达式中添加命名分组
 */
export function httpDelete(path?: string | RegExp) {
    return router(path, HttpMethod.DELETE);
}

/**
 * 以PATCH的请求方式将当前API注册到全局路由
 * @param path 要注册的路径，会自动根据请求URL路径进行匹配，可以是正则表达式，也可以在正则表达式中添加命名分组
 */
export function httpPatch(path?: string | RegExp) {
    return router(path, HttpMethod.PATCH);
}