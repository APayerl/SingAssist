import { BaseModel } from "./BaseModel";
import { DataTypes, Sequelize } from "sequelize";

export function CredentialInit(sequelize: Sequelize) {
	let credArr = Object.keys(CredentialType);
	Credential.init({
		email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: true
		},
		token: {
			type: DataTypes.STRING,
			allowNull: true
		},
		type: {
			type: DataTypes.ENUM,
			values: credArr.slice(credArr.length/2),
			allowNull: false
		}
	}, {
		sequelize: sequelize,
		tableName: 'credentials'
	});
}

export enum CredentialType {
	EMAIL,
	TOKEN
}

export class Credential extends BaseModel {
	public type!: CredentialType;
	public token?: string;
	public email?: string;
	public password?: string;
}