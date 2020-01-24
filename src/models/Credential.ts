import { BaseModel } from "./BaseModel";
import { DataTypes, Sequelize } from "sequelize";

export function CredentialInit(sequelize: Sequelize) {
	let cred = Object.keys(CredentialType);
	let credArr: string[] = [];
	for(let i = 0; i < cred.length/2; i++) {
		credArr.push(`${i}`);
	};
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
			type: DataTypes.INTEGER,
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

export function CreateCredentialObject(_type: CredentialType, _email: string | string[], _password: string | string[], _token: string | string[]) {
	return {
		type: _type,
		token: _token != null ? _token as string : null,
		email: _email != null ? _email as string : null,
		password: _password != null ? _password as string : null
	};
}

export class Credential extends BaseModel {
	public type!: CredentialType;
	public token?: string;
	public email?: string;
	public password?: string;
}