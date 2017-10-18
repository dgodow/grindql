'use strict';

// INITIALIZE DB CLIENT
const { Client } = require('pg');

class Database {
  constructor (dbName) {
    this.dbName = dbName;
  }
  
  createDbClient () {
    return new Client({
      user: "dgodow", 
      host: "localhost",
      port: 5432,
      database: `${this.dbName}`
    })
  }

  async _getTables () {
    if (!this.dbName) {
      throw new Error("No valid database detected.");
    }

    const client = this.createDbClient();
    let response;

    client.connect();
    
    client.query("SELECT * FROM pg_catalog.pg_tables WHERE schemaname = 'public'")
    .then(response => {
      client.end();
      return response.rows.map(row => row.tablename);
    })
    .catch(err => {
      client.end();
      console.error(err);
      return;
    });

    client.end();

    if (!Array.isArray(response.rows) || response.rows.length === 0) {
      throw new Error("Response was not a valid array or was empty.");
    }

  }

  async getAttributes () {
    const client = this.createDbClient();
    const tables = await this._getTables();

    const requests = tables.map(table => {
      const query = client.query(`SELECT column_name, table_name FROM information_schema.columns WHERE table_name = '${table}'`);
      return new Promise((resolve, reject) => {
        resolve(query);
      })
    });
    
    return client.connect()
    .then(() => Promise.all(requests))
    .then(queryResults => {
      client.end();

      if (!Array.isArray(queryResults) || queryResults.length === 0) {
        throw new Error("Response was not a valid array or was empty.");
      }

      return queryResults.map(result => {
        let attributes = result.rows.map(row => row.column_name);
        return {[result.rows[0].table_name]: attributes};
      });
    })
    .catch(err => {
      client.end();
      console.error(err);
    });
  }

  async loadTables () {
    const tables = await this._getTables();
    const attributes = await this.getAttributes(tables);

    return attributes;
  }
}

module.exports = Database;