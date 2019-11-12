import { HttpStatusCode } from './statusCode';
import { JsonResult, ContentResult, ViewResult, StatusCodeResult, NoContentResult, NotFoundResult, BadRequestResult } from './result';
import { HttpContext } from './httpContext';

export abstract class Controller {
    context: HttpContext;
    json(data: any) {
        return new JsonResult(data);
    }
    content(content: string, contentType?: string) {
        return new ContentResult(content, contentType);
    }
    view(path: string, data?: any) {
        return new ViewResult(path, data);
    }
    statusCode<T = any>(code: number | HttpStatusCode, value?: T) {
        return new StatusCodeResult(code, value);
    }
    noContent() {
        return new NoContentResult();
    }
    // ok<T>(value?: T) {
    //     this.response.statusCode = HttpStatusCode.OK;
    //     return this.json(value);
    // }
    // redirect(url: string) {
    //     this.response.statusCode = HttpStatusCode.Redirect;
    //     this.response.setHeader('Location', url);
    //     return this.response.end();
    // }
    notFound() {
        return new NotFoundResult();
    }
    badRequest<T>(value?: T) {
        return new BadRequestResult(value);
    }
}