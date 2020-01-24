import express, { Request, Response, Router, IRoute } from "express";
import { User } from "./models/User";
import { CredentialType, CreateCredentialObject } from "./models/Credential";
import { PreferenceParser } from "./preference-parser";

let prefParser = new PreferenceParser(require('../config/settings.json'));

export let users: Router = express.Router();

let userId: IRoute = users.route('/:userId');

userId.get(async (req: Request, res: Response) => {
	let user = await User.findOne({ where: { id: req.params.userId } });
	if(user) {
		res.status(200).send(JSON.stringify(user));
	} else {
		res.status(404).send('User not found.');
	}
});
userId.delete(async (req: Request, res: Response) => {
	//TODO Delete user
	let rows: number = await User.destroy({
		where: {
			id: req.params.userId
		}
	});
	res.status(200).send(`${rows} row(s) with user id: ${req.params.userId} was deleted.`);
});
userId.patch((req: Request, res: Response) => {
	//TODO Update specific field
});

users.route('/').post(async (req: Request, res: Response) => {
	let user = await User.create({
		firstname: req.fields.firstname,
		lastname: req.fields.lastname
	} as User);
	let credentialObj = CreateCredentialObject(CredentialType.EMAIL, req.fields.email as string, req.fields.password as string, null);
	await user.createCredential(credentialObj);
	res.status(201).send(`User: ${JSON.stringify(user)} was created!`);
});

users.route('/').get(async (req: Request, res: Response) => {
	//TODO Get user
	let user = await User.findOne({ where: { firstname: 'Anders'}});
	let cred = await user.getCredentials();
	res.status(200).send(JSON.stringify(user) + " + " + JSON.stringify(cred));
});