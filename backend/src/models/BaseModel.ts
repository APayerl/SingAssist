import { Model } from 'sequelize';

export class BaseModel extends Model {
    public id?: number;
  
    // timestamps!
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}

// export interface BaseAttributes {
//     id: number;
  
//     readonly createdAt: Date;
//     readonly updatedAt: Date;
// }