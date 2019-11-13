import { Model as SModel } from 'sequelize';
import { column } from '../core/index';

export class Model extends SModel {
    @column({ primaryKey: true, autoIncrement: true })
    public id: number;
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
}