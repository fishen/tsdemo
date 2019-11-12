import { Model } from "sequelize";

import { IService, IPagedList } from "./service";

export class MySqlService<TModel extends Model & typeof Model> implements IService<TModel>{

    protected context: TModel;

    constructor(context: typeof Model) {
        this.context = context as any;
    }

    get(id: number): Promise<TModel> {
        return this.context.findByPk(id);
    }
    getList(index: number, size: number): Promise<IPagedList<TModel>> {
        const options = { limit: size, offset: (index - 1) * size };
        const result = this.context.findAndCountAll(options);
        return result as Promise<IPagedList<TModel>>;
    }
    create(model: TModel): Promise<TModel> {
        return this.context.create(model);
    }
    update(id: number, model: TModel): Promise<TModel> {
        return this.context.update(model, { where: { id } });
    }
    delete(id: number): Promise<void> {
        return this.context.destroy({ where: { id } }).then();
    }
}