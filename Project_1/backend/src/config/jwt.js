import jwt from "jsonwebtoken";

const jwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET,
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || "15m",
  refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || "7d",
};

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, jwtConfig.accessTokenSecret, {
    expiresIn: jwtConfig.accessTokenExpiry,
    issuer: "request-api-server",
    audience: "request-api-users",
  });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshTokenSecret, {
    expiresIn: jwtConfig.refreshTokenExpiry,
    issuer: "request-api-server",
    audience: "request-api-users",
  });
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.accessTokenSecret, {
      issuer: "request-api-server",
      audience: "request-api-users",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") throw new Error("Access token expired");
    if (error.name === "JsonWebTokenError") throw new Error("Invalid access token");
    throw error;
  }
};

export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.refreshTokenSecret, {
      issuer: "request-api-server",
      audience: "request-api-users",
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") throw new Error("Refresh token expired");
    if (error.name === "JsonWebTokenError") throw new Error("Invalid refresh token");
    throw error;
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};

export const generateTokenPair = (payload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  generateTokenPair,
};