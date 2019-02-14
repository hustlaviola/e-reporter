import pool from './database';
import createQuery from './createTables';
import dropQuery from './dropTables';

const queries = `${dropQuery}${createQuery}`;

pool.query(queries)
  .then((res) => {
    console.log(res);
    pool.end();
  })
  .catch((err) => {
    console.log(err);
    pool.end();
  });
