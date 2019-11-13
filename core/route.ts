import { HttpMethod } from "./method";
import { HttpContext } from "./httpContext";
import { NotFoundResult } from "./result";
import { Controller } from "./controller";
import { DESIGN_PARAM_TYPES } from "./constants";

export class Router {
    /**
     * API绑定的路径
     */
    path: string;
    /**
     * API方法名称
     */
    action: string;
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
    public static routers: Router[] = [];
    public static register(options: Router) {
        let { path } = options;
        if (path) {
            path = path.replace(/\/{2,}/g, '/');
            path = path.startsWith('/') ? path : `/${path}`;
            path = path.endsWith('/') ? path : `${path}/`;
        }
        const router = new Router();
        Object.assign(router, options, { path, regex: new RegExp(`^${path}$`) })
        this.routers.push(router);
    }
    public static async resolve(context: HttpContext, next: () => void) {
        const { request: { path, method } } = context;
        const pathMatched = (route: Router) => route.path === path || route.regex.test(path);
        const route = Router.routers.find(item => item.method === method && pathMatched(item));
        if (route) {
            const { groups } = route.regex.exec(path)!;
            context.request.routeParams = groups || {};
            const { ctor, action } = route;
            const instance = new ctor();
            instance.context = context;
            context.result = await instance[action].call(instance);
        } else {
            console.debug(path, Router.routers);
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
    return function (target: any, action?: string, descriptor?: PropertyDescriptor) {
        path = path || '';
        if (typeof target === 'function') {
            const routers: Router[] = Reflect.getMetadata(ROUTER_KEY, target.prototype) || [];
            routers.map(item => Object.assign({}, item, { ctor: target, path: `${path}/${item.path}` }))
                .forEach(item => Router.register(item));
        } else if (descriptor && typeof descriptor.value === 'function') {
            //注册路由
            const routers = Reflect.getMetadata(ROUTER_KEY, target) || [];
            routers.push({ method, action, path: path instanceof RegExp ? path.source : path });
            Reflect.defineMetadata(ROUTER_KEY, routers, target);
            //绑定参数
            const params = Reflect.getMetadata(PARAMS_KEY, target, action!);
            if (!params) return;
            const original = descriptor!.value;
            descriptor!.value = function (this: Controller, ...args: any[]) {
                params.forEach(({ index, source, name, type }) => {
                    args[index] = this.context.getParamValue(source, name, type);
                });
                return original.apply(this, args);
            }
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

const PARAMS_KEY = Symbol();

/**
 * 绑定参数的数据源类型
 */
export enum ParamSource {
    /**
     * 请求体
     */
    BODY = 'body',
    /**
     * 请求参数
     */
    QUERY = 'query',
    /**
     * 路由参数
     */
    ROUTE = 'route',
}

/**
 * 装饰一个API参数，动态根据数据来源绑定值，并自动转换数据类型
 * @param source 数据来源，可以是路由、请求参数或请求体F
 * @param name 参数名称，可以和当前参数名称不同
 * @param type 参数类型，可选的，默认获取参数定义类型，可以自定义转换方法
 */
function param(source: ParamSource, name: string, type?: Function) {
    return function (target: any, method: string, index: number) {
        const types = Reflect.getMetadata(DESIGN_PARAM_TYPES, target, method);
        const metadata = Reflect.getMetadata(PARAMS_KEY, target, method) || [];
        metadata.push({ name, type: type || types[index], index, source });
        Reflect.defineMetadata(PARAMS_KEY, metadata, target, method);
    }
}

/**
 * 装饰一个API参数，动态根据指定的路由参数来绑定值，并自动转换数据类型
 * @param name 要绑定路由参数名称，可以和当前参数名称不同
 * @param type 参数类型，可选的，默认获取参数定义类型，可以自定义转换方法
 */
export function route(name: string, type?: Function) {
    return param(ParamSource.ROUTE, name, type);
}

/**
 * 装饰一个API参数，动态根据指定的URL请求参数来绑定值，并自动转换数据类型
 * @param name 要绑定URL请求参数名称，可以和当前参数名称不同
 * @param type 参数类型，可选的，默认获取参数定义类型，可以自定义转换方法
 */
export function query(name: string, type?: Function) {
    return param(ParamSource.QUERY, name, type);
}

/**
 * 装饰一个API参数，动态根据指定的请求参数来绑定值，并自动转换数据类型
 * @param name 要绑定请求参数名称，可以和当前参数名称不同
 * @param type 参数类型，可选的，默认获取参数定义类型，可以自定义转换方法
 */
export function body(name: string, type?: Function) {
    return param(ParamSource.BODY, name, type);
}