import { Model } from 'sequelize';

export interface IService<TModel> {

    get(id: number): Promise<TModel>;
    getList(index: number, size: number): Promise<IPagedList<TModel>>;
    create(model: Partial<TModel>): Promise<TModel>;
    update(id: number, model: Partial<TModel>): Promise<TModel>;
    delete(id: number): Promise<void>;
}

export interface IPagedList<TModel> {
    rows: Array<TModel>;
    count: Number;
}