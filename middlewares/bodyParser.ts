import { HttpContext } from "../core/httpContext";

export function bodyParse(context: HttpContext, next: () => Promise<void>) {
    const { request } = context;
    if (request.body) return next();
    return new Promise((resolve) => {
        let body = '';
        request.message.on('data', (chunk) => body += chunk);
        request.message.on('end', () => resolve(body));
    }).then((data: any) => {
        if (request.headers["content-type"] === 'application/json') {
            return data ? JSON.parse(data) : {};
        } else {
            return data;
        }
    })
        .then(data => request.body = data)
        .then(next);
}