import { Request, Response } from "express";
import userModel from "../models/User";

export const GetUserData = async (req: Request, res: Response) => {
  const { uId } = req.query;
  try {
    const user = await userModel.findOne({ uId });
    if (!user) {
      res.status(422).send("Invalid credentials");
      return;
    }
    res.status(200).json({ user: user })
  } catch (error) {
    res.status(501).send("Internal server error");
  }
}
