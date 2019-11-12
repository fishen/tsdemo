
import { Controller, router, httpGet } from "../core";

@router()
export default class extends Controller {
    @httpGet()
    public index() {
        return this.content('hello');
    }
    @httpGet('hello')
    public get() {
        return this.json({ message: 'hello world' });
    }
    @httpGet('html')
    public html() {
        return this.view('hello.html');
    }
}