import { Request, Response } from "express";
import userModel from "../models/User";
import dayjs from "dayjs";

export const GetCustomExpense = async (req: Request, res: Response) => {
  const { uId, start, end } = req.query;
  console.log(start, end)
  if (!start || !end) {
    res.status(400).send("Invalid start or end timestamp");
    return;
  }

  try {
    console.log("Start Date: ", start);
    console.log("End Date: ", end);
    const startDate = dayjs(start as string).startOf("day");
    const endDate = dayjs(end as string).endOf("day");

    const expense = await userModel.aggregate([
      { $match: { uId } },
      { $unwind: "$expenses" },
      {
        $match: {
          "expenses.date": {
            $gte: new Date(startDate.toISOString()),
            $lte: new Date(endDate.toISOString())
          }
        }
      }
    ]);

    if (expense.length === 0) {
      res.status(200).json({ message: "No expense found" });
      return;
    }
    const expenses = expense.map((e) => e.expenses);
    res.status(200).json({ message: "Expenses found", expenses });

  } catch (error) {
    console.error(error);
    res.status(501).send("Internal Server Error");
  }
}

