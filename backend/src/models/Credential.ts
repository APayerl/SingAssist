import { BaseModel } from "./BaseModel";

export class Credential extends BaseModel {
	public email!: string;
	public password!: string;
}