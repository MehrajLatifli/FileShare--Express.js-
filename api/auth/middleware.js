import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

const { TOKEN_SECRET } = process.env;

export const authChecker = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(403).send("Token not found");
  }

  try {
    const token = header.split(" ")[1];

    req.user = verifyToken(token);
    next();
  } catch (error) {
    res.status(403).send("Error");
  }
};

export function verifyToken(token) {
  return jwt.verify(token, TOKEN_SECRET);
}
