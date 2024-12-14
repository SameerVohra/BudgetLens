import { Request, Response } from "express"
import userModel from "../models/User";
import dayjs from "dayjs";
interface Expense {
  amount: number;
  date: Date;
  description: string;
  payment_method: string;
  type: string;
}

export const GetMonthlyExpense = async (req: Request, res: Response) => {
  const { uId, year } = req.query;
  if (!year) {
    res.status(422).send("Give the year value");
    return;
  }
  try {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);

    const expenses = await userModel.aggregate([
      { $match: { uId } },
      { $unwind: "$expenses" },
      {
        $match:
        {
          "expenses.date": {
            $gte: new Date(start.toISOString()),
            $lte: new Date(end.toISOString())
          }
        }
      }
    ])
    const groupedExpenses: { [key: string]: Expense[] } = {};
    expenses.forEach((exp) => {
      const month = dayjs(exp.expenses.date).format('MMMM');
      if (!groupedExpenses[month]) {
        groupedExpenses[month] = [];
      }
      groupedExpenses[month].push(exp.expenses);
    })
    res.status(200).send(groupedExpenses);
  } catch (error) {
    res.status(201).send("Internal Server Error");
  }
}
