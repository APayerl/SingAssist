import { Model } from 'sequelize';

export class BaseModel extends Model {
    public id?: number;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}