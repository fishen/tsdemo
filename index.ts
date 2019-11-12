import "reflect-metadata";
import config from './config';
import { Router, App, ServiceManager, ICacheManager } from "./core";
import fs from 'fs-extra';
import { bodyParse } from "./middlewares";
import { HttpContext } from "./core/httpContext";
import bluebird from "bluebird";
import { RedisCache, MemoryCache } from "./services/cache";
import redis from 'redis';
import { Sequelize } from "sequelize";
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

ServiceManager.register(redis.RedisClient, new redis.RedisClient(config.redis));
ServiceManager.register(Sequelize, new Sequelize(config.db));
ServiceManager.register(ICacheManager, RedisCache);
fs.readdirSync('controllers').map(file => require(`./controllers/${file}`));

const app = new App();

app.use(async function (context: HttpContext, next: any) {
    const { request: { url, method } } = context;
    const label = `METHOD:${method} URL:${url}`;
    console.time(label);
    await next();
    console.timeEnd(label);
})
app.use(bodyParse);
app.use(Router.resolve);

const server = app.createServer();

const { host, port } = config.server;

server.listen(port, host, () => console.info(`Server running at http://${host}:${port}/`));