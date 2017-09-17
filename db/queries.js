'use strict';

const db = require('./db.js').db;
const createDbClient = require('./db.js').createDbClient;

async function createQuery (database, query) {
    const client = createDbClient(database);
    
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
  
  chooseAttributes: function (difficulty, tables) {
    const quantity = this.findAttributeQuantity(difficulty, tables);


    return quantity;
  }

})

const queryEngine = (difficulty, database) => {
  let state = {
    difficulty, database
  };

  return Object.assign(
    {},
    db(state.database),
    selector(state.difficulty)
  )
};

const querier = queryEngine(1, "world");