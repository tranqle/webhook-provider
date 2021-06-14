/* eslint-disable max-len */
/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import {Client} from 'pg'

export default class PostgresHook {
  constructor() {
    this._configs = {
      user: 'kobiton',
      host: 'localhost',
      database: 'kobiton',
      password: 'shh',
      port: 5432
    }
    
    this._client = new Client(this._configs)
  }

  insertHook(payload = {}) {
    const {url, tls, events} = payload
    this._client
      .connect()
      .then(() => console.log('connected'))
      .catch(err => console.error('connection error', err.stack))
    const query = `INSERT INTO public."Webhooks"("id", "url", "events", "tls", "createdAt", "updatedAt") 
        VALUES (nextval('Webhook_id_seq'), $1, $2, $3, now() AT TIME ZONE 'UTC',  now() AT TIME ZONE 'UTC');`
    
    this._client
      .query(query, [
        url,
        events,
        tls
      ])
      .then(result => console.log(result))
      .catch(e => console.error(e.stack))
      .then(() => this._client
        .end()
        .then(() => console.log('client has disconnected'))
        .catch(err => console.error('error during disconnection', err.stack)))
  }

  async findHook(payload, callback) {
    this._client
      .connect()
      .then(() => console.log('connected'))
      .catch(err => console.error('connection error', err.stack))
    
    const query = `SELECT * from 
      public."Webhooks" WHERE url=$1;`
    this._client
      .query(query, [
        payload.url
      ])
      .then((result) => {
        if (result.rowCount > 0) {
          console.log('------ found ----', result.rows)
          callback(result.rows)
        }
        else {
          callback([])
        }
      })
      .catch(e => console.error(e.stack))
      .then(() => this._client
        .end()
        .then(() => console.log('client has disconnected'))
        .catch(err => console.error('error during disconnection', err.stack)))
  }
}
