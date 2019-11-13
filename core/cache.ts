import { Controller } from "./controller";
import { HttpMethod } from "./method";
import { Injector } from './inject';
import { ObjectResult, ActionResult } from './result';

export interface ICacheManager {
    delete(key: string): Promise<boolean>;
    get<T>(key: string): Promise<T | null>;
    has(key: string): Promise<boolean>;
    set<T>(key: string, value: T, millisecond?: number): Promise<void>;
}

export abstract class ICacheManager { }

interface ICacheOptions {
    /**
     * 缓存键名称，默认使用请求url
     */
    key?: string,
    /**
     * 缓存时间，单位毫秒
     */
    duration?: number,
}

/**
 * 为接口添加缓存
 * @param options 缓存选项 
 */
export function cachable(options?: ICacheOptions) {
    options = Object.assign({}, options);
    const decoractor = function (target: any, method: string, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = async function (this: Controller, ...args: any[]) {
            const { request: { method, url } } = this.context;
            if (method !== HttpMethod.GET) {
                console.warn('The cache should be applied to the GET request method.')
                return original.apply(this, arguments);
            }
            const key = options!.key ? options!.key : `${url}`
            const cache = Injector.get<ICacheManager>(ICacheManager);
            const exisits = await cache.has(key);
            if (exisits) {
                console.info(`Read from cache ${url}.`)
                const data = await cache.get(key);
                return new ObjectResult(data);
            } else {
                const result = await original.call(this, ...args);
                if (result instanceof ActionResult && result.data) {
                    cache.set(key, result.data, options!.duration);
                }
                return result;
            }
        }
    }
    return decoractor;
}

cachable.clear = async function (key: string) {
    const cache = Injector.get<ICacheManager>(ICacheManager);
    return await cache.delete(key);
}