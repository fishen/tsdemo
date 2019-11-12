import { HttpRequest } from "./request";
import { HttpResponse } from "./response";
import { ActionResult } from "./result";

export class HttpContext {
    constructor(request: HttpRequest, response: HttpResponse) {
        this.request = request;
        this.response = response;
    }
    request: HttpRequest;
    response: HttpResponse;
    result: ActionResult;
}