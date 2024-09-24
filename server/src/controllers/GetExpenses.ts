import userModel from "../models/UserModel";
import { Request, Response } from "express";

const getMonthStartEnd = (month: number, year: number) => {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);
  return { startDate, endDate };
};

const GetExpenses = async(req: Request, res: Response) => {
  const { uId, filterType, start, end } = req.query;
  try {
    console.log(uId, start, end);
    const user = await userModel.findOne({ uId: uId });
    if (!user) {
      return res.status(404).send("No such user");
    }

    let Start: Date = new Date();
    let End: Date = new Date();
    const now = new Date();

    switch (filterType) {
      case "currentMonth": 
        const currentMonthData = getMonthStartEnd(now.getMonth() + 1, now.getFullYear());
        Start = currentMonthData.startDate;
        End = currentMonthData.endDate;
        break;

      case "lastMonth": 
        const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
        const lastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        const lastMonthData = getMonthStartEnd(lastMonth, lastYear);
        Start = lastMonthData.startDate;
        End = lastMonthData.endDate;
        break;

      case "lastSixMonths":
        Start = new Date(now.setMonth(now.getMonth() - 6));
        End = new Date();
        break;

      case "customRange": 
        if (start && end) {
          Start = new Date(start as string);
          End = new Date(end as string);
        } else {
          return res.status(400).send("Invalid date range");
        }
        break;

      default:
        return res.status(400).send("Invalid filter type");
    }

    const expenses = await userModel.aggregate([
      { $match: { uId } },
      { $unwind: "$expenses" },
      { $match: { "expenses.date": { $gte: Start, $lte: End } } },
      {
        $group: {
          _id: "$uId",
          expenses: { $push: "$expenses" },
        },
      },
    ]);

    if (!expenses.length) {
      return res.status(404).send("No expenses found for the specified range");
    }

    res.status(200).json(expenses);

  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

export default GetExpenses;
