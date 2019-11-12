const JSON_IGNORE_KEY = Symbol();
const JSON_CONVERTER_KEY = Symbol();

export enum DateFormatHandling {
    Default,
    Date,
    Locale,
    ISODateFormat,
    Timestamp
}

const dateFormatHandles = {
    [DateFormatHandling.Default]: (value: Date) => value.toISOString(),
    [DateFormatHandling.Date]: (value: Date) => value.toDateString(),
    [DateFormatHandling.Locale]: (value: Date) => value.toLocaleString(),
    [DateFormatHandling.ISODateFormat]: (value: Date) => value.toISOString(),
    [DateFormatHandling.Timestamp]: (value: Date) => value.valueOf(),
}

export class JsonSerializer {
    dateFormatHandling: DateFormatHandling;

    public serialize<T>(obj: T): string {
        let replacer = typeof obj === 'object' ? this.getReplacer(obj as any) : undefined;
        return JSON.stringify(obj, replacer);
    }
    public deserialize(value: string) {
        return JSON.parse(value);
    }

    private getReplacer(obj: any) {
        const prototype = Reflect.getPrototypeOf(obj);
        return (key: string, value: any) => {
            if (obj === value) return value;
            const ignored = Reflect.getMetadata(JSON_IGNORE_KEY, prototype, key) === true;
            if (ignored) {
                return undefined;
            }
            const rawValue = obj[key];
            const converter = Reflect.getMetadata(JSON_CONVERTER_KEY, prototype, key);
            if (typeof converter === 'function') {
                return converter(rawValue);
            }
            this.dateFormatHandling = this.dateFormatHandling || DateFormatHandling.Default;
            if (value instanceof Date || rawValue instanceof Date) {
                return dateFormatHandles[this.dateFormatHandling](rawValue);
            }
            if (typeof value === 'object' && value !== obj) {
                obj = value;
            }
            return value;
        }
    }
}

export function jsonIgnore(target: any, name: string) {
    Reflect.defineMetadata(JSON_IGNORE_KEY, true, target, name);
}

export function jsonConverter(converter: (...args: any[]) => any) {
    return function (target: any, name: string) {
        const converters = Reflect.getMetadata(JSON_CONVERTER_KEY, target) || {};
        Object.assign(converters, { [name]: converter });
        Reflect.defineMetadata(JSON_CONVERTER_KEY, converters, target);
    }
}