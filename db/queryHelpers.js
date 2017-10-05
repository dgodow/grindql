'use strict';

class QueryHelpers {
  constructor() {

  }

  findNumTables (difficulty, maxTables) {
    /**
     * TO BE USED FOR QUERIES WITH MULTIPLE TABLES -- CURRENTLY UNUSED
     * Finds the number of tables to be included in a query based on difficulty
     * and controlled by the number of tables in the database.
     * @param {int} difficulty - the difficulty of the question, from 0 to 3
     * @param {int} maxTables - the maximum number of tables
     */
    
    if (!Number.isInteger(difficulty) || difficulty < 1) {
      throw new Error("Difficulty must be a positive integer");
    }

    if (!Number.isInteger(maxTables) || maxTables < 1) {
      throw new Error("maxTables must be a positive integer");
    }
  
    let numTables;
  
    switch (difficulty) {
      case 1:
        numTables = 1;
        return numTables;
        
      case 2:
        numTables = 1 + Math.round(Math.random());
        return (numTables <= maxTables) ? numTables : maxTables;
  
      case 3:
        numTables = 2 + Math.round(Math.random() * 2);
        return (numTables <= maxTables) ? numTables : maxTables;
  
      default:
        return 1;
        break;
    }
  };

  findNumAttributes (difficulty, table) {
    /**
     * Finds the number of attributes (columns) to be included in a query
     * based on the difficulty of the question.
     * @param {int} difficulty - the difficulty of the question, from 0 to 3
     * @param {table} table - an object with one node where the key is a table name and the value is an array of attribute names
     */

    let dbAttributes = table.length;
    let numAttributes = 0;

    // ERROR HANDLING

    if (!Number.isInteger(difficulty) || difficulty < 0) {
      throw new Error("Difficulty must be a positive integer.");
    }

    if (difficulty > 3) {
      throw new Error("Difficulties greater than 3 not currently supported.");
    }

    if (typeof table !== "object" || table === null) {
      throw new Error("Table must be a object and not null");
    }
    
    switch (difficulty) {
      case 1: 
        // Returns 1 attribute.
        numAttributes = 1;
        break;
  
      case 2:
        // Returns 1 to 2 attributes if the table permits.
        if (dbAttributes.length < 2) return 1;
        numAttributes = 1 + (Math.round(Math.random()));
        break;
  
      case 3:
        // Returns 2 to 4 attributes if the table permits.
        if (dbAttributes.length < 4) return dbAttributes;
        numAttributes = 2 + (Math.round(Math.random()));
        break;

      default:
        numAttributes = 1;
        break;
    }

    return numAttributes;
  }

  chooseTable (tables) {
    /**
     * Chooses a random table from an array of tables when building a query
     * @param {array} arr - an array of table objects
     * TODO: Extend to include an arbitrary number of tables based on difficulty; use with findNumTables
     */

    const index = Math.floor(Math.random() * tables.length);
    const attributes = tables[index];
    return attributes;
  }
  
  chooseAttributes (difficulty, table) {
    /**
     * Given a difficulty level for a query and a table object, choose a random subset of attributes from the table to be used in a query.
     * @param {int} difficulty - an integer from 0 to 3 describing the difficulty of the query.
     * @param {object} table - a table object.
     */

    let workingArr = Object.values(table)[0];

    if (!Number.isInteger(difficulty) || difficulty < 1) throw new Error("Difficulty must be an integer greater than 0");
    if (!Array.isArray(workingArr)) throw new Error("Table must be an array of attributes"); // TODO: Improve this!
    
    const numAttributes = this.findNumAttributes(difficulty, table);
    if (numAttributes === 1) return [workingArr[Math.floor(Math.random() * workingArr.length)]];

    // Fisher-Yates to randomize array
    for (let i = 0, j = numAttributes; i < j; i++) {
      let chosenIndex = Math.floor(Math.random() * workingArr.length);
      let elementToMove = workingArr[chosenIndex];
      workingArr[chosenIndex] = workingArr[i];
      workingArr[i] = elementToMove;
    }

    return workingArr.slice(0,numAttributes);
  }
}

module.exports = QueryHelpers;