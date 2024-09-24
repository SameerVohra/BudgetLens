import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

interface DecodedUser extends JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedUser;
    }
  }
}

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  
  if (!token) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as DecodedUser;
    console.log(decoded)
    if (!decoded || !decoded.userId) {
      return res.status(400).send("Invalid token payload.");
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send("Token expired. Please login again.");
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).send("Invalid token.");
    } else {
      console.error("Token verification error:", error);
      return res.status(500).send("Internal Server Error");
    }
  }
};

export default verifyToken;
