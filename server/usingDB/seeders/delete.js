import pool from '../model/database';

const deleteUsers = 'DELETE FROM users;';
const deleteIncidents = 'DELETE FROM incidents;';

const deleteSeedsQuery = `${deleteUsers}${deleteIncidents}`;

// export default deleteSeedsQuery;

pool.query(deleteSeedsQuery, () => {
  pool.end();
});
