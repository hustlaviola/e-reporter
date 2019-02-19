const dropUsersTable = 'DROP TABLE IF EXISTS users CASCADE; ';
const dropIncidentsTable = 'DROP TABLE IF EXISTS incidents CASCADE; ';

const dropTablesQuery = `${dropUsersTable}${dropIncidentsTable}`;

export default dropTablesQuery;
