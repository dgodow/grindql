'use strict';

const Database = require('./db.js');
const QueryHelpers = require('./queryHelpers.js');

function query (query) {
  const client = createDbClient(database);
  client.query(query, err => {
    if (err) throw new Error(err);
  })
  .then(result => {
    client.end();
    return result;
  })
}

// SELECT name FROM city WHERE city.countrycode = "AFG" AND city.population > 250000;

class SelectQueryCreator {
  /**
   * Creates SELECT queries based on a difficulty and set of tables. Tables are provided by the Database class.
   * @param {int} difficulty 
   * @param {string} database
   */

  constructor (difficulty, database) {
    this.difficulty = difficulty;
    this.database = new Database(database);
    this.queryHelpers = new QueryHelpers();
  }

  async buildQuery () {
    /**
     * Builds a SELECT query using a snapshot of the database's tables.
     * @return {string} - a complete SELECT query.
     */

    let query = "SELECT ";
    const tables = await this.database.getAttributes();
    const chosenTable = this.queryHelpers.chooseTable(tables);

    // Build SELECT list (e.g., "SELECT a, b ")
    const selectList = this.getSelectList(chosenTable);

    if (selectList.length > 1) {
      for (let i = 0, j = selectList.length; i < j; i++) query += selectList[i] + ", "; 
    } else {
      query += selectList[0] + " ";
    }

    // Build FROM clause
    const fromClause = this.getFromClause(chosenTable);
    query += fromClause;

    // If difficulty is high enough, build where clause.
    if (this.difficulty < 2) return query + ";";

    const whereClause = this.getWhereClause(chosenTable, selectList);
  }

  getSelectList (table) {
    /**
     * Finds the attributes to be selected in the query (the "select list") given a table
     * TODO: Expand to support SELECTs with joins (i.e., multiple tables)
     * @param {array} table - an array of attributes from a table
     * @param {integer} this.difficulty - the difficulty of the question
     */

     // Define which attributes should be selected
     return this.queryHelpers.chooseAttributes(this.difficulty, table);
  }

  getFromClause (table) {
    /** 
     * Finds the FROM clause for the query given a table
     * TODO: Expand to support join tables
     * @param {array} table - an array of attributes from a table
     */

    const tableName = Object.keys(table)[0];
    return `FROM ${tableName}`
  }

  getWhereClause (table, selectList) {
    /**
     * Adds a WHERE clause for the query given a table
     * @param {array} table - an array of attributes from a table
     * @param {integer} this.difficulty - the difficulty of the question
     * @param {array} selectList - the attributes already included in the select statement (excluded from consideration for WHERE clause)
     */

    const remainingAttributes = table.filter(attribute => !selectList.includes(attribute))
    console.log(remainingAttributes);
  }
}

const queryCreator = new SelectQueryCreator(2, "world");
queryCreator.buildQuery().then(result => console.log(result));