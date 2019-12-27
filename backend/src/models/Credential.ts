import { BaseModel } from "./BaseModel";
import { DataTypes, Sequelize } from "sequelize";

export function CredentialInit(sequelize: Sequelize) {
	Credential.init({
		email: {
			type: DataTypes.STRING,
			allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
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