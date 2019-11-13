import { Sequelize, DataTypes, DataType, ModelAttributeColumnOptions, InitOptions, Model } from 'sequelize';
import { Injector } from './inject';
import { DESIGN_TYPE } from './constants';

const ATTRIBUTES_KEY = Symbol();

const TYPE_MAPPINGS = new Map<Function, DataType>([
    [String, DataTypes.STRING],
    [Number, DataTypes.INTEGER],
    [Boolean, DataTypes.BOOLEAN],
    [Date, DataTypes.DATE],
]);

export function column(options?: Omit<ModelAttributeColumnOptions, 'type'> & { type?: DataType }) {
    return function (target: any, name: string) {
        const attributes = Reflect.getMetadata(ATTRIBUTES_KEY, target) || {};
        const type = Reflect.getMetadata(DESIGN_TYPE, target, name);
        options = Object.assign({ type: TYPE_MAPPINGS.get(type) }, options);
        const metadata = Object.assign({}, attributes, { [name]: options });
        Reflect.defineMetadata(ATTRIBUTES_KEY, metadata, target);
    }
}

export function table<T extends (new () => any) & typeof Model>(options: Omit<InitOptions, 'sequelize'>) {
    return function (constructor: T) {
        const attributes = Reflect.getOwnMetadata(ATTRIBUTES_KEY, constructor.prototype);
        const sequelize = Injector.get(Sequelize);
        constructor.init(attributes, Object.assign(options, { sequelize }));
        constructor.sync();
    }
}