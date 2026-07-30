// utils/getUsersInfo.js  (or wherever you keep it)
const { query } = require('./dbQuery');

const getUsersInfoQuery = async (key, value) => {
  try {
    // Whitelist allowed keys to prevent injection (very important!)
    const allowedKeys = ['phone', 'id', 'national_code'];
    if (!allowedKeys.includes(key)) {
      throw new Error('Invalid search key');
    }

    const queryString = `SELECT * FROM \`sharifzin\`.users WHERE ${key} = ? LIMIT 1`;
    const result = await query(queryString, [value]);

    // Assuming your query() returns [rows] or { rows, ... }
    const rows = Array.isArray(result) ? result[0] : result?.rows || result || [];

    if (!rows || rows.length === 0) {
      return null; // no user found
    }

    return rows; // return the first (and only) user object
  } catch (error) {
    console.error('getUsersInfoQuery error:', error.message);
    return null; // or throw error if you prefer
  }
};

module.exports = { getUsersInfoQuery };
