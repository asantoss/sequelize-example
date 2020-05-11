'use strict';
module.exports = (sequelize, DataTypes) => {
	const tweets = sequelize.define(
		'tweets',
		{
			message: DataTypes.STRING,
		},
		{
			freezeTableName: true,
			timestamps: false,
		}
	);
	tweets.associate = function (models) {
		// associations can be defined here
		// Added an association to our user
		tweets.belongsTo(models.user);
	};
	return tweets;
};
