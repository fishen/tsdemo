import { Model as SModel } from 'sequelize';

export class Model extends SModel {
    public readonly createdAt: Date;
    public readonly updatedAt: Date;
}