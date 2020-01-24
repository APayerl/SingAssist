import { Sequelize } from 'sequelize';
import { User, UserInit } from './models/User';
import { Credential, CredentialInit } from './models/Credential';
import { createConnection, Connection } from 'mariadb';
import { PreferenceParser } from './preference-parser';

export class DbHandler {
	static sequelize: Sequelize;
	dbName: string;
	username: string;
	password: string;
	mHost: string;
	mPort: number;
	private static ready: boolean;
	syncInterval: number;

  	constructor(pref: PreferenceParser, syncInt: number = 5*60*1000) {
		if(!DbHandler.sequelize) {
			this.dbName = pref.database.name;
			this.username = pref.database.username;
			this.password = pref.database.password;
			this.mHost = pref.database.domain;
			this.mPort = pref.database.port;
			this.syncInterval = pref.database.sync_inteval;
			this.init().then(val => {
				DbHandler.ready = val;
			}).catch(err => {
				console.log(err);
				DbHandler.ready = false;
			});
		}
	}

	private async init(): Promise<true> {
		return new Promise<true>(async (resolve, reject) => {
			if(!DbHandler.sequelize) {
				let conn = await createConnection({ host: this.mHost, port: this.mPort, user: this.username, password: this.password }).catch(err => {
					//TODO Fix error handling if not able to connect
				}) as Connection;
				await conn.query(`CREATE DATABASE IF NOT EXISTS ${this.dbName}`);
				await conn.end();

				DbHandler.sequelize = new Sequelize(this.dbName, this.username, this.password, {
					host: this.mHost,
					dialect: 'mariadb',
					port: this.mPort,
					pool: {
						max: 10,
						min: 0,
						acquire: 1000,
						idle: 10000
					},
					logging: false
				});

				UserInit(DbHandler.sequelize);
				CredentialInit(DbHandler.sequelize);

				User.hasMany(Credential, { onDelete: 'cascade', hooks: true, as: 'credentials' });
				Credential.belongsTo(User);
				// User.belongsToMany(Credential, {
				// 	through: 'UserCredential',
				// 	constraints: true,
				// });
			
				DbHandler.sequelize.sync();
				// let syncTask = setInterval(() => {
				// 	DbHandler.sequelize.sync().then(seq => {
				// 		// console.log(seq.models);
				// 	}).catch(err => {
				// 		console.log(err);
				// 	});
				// }, this.syncInterval);
			}
			resolve(true);
		});
	}
}