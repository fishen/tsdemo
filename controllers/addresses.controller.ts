
import { Controller, route, router, query, httpPost, httpPut, httpDelete, httpGet, inject, injectable } from "../core";
import { IAddressService } from "../services/index";

@router('addresses')
@injectable
export default class extends Controller {

    constructor(@inject() private service: IAddressService) {
        super();
    }

    @httpGet()
    public async index(@query('index') idx: number = 1, @query('size') size: number = 10) {
        const result = await this.service.getList(idx, size);
        return this.json(result);
    }

    @httpGet(/city\/(?<name>[^/]+)/)
    public async getByCity(@route('name') city: string) {
        const result = await this.service.getAddressesByCity(city);
        return this.json(result);
    }

    @httpGet(/(?<id>\d+)/)
    public async get(@route('id') id: number) {
        const user = await this.service.get(id);
        if (!user) return this.notFound();
        return this.json(user);
    }

    @httpPost()
    public async create() {
        const user = this.context.request.body;
        const created = await this.service.create(user);
        return this.json(created);
    }

    @httpPut(/(?<id>\d+)/)
    public async update(@route('id') id: number) {
        const originalUser = await this.service.get(id);
        if (!originalUser) return this.notFound();
        const user = this.context.request.body;
        await this.service.update(id, user);
        return this.noContent();
    }

    @httpDelete(/(?<id>\d+)/)
    public async delete(@route('id') id: number) {
        const user = await this.service.get(id);
        if (!user) return this.notFound();
        await this.service.delete(id);
        return this.noContent();
    }
}