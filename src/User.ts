import express, { Request, Response, Router, IRoute } from "express";
import { User } from "./models/User";
import { CredentialType, CreateCredentialObject, Credential } from "./models/Credential";

export let users: Router = express.Router();

let userId: IRoute = users.route('/:userId');
let userCredentials: IRoute = users.route('/:userId/credentials');

userId.get(async (req: Request, res: Response) => {
	let user = await User.findOne({ where: { id: req.params.userId } });
	if(user) {
		res.status(200).send(JSON.stringify(user));
	} else {
		res.status(404).send('User not found.');
	}
});
userId.delete(async (req: Request, res: Response) => {
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

userCredentials.post(async (req: Request, res: Response) => {
	let user: User = await User.findOne({
		where: { id: req.params.userId }
	});
	if(!user) {
		res.status(400).send(`No user with id: ${req.params.userId} not found.`);
		return;
	}
	let credObj;
	if(req.fields.email) {
		credObj = CreateCredentialObject(CredentialType.EMAIL, req.fields.email, req.fields.password, null);
	} else {
		credObj = CreateCredentialObject(CredentialType.TOKEN, null, null, req.fields.token);
	}
	let response = await user.createCredential(credObj);
	res.status(200).send(response);
});

userCredentials.get(async (req: Request, res: Response) => {
	let user: User = await User.findOne({
		where: { id: req.params.userId }
	});
	if(!user) {
		res.status(400).send(`No user with id: ${req.params.userId} not found.`);
		return;
	}
	res.status(200).send(JSON.stringify(await user.getCredentials()));
});

userCredentials.delete(async (req: Request, res: Response) => {
	let user: User = await User.findOne({
		where: { id: req.params.userId },
		include: [User.associations.credentials]
	});
	if(!user) {
		res.status(400).send(`No user with id: ${req.params.userId} not found.`);
		return;
	}

	let err: string[] = [];

	if(req.fields.email) {
		let result: Credential = await user.credentials.find(x => x.email === req.fields.email && x.password === req.fields.password);
		if(result == undefined) {
			err.push(`Credential not found: ${req.fields.email}.`);
		} else {
			await result.destroy().catch(err => err.push(`Failed to remove the credential ${req.fields.email}.`));
		}
	}
	if(req.fields.token) {
		let result = await user.credentials.find(x => x.token === req.fields.token);
		if(result == undefined) {
			err.push(`Credential not found: ${req.fields.token}.`);
		} else {
			await result.destroy().catch(err => err.push(`Failed to remove the credential ${req.fields.token}.`));
		}
	}

	err.length > 0 ? res.status(400).send(`Failed to remove some credentials: ${err}`) : res.status(200).send(`Removed all the credentials.`);
});

users.route('/').post(async (req: Request, res: Response) => {
	let user: User = await User.create({
		firstname: req.fields.firstname,
		lastname: req.fields.lastname,
		email: req.fields.email
	});
	await user.createCredential({ type: CredentialType.EMAIL, email: req.fields.email as string, password: req.fields.password as string, token: null });
	res.status(201).send(`User: ${JSON.stringify(user)} was created!`);
});

users.route('/').get(async (req: Request, res: Response) => {
	let user = await User.findOne({ where: { firstname: 'Anders'}});
	if(user) {
		let cred = await user.getCredentials() as Credential[];
		res.status(200).send(JSON.stringify(user) + " + " + JSON.stringify(cred[0]));
	} else {
		res.status(200).send("No user found.");
	}
});