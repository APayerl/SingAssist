import { Sequelize, Model, DataTypes } from 'sequelize';
import { HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyHasAssociationMixin, Association, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin } from 'sequelize';
import { User } from './models/User';
import { Credential } from './models/Credential';
import { createConnection, Connection } from 'mariadb'; 

export class DbHelper {
	static sequelize: Sequelize;
	dbName: string;
	username: string;
	password: string;
	mHost: string;
	mPort: number;
	private ready: boolean;

  	constructor(dbName: string, username: string, password: string, mHost: string, mPort: number) {
		if(!DbHelper.sequelize) {
			this.dbName = dbName;
			this.username = username;
			this.password = password;
			this.mHost = mHost;
			this.mPort = mPort;
			this.init().then(val => {
				this.ready = val;
			}).catch(err => {
				console.log(err);
				this.ready = false;
			});
		}
	}

	private async init(): Promise<true> {
		return new Promise<true>(async (resolve, reject) => {
			if(!DbHelper.sequelize) {
				let conn = await createConnection({ host: this.mHost, port: this.mPort, user: this.username, password: this.password }).catch(err => {
					//TODO Fix error handling if not able to connect
				}) as Connection;
				await conn.query(`CREATE DATABASE IF NOT EXISTS ${this.dbName}`);
				await conn.end();

				DbHelper.sequelize = new Sequelize(this.dbName, this.username, this.password, {
					host: this.mHost,
					dialect: 'mariadb',
					port: this.mPort,
					pool: {
						max: 10,
						min: 0,
						acquire: 30000,
						idle: 10000
					}
				});
			
				const syncInterval: number = 5 * 60 * 1000;
			
				DbHelper.sequelize.sync();
				let syncTask = setInterval(() => {
					DbHelper.sequelize.sync().then(seq => {
						// console.log(seq.models);
					}).catch(err => {
						console.log(err);
					});
				}, syncInterval);
			
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
					sequelize: DbHelper.sequelize,
					tableName: 'credentials'
				});
			
				User.init({
					firstname: {
						type: DataTypes.STRING,
						allowNull: false
					},
					lastname: {
						type: new DataTypes.STRING(128),
						allowNull: false
					}
				}, {
					tableName: 'users',
					sequelize: DbHelper.sequelize
				});
	
				User.hasMany(Credential);
				Credential.belongsTo(User);
			}
			resolve(true);
		});
	}
}