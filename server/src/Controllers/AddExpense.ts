import { Request, Response } from "express";
import userModel from "../models/User";

export const AddExpense = async (req: Request, res: Response) => {
  const { date, amount, type, payment_method, description, uId } = req.body;
  try {
    const user = await userModel.findOne({ uId });

    if (!user) {
      res.status(422).send("Invalid Email Id");
      return;
    }

    user.expenses.push({ date, amount, type, payment_method, description });
    await user.save();
    res.status(201).send("Expense Added Successfully");
  } catch (error) {
    console.log(error)
    res.status(501).send("Internal Server Error");
  }
}
