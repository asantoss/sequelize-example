'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('tweets', 'userId', {
			type: Sequelize.INTEGER,
			refrences: {
				table: 'user',
				column: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
		});

		/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.removeColumn('tweets', 'userId');
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
	},
};
