'use strict';
module.exports = (sequelize, DataTypes) => {
	const user = sequelize.define('user', {
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		email: DataTypes.STRING,
	});
	user.associate = function (models) {
		// associations can be defined here
		// We added an association to our tweets.
		user.hasMany(models.tweets);
	};
	return user;
};
