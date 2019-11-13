import http from 'http';
import { ActionResult, NoContentResult, OKResult, ServerErrorResult } from './result';
import { HttpContext, HttpRequest } from './httpContext';

export type ResultType = Promise<void> | Promise<ActionResult> | ActionResult | undefined;
export type Middleware = (context: HttpContext, next: () => any) => ResultType;

function favicon(context: HttpContext, next: () => Promise<void>) {
    const { request: { url } } = context;
    if (url!.startsWith('/favicon.ico')) {
        return new NoContentResult();
    }
    return next();
}

export class App {
    constructor() {
        this.use(favicon);
    }
    private middlewares: Middleware[] = [];
    public use(fn: Middleware) {
        this.middlewares.push(fn);
    }
    public createServer() {
        return http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
            const request = new HttpRequest(req);
            const context = new HttpContext(request, res);
            const middlewares = this.middlewares.slice();
            const initial: Middleware = middlewares.shift()!;
            const next = () => {
                const fn = middlewares.shift() || Function.prototype;
                return fn(context, next);
            };
            try {
                const result = await initial(context, next);
                context.result = context.result || result || new OKResult();
            } catch (err) {
                console.error(err);
                const { message, name, stack } = err;
                context.result = new ServerErrorResult({ message, name, stack });
            }
            if (context.result instanceof ActionResult) {
                context.result.resolve(context);
            }
            context.response.end();
        });
    }
}