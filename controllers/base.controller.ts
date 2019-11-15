
import { Controller, route, query, httpPost, httpPut, httpDelete, httpGet, cachable } from "../core";
import { IService } from "../services";
import { ViewModel } from "../vmodels";
import { map } from "auto-mapping";
import { HttpStatusCode } from "../core/statusCode";

export default abstract class BaseController<T> extends Controller {
    

    constructor(protected service: IService<T>, private vmType?: any) {
        super();
    }
    /**
     * 获取列表，支持分页，当设置ViewModel时，列表会自动转换为对应ViewModel
     * @param idx 分页索引，默认为1
     * @param size 分页大小，默认为10
     */
    @cachable({ duration: 10000 })
    @httpGet()
    public async index(@query('index') idx: number = 1, @query('size') size: number = 10) {
        const list = await this.service.getList(idx, size);
        if (this.vmType) {
            list.rows = list.rows.map(item => map(item, this.vmType, { nullable: true }));
        }
        const result = new ViewModel(list);
        return this.json(result);
    }

    /**
     * 获取详情，当设置ViewModel时，结果会自动转换为对应ViewModel
     * @param id id
     */
    @httpGet(/(?<id>\d+)/)
    public async get(@route('id') id: number) {
        const model = await this.service.get(id);
        if (!model) return this.notFound();
        let result: any = model;
        this.vmType && (result = map(model, this.vmType, { nullable: true }));
        result = new ViewModel(result);
        return this.json(result);
    }

    /**
     * 添加实体
     * @param args 
     */
    @httpPost()
    public async create(...args: any) {
        const model = this.context.request.body as T;
        const created = await this.service.create(model);
        let result: any = created;
        this.vmType && (result = map(created, this.vmType));
        return this.statusCode(HttpStatusCode.Created, result);
    }

    /**
     * 根据id更新实体
     * @param id 包含在路由中的id参数
     */
    @httpPut(/(?<id>\d+)/)
    public async update(@route('id') id: number) {
        const original = await this.service.get(id);
        if (!original) return this.notFound();
        const model = this.context.request.body as T;
        await this.service.update(id, model);
        return this.noContent();
    }

    /**
     * 根据id删除实体
     * @param id 包含在路由中的id参数
     */
    @httpDelete(/(?<id>\d+)/)
    public async delete(@route('id') id: number) {
        const model = await this.service.get(id);
        if (!model) return this.notFound();
        await this.service.delete(id);
        return this.noContent();
    }
}