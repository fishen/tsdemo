export class ViewModel<T> {
    public constructor(data: T, code?: number, message?: string) {
        this.data = data;
        this.code = code || 0;
        this.message = message || '';
    }
    public data: T;
    public message: string;
    public code: number;
}

export class PagedViewModel<T> extends ViewModel<Array<T>>{
    public count: number;
}