const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const expiration = '2h';

function getTokenFromRequest(req) {
  // Allows token to be sent via req.body, req.query, or headers
  let token = req.headers.authorization || req.body?.token || req.query?.token;

  if (token) {
    return token.replace('Bearer ', '');
  }

  return null;
}

function decodeToken(token) {
  try {
    const { data } = jwt.verify(token, secret);
    return data;

  } catch {
    return null;
  }
}

module.exports = {
  authMiddleware: function(req, res, next) {

    const token = getTokenFromRequest(req);

    // Try to decode the token. If it throws an error, that means
    // token is invalid, in which case we return a 401 (Unauthorized)
    const data = decodeToken(token);
    if (data) {
      req.user = data;
      next();
    }
    else {
      res.status(401).send('Bad Token');
    }
  },

  attachUserMiddleware: function(req, res, next) {
    const token = getTokenFromRequest(req);
    req.user = decodeToken(token);
    next();
  },

  // Create a JWT with the user information
  signToken: function({ username, email, id, firstName, lastName}) {
    const payload = { username, email, id, firstName, lastName };
    return jwt.sign({ data: payload }, secret);
  },

  validateToken: function(req) {
    const token = getTokenFromRequest(req);
    return !!decodeToken(token);

  }
};
