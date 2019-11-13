import fs from 'fs-extra';
import path from 'path';
import { JsonSerializer, DateFormatHandling } from "./json";
import { HttpStatusCode } from "./statusCode";
import { HttpContext } from "./httpContext";

export abstract class ActionResult<T = any> {
    constructor(data?: T) {
        this.data = data;
    }
    public data?: T;
    public abstract resolve(context: HttpContext): void;
}

/**
 * 根据Accept请求Header自动解析返回内容类型。
 */
export class ObjectResult<T> extends ActionResult<T> {
    public resolve(context: HttpContext): void {
        if (this.data) {
            new JsonResult(this.data).resolve(context);
        }
    }
}

export class OKResult<T> extends ObjectResult<T>{
    public resolve(context: HttpContext): void {
        context.response.statusCode = HttpStatusCode.OK;
        super.resolve(context);
    }
}


export class ContentResult extends ActionResult {
    constructor(public data: string, public contentType?: string) {
        super(data);
    }
    resolve(context: HttpContext): void {
        context.response.end(this.data);
    }
}

export class JsonResult extends ActionResult {
    resolve(context: HttpContext): void {
        context.response.setHeader('Content-Type', 'application/json');
        const serializer = new JsonSerializer();
        serializer.dateFormatHandling = DateFormatHandling.Timestamp;
        context.response.end(serializer.serialize(this.data));
    }
}

export class EmptyResult extends ActionResult {
    resolve(context: HttpContext): void { }
}

export class ViewResult extends ActionResult {
    constructor(public path: string, public data?: any) {
        super()
    }
    resolve(context: HttpContext): void {
        context.response.setHeader('Content-Type', 'text/html');
        const fullPath = path.join(__dirname, '../views', this.path);
        const content = fs.readFileSync(fullPath);
        context.response.end(content);
    }
}

export class StatusCodeResult<T = any> extends ObjectResult<T> {
    constructor(public code: number | HttpStatusCode, public data?: T) {
        super(data);
    }
    resolve(context: HttpContext): void {
        context.response.statusCode = this.code;
        super.resolve(context);
    }
}

export class ServerErrorResult<T> extends StatusCodeResult<T>{
    constructor(data?: T) {
        super(HttpStatusCode.InternalServerError, data);
    }
}

export class NoContentResult extends StatusCodeResult {
    constructor() {
        super(HttpStatusCode.NoContent);
    }
}

export class BadRequestResult<T> extends StatusCodeResult<T> {
    constructor(data: T) {
        super(HttpStatusCode.BadRequest, data)
    }
}

export class NotFoundResult extends StatusCodeResult {
    constructor() {
        super(HttpStatusCode.NotFound);
    }
}