import { Request, Response } from "express";
import userModel from "../models/User";

export const GetExpense = async (req: Request, res: Response) => {
  const { email } = req.query;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      res.status(422).send("Invalid Credentials");
      return;
    }
    res.status(200).json({ expenses: user.expenses, message: "Expenses Fetched Successfully" });
  } catch (error) {
    res.status(501).send("Internal Server Error");
  }
};
