'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('tweet', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			message: {
				type: Sequelize.STRING,
			},
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('tweet');
	},
};
