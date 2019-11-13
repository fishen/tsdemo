import { Model } from './model';
import { table, column } from '../core';

@table({ tableName: 'addresses' })
export class Addresses extends Model {
    @column({ allowNull: false })
    public province: string;
    @column({ allowNull: false })
    public city: string;
    @column({ allowNull: false })
    public detail: string;
    @column({ allowNull: false })
    public userId: number;
    @column()
    public postcode: string;
}