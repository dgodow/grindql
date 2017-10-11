'use strict';

// INITIALIZE DB CLIENT
const { Client } = require('pg');

class Database {
  constructor (dbName) {
    this.dbName = dbName;
  }

  _createDbClient () {
    return new Client({
      user: "appuser",
      host: "localhost",
      port: 5432,
      password: "UeCnLxdY3BvQYYP5",
      database: `${this.dbName}`
    })
  }

  async _getTables () {
    if (!this.dbName) {
      throw new Error("No valid database detected.");
    }

    let response;
    response = await this.query("SELECT * FROM pg_catalog.pg_tables WHERE schemaname = 'public'");

    if (!Array.isArray(response.rows) || response.rows.length === 0) {
      throw new Error("Response was not a valid array or was empty.");
    }

    return response.rows.map(row => row.tablename)
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
  }

  async loadTables () {
    const tables = await this._getTables();
    const attributes = await this.getAttributes(tables);

    return attributes;
  }

  async query (query) {
    const client = createDbClient(database);
    client.connect();
    client.query(query, err => {
      if (err) return new Error(err);
    })
    .then(result => {
      client.end();
      return result;
    })
  }
}

module.exports = Database;
