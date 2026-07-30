// Helper function for database queries
const db = require('../models/dbConnection').promise();

const query = async (sql, params = []) => {
  try {
    const [results] = await db.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

module.exports = { query };
