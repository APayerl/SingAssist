import express, { Request, Response, Router, IRoute } from "express";

export let users: Router = express.Router();

let userId: IRoute = users.route('user-id');

userId.get((req: Request, res: Response) => {
	//TODO Get user
});
userId.delete((req: Request, res: Response) => {
	//TODO Delete user
});
userId.patch((req: Request, res: Response) => {
	//TODO Update specific field
});

users.route('user').post((req: Request, res: Response) => {
	//TODO Create new user
});