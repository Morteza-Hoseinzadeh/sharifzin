// utils/tokenGenerator.js
const jwt = require('jsonwebtoken');

function generateTokens(user) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  // Access token payload (short-lived, 15 minutes)
  const accessTokenPayload = {
    id: user.user_id,
    phone: user.phone,
    role: user.role,
    type: 'access',
  };

  // Refresh token payload (long-lived, 30 days)
  const refreshTokenPayload = {
    id: user.user_id,
    type: 'refresh',
  };

  // Generate tokens
  const accessToken = jwt.sign(
    accessTokenPayload,
    JWT_SECRET,
    { expiresIn: '30d' } // Access token expires in 15 minutes
  );

  const refreshToken = jwt.sign(
    refreshTokenPayload,
    JWT_REFRESH_SECRET,
    { expiresIn: '30d' } // Refresh token expires in 30 days
  );

  return { accessToken, refreshToken };
}

module.exports = { generateTokens };
