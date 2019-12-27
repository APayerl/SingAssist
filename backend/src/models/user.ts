import { HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyCountAssociationsMixin, HasManyAddAssociationMixin, HasManyCreateAssociationMixin, Association } from 'sequelize';
import { BaseModel } from './BaseModel';
import { Credential } from './Credential';

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