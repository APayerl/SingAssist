import { HasManyGetAssociationsMixin, 
    HasManyHasAssociationMixin, 
    HasManyCountAssociationsMixin, 
    HasManyAddAssociationMixin, 
    HasManyCreateAssociationMixin, 
    Association, 
    DataTypes, 
    Sequelize } from 'sequelize';
import { BaseModel } from './BaseModel';
import { Credential } from './Credential';

export function UserInit(sequelize: Sequelize) {
    User.init({
        firstname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'users',
        sequelize: sequelize
    });
}

export class User extends BaseModel {
    public firstname!: string;
    public lastname!: string;

    public getCredentials!: HasManyGetAssociationsMixin<Credential>;
    public createCredential!: HasManyCreateAssociationMixin<Credential>;
    public addCredential!: HasManyAddAssociationMixin<Credential, number>;
    public hasCredential!: HasManyHasAssociationMixin<Credential, number>;
    public countCredentials!: HasManyCountAssociationsMixin;

    public readonly credentials?: Credential[];

    public static associations: {
        credentials: Association<User, Credential>;
    }
}