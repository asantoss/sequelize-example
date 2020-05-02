# Sequelize Example Jan Flex Class

### Please make sure you create a .env file when you pull this repo.

```
PG_USER= Your postgres username here
PG_PASS= Your Postgres Password here

```

## Project information

1. First we created a node project using npm init
2. We installed the following packages
   1. express
   2. body-parser
   3. pg
   4. sequelize
3. We then use the sequelize cli to create our sequelize config
   - Use npx sequelize-cli init if you do not have it globally installed.
4. Use the sequelize cli to generate your models
   - npx sequelize-cli model:generate --name user --attributes username:string,email:string,password:string
   - npx sequelize-cli model:generate --name tweets --attributes message:string
5. The final step using the sequelize cli is to create a migration to add our associations

   - npx sequelize-cli migration:generate --name add_associations
   - This created a migration file that we will use to add our foreign key columns to the tweets table. See below

   ```
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
    },

    down: (queryInterface, Sequelize) => {
    	return queryInterface.removeColumn('tweets', 'userId');
    },};
   ```
