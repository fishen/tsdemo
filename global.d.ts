/// <reference no-default-lib="true"/>

// @ts-ignore
declare const process: {
    env: {
        NODE_ENV: 'development' | 'production' | 'test';
        [key: string]: any;
    }
}

import redis from 'redis';

declare module 'redis' {
    export interface RedisClient extends Commands<boolean>, NodeJS.EventEmitter {
        /**
         * Determine if a hash field exists.
         */
        hexistsAsync(key: string, field: string): Promise<number>;
        /**
         * Get the value of a hash field.
         */
        hgetAsync(key: string, field: string): Promise<string>
        /**
         * Determine if a key exists.
         */
        existsAsync(key: string): Promise<number>;
        /**
         * Get the value of a key.
         */
        getAsync(key: string): Promise<string>;
        /**
         * Set the string value of a key.
         */
        setAsync(key: string, value: string): Promise<'OK'>;
        setAsync(key: string, value: string, flag: string): Promise<'OK'>;
        setAsync(key: string, value: string, mode: string, duration: number): Promise<"OK" | undefined>;
        setAsync(key: string, value: string, mode: string, duration: number, flag: string): Promise<'OK' | undefined>;
        /**
         * Delete a key.
         */
        delAsync(key: string): Promise<number>;
    }
}