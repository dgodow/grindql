'use strict';

// INITIALIZE DB CLIENT
const { Client } = require('pg');

const db = (database) => ({
  tables: [],
  attributes: {},

  createDbClient: function () {
    return new Client({
      user: "dgodow", 
      host: "localhost",
      port: 5432,
      database: `${database}`
    })
  },

  getTables: async function () {
    const client = this.createDbClient(database);
    client.connect();
    const response = await client.query("SELECT * FROM pg_catalog.pg_tables WHERE schemaname = 'public'");
    client.end();
    
    return response.rows.map(row => row.tablename)
  },

  getAttributes: async function (tables) {
    const client = this.createDbClient(database);
    const requests = tables.map(table => {
      const query = client.query(`SELECT column_name, table_name FROM information_schema.columns WHERE table_name = '${table}'`);
      return new Promise((resolve, reject) => resolve(query));
    })
    
    return client.connect()
    .then(() => Promise.all(requests))
    .then(queryResults => {
      client.end()
      return queryResults.map(result => {
        let attributes = result.rows.map(row => row.column_name);
        return {[result.rows[0].table_name]: attributes};
      });
    })
  }
})

module.exports = db;