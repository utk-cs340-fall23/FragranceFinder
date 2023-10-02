const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const expiration = '2h';

module.exports = {
  authMiddleware: function(req, res, next) {

    // Allows token to be sent via req.body, req.query, or headers
    let token = req.headers.authorization || req.body.token || req.query.token;

    if (token) {
      token = token.replace('Bearer ', '');
    }

    // Try to decode the token. If it throws an error, that means
    // token is invalid, in which case we return a 401 (Unauthorized)
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
      next();
    } catch {
      res.status(401).send('Bad Token');
    }
  },

  // Create a JWT with the user information
  signToken: function({ username, email, id }) {
    const payload = { username, email, id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
};
