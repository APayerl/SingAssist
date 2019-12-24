import sequelize, { Model, Sequelize } from 'sequelize';
// import sequelize from 'sequelize';

module.exports = (sequelize: Sequelize, type: sequelize.DataTypes) => {
    return sequelize.define('user', {
        id: {
          type: type.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: type.STRING
    })
}

class User extends Model {
    public id!: number;
    public firstname!: string;
    public lastname!: string;
  
    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}