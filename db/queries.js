'use strict';

const db = require('./db.js');

async function runQuery (database, query) {
    // TODO: Reimplement the below with createDbClient now in the db object
    // const client = createDbClient(database); 
    
    return client.connect()
    .then(() => client.query(query, (err) => {
      if (err) throw new Error(err);
    }))
    .then(result => {
      client.end();
      return result;
    })
}

const selector = (difficulty) => ({
  difficulty,

  findAttributeQuantity: function (difficulty, tables) {
    let dbAttributes = tables.length;
    let numAttributes = 0;
  
    // Determine number of attributes based on difficulty
    switch (difficulty) {
      case 1: 
        numAttributes = 1;
        break;
  
      case 2:
        if (dbAttributes.length < 2) return 1;
        numAttributes = 1 + (Math.round(Math.random()));
        break;
  
      case 3:
        if (dbAttributes.length < 4) return dbAttributes;
        numAttributes = 2 + (Math.round(Math.random())) * 2;
        break;
    }

    return numAttributes;
  },

  findNumTables: function (difficulty, maxTables) {
    if (!Number.isInteger(difficulty) || difficulty < 1) {
      throw new Error("Difficulty must be a positive integer");
    }

    let numTables = 1;

    switch (difficulty) {
      case 1:
        return numTables;
        
      case 2:
        numTables = Math.round(Math.random() * 2);
        return (numTables > 0) ? numTables : 1;

      case 3:
        numTables = Math.round(Math.random() * 3);
        return (numTables > 0) ? numTables : 1;

      default:
        return 1;
        break;
    }
  },
  
  chooseAttributes: async function (difficulty) {
    const tables = await this.getTables();
    let attributes = await this.getAttributes(tables);
    let quantity = this.findAttributeQuantity(difficulty, tables);

    let chosenAttributes = [];
    let numTables = this.findNumTables(difficulty);

    while (quantity) {
      let choice = Math.round(Math.random() * (attributes.length-1));
      chosenAttributes.push(attributes[choice]);
      attributes.splice(choice, 1);
      quantity--;
    }
    return chosenAttributes;
  }

})

const queryEngine = (difficulty, database) => {
  let state = {
    difficulty, 
    database
  };

  return Object.assign(
    {},
    db(state.database),
    selector(state.difficulty)
  )
};

const querier = queryEngine(1, "world");
console.log(querier.findNumTables(3));