import pool from '../model/database';
import createSeedsQuery from './createSeeds';
import dropTablesQuery from '../model/dropTables';
import createTablesQuery from '../model/createTables';

const queries = `${dropTablesQuery}${createTablesQuery}${createSeedsQuery}`;

pool.query(queries, () => {
  pool.end();
});
