import express, { Request, Response, Router, IRoute } from "express";
import { User } from "./models/User";
import { Credential } from "./models/Credential";

export let users: Router = express.Router();

// users.get('/user', (req, res) => {
// 	res.status(222).send("Yay!");
// });

// let userId: IRoute = users.route('{user-id}');

// userId.get(async (req: Request, res: Response) => {
// 	//TODO Get user
// 	let user = await User.findOne({ where: { firstname: 'Anders'}});
// 	console.log(user);
// 	res.status(200).send(JSON.stringify(user));
// });
// userId.delete((req: Request, res: Response) => {
// 	//TODO Delete user
// });
// userId.patch((req: Request, res: Response) => {
// 	//TODO Update specific field
// });

users.route('/user').post(async (req: Request, res: Response) => {
	//TODO Create new user
	let user = await User.create({
		firstname: req.fields.firstname,
		lastname: req.fields.lastname
	} as User);
	await user.createCredential({
		email: req.fields.email,
		password: req.fields.password
	});
	// await user.addCredential({ 
	// 	email: req.fields.email,
	// 	password: req.fields.password
	// } as Credential);
	// let cred: Credential = { email: req.fields.email, password: (req.fields.password as string) };
	// user.credentials.push(cred);
	res.status(201).send(`User: ${JSON.stringify(user)} was created!`);
});

users.route('/user').get(async (req: Request, res: Response) => {
	//TODO Get user
	let user = await User.findOne({ where: { firstname: 'Anders'}});
	let cred = await user.getCredentials();
	res.status(200).send(JSON.stringify(user) + " + " + JSON.stringify(cred));
});