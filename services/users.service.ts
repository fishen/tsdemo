import { IService } from './service';
import { Users } from '../models/';
import { injectFor } from '../core';
import { MySqlService } from './mysql.service';

export interface IUserService extends IService<Users> {
    getByUsername(name: string): Promise<Users | null>;
}

export abstract class IUserService { }

@injectFor(IUserService, Users)
export class DBUserService extends MySqlService<Users & typeof Users> implements IUserService {
    getByUsername(username: string): Promise<Users | null> {
        if (username === null || username === undefined) return Promise.resolve(null);
        return this.context.findOne({ where: { username } });
    }
}