
import { route, router, httpPost, body, httpPatch, httpGet, inject, injectable } from "../core";
import { IAddressService, IUserService } from "../services";
import { UserViewModel, ViewModel } from '../vmodels'
import BaseController from "./base.controller";
import { Users } from "models";

@router('users')
@injectable
export default class extends BaseController<Users> {
    constructor(
        @inject() protected service: IUserService,
        @inject() private addressService: IAddressService,
    ) {
        super(service, UserViewModel);
    }

    /**
     * 添加用户
     * @param name 请求实体参数，用户名 
     */
    @httpPost()
    public async create(@body("username") name: string) {
        const existedUser = await this.service.getByUsername(name);
        if (existedUser) {
            return this.badRequest({ message: '用户名已存在' });
        }
        return super.create();
    }

    /**
     * 重新设置密码
     * @param id 路由参数，用户Id
     * @param password 请求体参数，用户新密码
     * @example /users/1/password
     */
    @httpPatch(/(?<id>\d+)\/password/)
    public async resetPassword(@route('id') id: number, @body('pwd') password: string) {
        const user = await this.service.get(id);
        if (!user) return this.notFound();
        if (user!.password === password) {
            return this.badRequest({ message: '密码不能与旧的密码相同。' });
        }
        await this.service.update(id, { password });
        return this.noContent();
    }

    /**
     * 获取指定用户的所有地址列表
     * @param userId 路由参数，用户Id
     * @example /users/1/addresses
     */
    @httpGet('(?<id>\\d+)/addresses')
    public async getAddresses(@route('id') userId: number) {
        const user = await this.service.get(userId);
        if (!user) return this.notFound();
        const addresses = await this.addressService.getAddressesByUserId(userId);
        const result = new ViewModel(addresses);
        return this.json(result);
    }
}