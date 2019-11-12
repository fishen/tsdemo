import { IService } from './service';
import { Addresses } from '../models/';
import { injectFor } from '../core';
import { MySqlService } from './mysql.service';

export interface IAddressService extends IService<Addresses> {
    getAddressesByUserId(userId: number): Promise<Array<Addresses>>;
    getAddressesByCity(city: string): Promise<Array<Addresses>>;
}

export abstract class IAddressService { }

@injectFor(IAddressService, Addresses)
export class DBAddressService extends MySqlService<Addresses & typeof Addresses> implements IAddressService {
    getAddressesByCity(city: string): Promise<Addresses[]> {
        return this.context.findAll({ where: { city } });
    }
    getAddressesByUserId(userId: number): Promise<Addresses[]> {
        if (!userId) return Promise.resolve([]);
        return this.context.findAll({ where: { userId } });
    }
}