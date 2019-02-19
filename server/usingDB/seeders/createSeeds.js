import Helper from '../utils/Helper';

const hashed = Helper.hashPassword('vvvvvv');

const createUser = `
    INSERT INTO users(firstname,
      lastname,
      othernames,
      email,
      phonenumber,
      password,
      username)
    VALUES('Viola',
      'Violin',
      'Violet',
      'viola1@gmail.com',
      '09022334455',
      '${hashed}',
      'viola1')
    RETURNING *;`;

const createAdmin = `
    INSERT INTO users(firstname,
      lastname,
      othernames,
      email,
      phonenumber,
      password,
      username,
      isAdmin)
    VALUES('Victoria',
      'Victor',
      'Vincent',
      'victoria1@gmail.com',
      '08022334455',
      '${hashed}',
      'admin',
      'true')
    RETURNING *;`;

const createIncident = `
    INSERT INTO incidents(createdby,
      type,
      comment,
      location)
    VALUES('1',
      'red-flag',
      'SARS corruption',
      '33.455, 44.566')
`;

const createSeedsQuery = `${createUser}${createAdmin}${createIncident}`;

export default createSeedsQuery;
