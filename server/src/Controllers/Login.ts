import { Request, Response } from "express";
import userModel from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const Login = async (req: Request, res: Response) => {
  const { email, pass } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(401).send("User does not exist");
      return;
    }
    const isPass = await bcrypt.compare(pass, user.pass);
    if (!isPass) {
      res.status(401).send("Invalid Credentials");
      return;
    }

    const tokenPayload = { email: email, uId: user.uId };

    const token: string = jwt.sign(
      tokenPayload,
      process.env.SECRET_KEY as string,
      { expiresIn: "24h" }
    )

    res.status(200).json({ uId: user.uId, token: token, message: "User LoggedIn Successfully" });
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
}
