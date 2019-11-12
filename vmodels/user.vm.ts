import { mapping } from 'auto-mapping';
import { jsonIgnore } from '../core';

export class UserViewModel {
    @mapping()
    public id: number;
    @mapping()
    public username: string;
    @mapping()
    public gender: boolean;
    @mapping()
    @jsonIgnore
    public birthdate: Date;
    @mapping()
    public readonly createdAt: Date;
    @mapping()
    public readonly updatedAt: Date;
}

export class PagedUserListViewModel {
    @mapping({ type: [UserViewModel], path: 'rows' })
    list: Array<UserViewModel>;
    @mapping()
    count: number;
}