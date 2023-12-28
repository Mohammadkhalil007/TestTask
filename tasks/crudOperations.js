const { Client } = require('pg');
const { user, host, database, port,password } = require('../../../config/config');


let client; 
/*********************************************** DB-connection ***********************************************/
async function dbConnections() {
  try {
    client = new Client({
      user: user,
      host: host,
      database: database,
      password:password ,
      port: port,
    });
    await client.connect();

    console.log("Postgres Is Connected With Event Logs!");
  } catch (error) {
    console.error(error);
  }
  
}

async function insertIntoDB(name, email,token) {
  try {
    const existingUser = await client.query('SELECT * FROM "user" WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return { error: 'EMAIL_EXISTS', message: 'User with this email already exists' };
    }
    await client.query('BEGIN');
    const query = {
      text: 'INSERT INTO "user" (name, email,token) VALUES ($1, $2,$3) RETURNING *',
      values: [name, email,token],
    };
    const result = await client.query(query);
    await client.query('COMMIT');
    console.log('User inserted successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error executing query:', error);
    throw error;
  }
}

async function getAllUsers() {
  try {
    const result = await client.query('SELECT * FROM "user"');
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const result = await client.query('SELECT * FROM "user" WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

async function updateUser(userId, name, newEmail, oldEmail) {
  try {
    const checkEmail = await client.query('SELECT * FROM "user" WHERE id = $1 AND email = $2', [userId, oldEmail]);
    if (checkEmail.rows.length === 0) {
      return null;
    }

    const result = await client.query('UPDATE "user" SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, newEmail, userId]);

    if (result.rows.length === 0) {
      return null;
    }

    console.log('User updated successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}


async function deleteUser(userId) {
  try {
    const result = await client.query('DELETE FROM "user" WHERE id = $1 RETURNING *', [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    console.log('User deleted successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}


module.exports = {
  dbConnections,
  insertIntoDB,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};



