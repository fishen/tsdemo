/// <reference path="../global.d.ts" />
import redis from "redis";
import { ICacheManager } from "../core/cache";
import { injectable, inject } from "../core/inject";

@injectable
export class RedisCache implements ICacheManager {

    constructor(@inject() protected client: redis.RedisClient) { }

    delete(key: string): Promise<boolean> {
        return this.client.delAsync.call(this.client, key).then(num => num > 0);
    }

    has(key: string): Promise<boolean> {
        return this.client.existsAsync.call(this.client, key)
            .then(value => value > 0);
    }

    get<T>(key: string): Promise<T | null> {
        return this.client.getAsync.call(this.client, key)
            .then(value => JSON.parse(value));
    }

    set<T>(key: string, value: T, millisecond?: number): Promise<void> {
        const set = this.client.setAsync.bind(this.client);
        const val = JSON.stringify(value);
        if (millisecond && millisecond > 0) {
            return set(key, val, 'PX', millisecond) as Promise<any>;
        }
        return set(key, val) as Promise<any>;
    }
}

export class MemoryCache implements ICacheManager {
    static container = new Map<string, { value: any, expires?: number }>();
    delete(key: string): Promise<boolean> {
        return Promise.resolve(MemoryCache.container.delete(key));
    }
    get<T>(key: string): Promise<T | null> {
        const data = MemoryCache.container.get(key);
        if (data!.expires && data!.expires <= Date.now()) {
            MemoryCache.container.delete(key);
            return Promise.resolve(null);
        }
        return Promise.resolve(data!.value);
    }
    has(key: string): Promise<boolean> {
        if (!MemoryCache.container.has(key)) return Promise.resolve(false);
        return this.get(key).then(data => data !== null);
    }
    set<T>(key: string, value: T, millisecond?: number): Promise<void> {
        MemoryCache.container.set(key, { value, expires: millisecond && Date.now() + millisecond });
        return Promise.resolve();
    }
}