import { BaseModel } from "./BaseModel";
import { DataTypes, Sequelize } from "sequelize";

export function CredentialInit(sequelize: Sequelize) {
	Credential.init({
		email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		sequelize: sequelize,
		tableName: 'credentials'
	});
}

export class Credential extends BaseModel {
	public email!: string;
	public password!: string;
}