import { Sequelize } from 'sequelize';
import { User, UserInit } from './models/User';
import { Credential, CredentialInit } from './models/Credential';
import { createConnection, Connection } from 'mariadb';
import { PreferenceParser } from './preference-parser';
import { UserCredential, UserCredentialInit } from './models/UserCredential';


export class DbHelper {
	static sequelize: Sequelize;
	private ready: boolean;

  	constructor(private prefParser: PreferenceParser) {
		if(!DbHelper.sequelize) {
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
				let conn = await createConnection({ host: this.prefParser.database.domain, port: this.prefParser.database.port, user: this.prefParser.database.username, password: this.prefParser.database.password }).catch(err => {
					//TODO Fix error handling if not able to connect
				}) as Connection;
				await conn.query(`CREATE DATABASE IF NOT EXISTS ${this.prefParser.database.name}`);
				await conn.end();

				DbHelper.sequelize = new Sequelize(this.prefParser.database.name, this.prefParser.database.username, this.prefParser.database.password, {
					host: this.prefParser.database.domain,
					dialect: 'mariadb',
					port: this.prefParser.database.port,
					pool: {
						max: 10,
						min: 0,
						acquire: 1000,
						idle: 10000
					}
				});

				UserInit(DbHelper.sequelize);
				CredentialInit(DbHelper.sequelize);
				UserCredentialInit(DbHelper.sequelize);

				// User.hasMany(Credential, { foreignKey: 'id', sourceKey: 'id' });
				// User.hasMany(Credential, { sourceKey: 'id', foreignKey: 'UserId'});
				Credential.belongsToMany(User, { through: UserCredential });
			
				DbHelper.sequelize.sync();
				let syncTask = setInterval(() => {
					DbHelper.sequelize.sync().then(seq => {
						// console.log(seq.models);
					}).catch(err => {
						console.log(err);
					});
				}, this.prefParser.database.sync_inteval);
			}
			resolve(true);
		});
	}
}