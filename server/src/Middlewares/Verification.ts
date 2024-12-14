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

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).send("Access Denied. No token provided.");
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY as string) as JwtPayload;

    if (typeof decoded !== "object" || !decoded || !decoded["uId"]) {
      res.status(400).send("Invalid token payload.");
      return;
    }

    req.user = { id: decoded["id"] as string } as DecodedUser;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).send("Token expired. Please login again.");
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(400).send("Invalid token.");
    } else {
      console.error("Token verification error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
};

export default verifyToken;
