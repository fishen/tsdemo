import { mapping, after } from 'auto-mapping';
import { jsonIgnore } from '../core';

export class UserViewModel {
    @mapping()
    public id: number;
    @mapping()
    public username: string;
    @mapping()
    public firstName: string;
    @mapping()
    public lastName: string;
    @mapping((_v, src) => `${src.firstName}${src.lastName}`)
    public fullName: string;
    @mapping(val => val ? '男' : '女')
    public gender: string;
    @mapping()
    public birthdate: Date;
    @mapping()
    public readonly createdAt: Date;
    @jsonIgnore
    @mapping()
    public readonly updatedAt: Date;

}