
import { table, column } from '../core/db';
import { Model } from './model';

@table({ tableName: 'users' })
export class Users extends Model {
    @column({ allowNull: false })
    public username: string;
    @column({ allowNull: false })
    public firstName: string;
    @column({ allowNull: false })
    public lastName: string;
    @column({ allowNull: false })
    public password: string;
    @column()
    public gender: boolean;
    @column()
    public birthdate: Date;
}