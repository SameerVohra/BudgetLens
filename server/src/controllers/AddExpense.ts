import { Request, Response } from "express";
import userModel from "../models/UserModel"; // Import the merged model

const AddExpense = async (req: Request, res: Response) => {
  const { uId, type, amount, description, paymentMethod, month, year } = req.body;
  console.log(uId);
  try {
    // Find the user by uId
    const user = await userModel.findOne({ uId:uId });
    if (!user) {
      return res.status(404).send("No such user");
    }

    // Create the new expense
    const newExpense = {
      date: new Date(),
      type,
      amount,
      description,
      paymentMethod,
      month, 
      year
    };

    // Add the new expense to the user's expenses array
    user.expenses.push(newExpense);

    // Save the updated user document with the new expense
    await user.save();

    // Respond with the updated user data
    res.status(201).send(user);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default AddExpense;
