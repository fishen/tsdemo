import { DESIGN_PARAM_TYPES } from './constants';
import { HttpRequest } from './request';

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

/**
 * 获取API绑定的参数
 * @param request 请求对象
 * @param target 当前API对应的原型对像
 * @param action 当前API方法成员名称
 */
export function getBoundParams(request: HttpRequest, target: any, action: string) {
    const metadata = Reflect.getMetadata(PARAMS_KEY, target.prototype, action) || [];
    const paramsSource: Record<string, any> = {
        'route': request.routeParams,
        'query': request.queryParams,
        'body': request.body
    }
    const params = metadata.reduce((result: any[], param: any) => {
        const { index, source, name, type } = param;
        if (!((source as string) in paramsSource)) return result;
        let value = paramsSource[source][name];
        if (value === undefined) return result;
        result[index] = typeof type === 'function' ? type(value) : value;
        return result;
    }, []);
    return params;
}