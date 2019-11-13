
import { route, router, httpGet, inject, injectable } from "../core";
import { IAddressService } from "../services/index";
import BaseController from "./base.controller";
import { Addresses } from "models";

@router('addresses')
@injectable
export default class extends BaseController<Addresses> {

    constructor(@inject() protected service: IAddressService) {
        super(service);
    }

    /**
     * 查询指定城市名称的地址列表
     * @param city 路由参数，城市名
     * @example /addresss/city/北京
     */
    @httpGet(/city\/(?<name>[^/]+)/)
    public async getByCity(@route('name') city: string) {
        const result = await this.service.getAddressesByCity(city);
        return this.json(result);
    }
}