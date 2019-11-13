import { DESIGN_PARAM_TYPES } from "./constants";


const INJECT_ITEMS = new Map<any, any>();

export class Injector {

    /**
     * 注册依赖注入的类型
     * @param type 类型
     * @param value 对应类型的值或者工厂函数
     */
    public static register(type: Function, value: any): void {
        INJECT_ITEMS.set(type, value);
    }

    /**
     * 获取已注册的类型值
     * @param type 类型
     * @param args 工厂函数调用时所需的参数
     */
    public static get<T = any>(type: any, ...args: any[]): T {
        if (!INJECT_ITEMS.has(type)) {
            throw new Error(`Missing type ${type} injection`);
        };
        let value = INJECT_ITEMS.get(type);
        if (typeof value === 'function') {
            const prototype = Reflect.getPrototypeOf(value);
            const types = Reflect.getMetadata(INJECT_ARGS_KEY, prototype);
            if (types) {
                value = new value();
            } else {
                value = value.apply(null, args);
            }
        }
        return value;
    }
}
const INJECT_ARGS_KEY = Symbol();
/**
 * 标记依赖注入参数
 * @param args 函数调用用到的参数
 */
export function inject(...args: any[]) {
    return function (target: any, _name: string, index: number) {
        const types = Reflect.getMetadata(INJECT_ARGS_KEY, target) || [];
        types.push({ index, args, });
        Reflect.defineMetadata(INJECT_ARGS_KEY, types, target);
    }
}

/**
 * 自动为当前类成员绑定注入的值
 */
export function injectable(ctor: new (...args: any) => any): any {
    return class extends ctor {
        constructor(...cargs: any) {
            const ptypes = Reflect.getMetadata(DESIGN_PARAM_TYPES, ctor);
            const types = Reflect.getMetadata(INJECT_ARGS_KEY, ctor);
            types.forEach(({ index, args }) => cargs[index] = Injector.get(ptypes[index], ...args));
            super(...cargs);
        }
    }
}


/**
 * 将当前的类注册为指定类型的服务
 * @param type 要注册的类型
 * @param args 构造函数的参数，值可在注入时替换
 */
export function injectFor(type: Function, ...args: any) {
    return function (ctor: new (...args: any) => any) {
        Injector.register(type, function (...otherArgs: any[]) {
            const ctorArguments = otherArgs && otherArgs.length ? otherArgs : args;
            return new ctor(...ctorArguments);
        });
    }
}