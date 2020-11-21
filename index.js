import pg from 'pg';

const { Client } = pg;

// set the way we will connect to the server
const pgConnectionConfigs = {
  user: 'veenas',
  host: 'localhost',
  database: 'samples_ra',

  port: 5432, // Postgres server always runs on this port
};

const TABLE_NAME = 'meal_tracker';
const COL_ID = 'id';
const COL_TYPE = 'type';
const COL_DESC = 'description';
const COL_AMT_ALCOHOL = 'amount_of_alcohol';
const COL_IS_HUNGRY = 'was_hungry_before_eating';

// create the var we'll use
const client = new Client(pgConnectionConfigs);

// make the connection to the server
client.connect();

// create the query done callback
const whenQueryDone = (error, result) => {
  // this error is anything that goes wrong with the query
  if (error) {
    console.log('error', error);
  } else {
    // rows key has the data
    console.log(result.rows);
  }

  // close the connection
  client.end();
};

const createTable = () => {
  const createTableQuery = `CREATE TABLE ${TABLE_NAME} ( ${COL_ID} SERIAL PRIMARY KEY, ${COL_TYPE} TEXT, ${COL_DESC} TEXT, ${COL_AMT_ALCOHOL} INTEGER, ${COL_IS_HUNGRY} BOOLEAN);`;
  client.query(createTableQuery, whenQueryDone);
};

createTable();
