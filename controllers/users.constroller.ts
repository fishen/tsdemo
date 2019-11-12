
import { Controller, route, router, query, httpPost, httpPut, httpDelete, body, httpPatch, httpGet, inject, cachable, injectable } from "../core";
import { IAddressService, IUserService } from "../services";
import { UserViewModel, PagedUserListViewModel, ViewModel } from '../vmodels'
import { map } from 'auto-mapping';

@router('users')
@injectable
export default class extends Controller {
    constructor(
        @inject() private service: IUserService,
        @inject() private addressService: IAddressService,
    ) {
        super();
    }

    @httpGet()
    public async index(@query('index') idx: number = 1, @query('size') size: number = 10) {
        const users = await this.service.getList(idx, size);
        const model = map(users, PagedUserListViewModel)!;
        const result = new ViewModel(model);
        return this.json(result);
    }

    @httpGet(/(?<id>\d+)/)
    @cachable()
    public async get(@route('id') id: number) {
        const user = await this.service.get(id);
        if (!user) return this.notFound();
        const model: any = map(user, UserViewModel);
        const result = new ViewModel(model);
        return this.json(result);
    }

    @httpPost()
    public async create() {
        const user = this.context.request.body;
        const existedUser = await this.service.getByUsername(user.username);
        if (existedUser) {
            return this.badRequest({ message: '用户名已存在' });
        }
        const created = await this.service.create(user);
        return this.json(created);
    }

    @httpPut('(?<id>\\d+)')
    public async update(@route('id') id: number) {
        const originalUser = await this.service.get(id);
        if (!originalUser) return this.notFound();
        const user = this.context.request.body;
        await this.service.update(id, user);
        return this.noContent();
    }

    @httpPatch('(?<id>\\d+)/password')
    public async resetPassword(@route('id') id: number, @body('pwd') password: string) {
        const user = await this.service.get(id);
        if (!user) return this.notFound();
        if (user!.password === password) {
            return this.badRequest({ message: '密码不能与旧的密码相同。' });
        }
        await this.service.update(id, { password });
        return this.noContent();
    }

    @httpDelete('(?<id>\\d+)')
    public async delete(@route('id') id: number) {
        const user = await this.service.get(id);
        if (!user) return this.notFound();
        await this.service.delete(id);
        return this.noContent();
    }

    @httpGet('(?<id>\\d+)/addresses')
    public async getAddresses(@route('id') userId: number) {
        const user = await this.service.get(userId);
        if (!user) return this.notFound();
        const addresses = await this.addressService.getAddressesByUserId(userId);
        const result = new ViewModel(addresses);
        return this.json(result);
    }

}