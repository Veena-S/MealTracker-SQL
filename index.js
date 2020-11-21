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
  client.end();
};

const displayData = (error, queryResult) => {
  // this error is anything that goes wrong with the query
  if (error) {
    console.log('error', error);
  } else {
    // queryResult.row is an object
    console.log(queryResult.rows.length);
    const returnRows = [...queryResult.rows];
    console.log(returnRows);
    // rows key has the data
    returnRows.forEach((row) => {
      let rowInfo = '';
      Object.values(row).forEach((col) => {
        rowInfo += `${col} - `;
      });
      console.log(rowInfo);
    });
  }
  client.end();
};

const createTable = () => {
  const createTableQuery = `CREATE TABLE ${TABLE_NAME} ( ${COL_ID} SERIAL PRIMARY KEY, ${COL_TYPE} TEXT, ${COL_DESC} TEXT, ${COL_AMT_ALCOHOL} INTEGER, ${COL_IS_HUNGRY} BOOLEAN);`;
  client.query(createTableQuery, whenQueryDone);
};

const insertData = () => {
  const insertQuery = `INSERT INTO ${TABLE_NAME} (${COL_TYPE}, ${COL_DESC}, ${COL_AMT_ALCOHOL}, ${COL_IS_HUNGRY}) VALUES ($1, $2, $3, $4)`;
  const valueArray = [...process.argv.splice(3)];
  valueArray[3] = (valueArray[3] === 'true');
  console.log(valueArray);
  console.log(insertQuery);
  client.query(insertQuery, valueArray, whenQueryDone);
};

const reportData = () => {
  let selectQuery = `SELECT * FROM ${TABLE_NAME}`;
  // Check whether any conditions are given
  if (process.argv.length > 3)
  {
    const [colName, colValue] = [...process.argv.slice(3)];
    selectQuery += ` WHERE ${colName} = '${colValue}'`;
  }
  console.log(selectQuery);
  client.query(selectQuery, displayData);
};

const editData = () => {
  const [id, colName, colValue] = [...process.argv.slice(3)];
  const updateQuery = `UPDATE ${TABLE_NAME} SET ${colName} = '${colValue}' WHERE ${COL_ID} = ${id}`;
  client.query(updateQuery, whenQueryDone);
};

const inputCommand = process.argv[2];
if (inputCommand === 'log')
{
  insertData();
}
else if (inputCommand === 'report')
{
  reportData();
}
else if (inputCommand === 'edit')
{
  editData();
}
// createTable();

// close the connection
// client.end();
