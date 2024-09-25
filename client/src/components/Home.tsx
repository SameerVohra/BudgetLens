import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import link from "../assets/link.json";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Pie } from "react-chartjs-2";
import AddExpense from "./AddExpense";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseI {
  type: string;
  amount: number;
  description?: string;
  paymentMethod?: string;
  month: number;
  year: number;
}

function Home() {
  const { uId } = useParams();
  const [filterType, setFilterType] = useState<string>("currentMonth");
  const [expenses, setExpenses] = useState<ExpenseI[]>([]);
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [showAddExpense, setShowAddExpense] = useState<boolean>(false); // State to toggle AddExpense visibility

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${link.url}/get-expense?uId=${uId}&filterType=${filterType}&start=${start}&end=${end}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setExpenses(res.data[0].expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchData();
  }, [filterType, uId, start, end]);

  // Grouping expenses by type for Pie Chart
  const expenseTypes = expenses.reduce((acc: any, exp: ExpenseI) => {
    acc[exp.type] = (acc[exp.type] || 0) + exp.amount;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(expenseTypes),
    datasets: [
      {
        label: "Expense Breakdown",
        data: Object.values(expenseTypes),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-8">BUDGET LENS</h1>

        {/* Toggle button to show AddExpense card */}
        <div className="flex justify-center mb-6">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowAddExpense(!showAddExpense)}
          >
            {showAddExpense ? "Hide Add Expense" : "Add New Expense"}
          </Button>
        </div>

        {/* AddExpense component as a card, visible only when showAddExpense is true */}
        {showAddExpense && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-10">
            <h2 className="text-xl font-bold mb-4">Add New Expense</h2>
            <AddExpense />
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Filter Expenses</h2>
          <FormControl component="fieldset">
            <FormLabel component="legend" className="text-gray-700 mb-2">
              Get Expenses For
            </FormLabel>
            <RadioGroup
              row
              aria-label="filterType"
              name="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.currentTarget.value)}
              className="mb-4"
            >
              <FormControlLabel
                value="currentMonth"
                control={<Radio />}
                label="Current Month"
              />
              <FormControlLabel
                value="lastMonth"
                control={<Radio />}
                label="Last Month"
              />
              <FormControlLabel
                value="lastSixMonths"
                control={<Radio />}
                label="Last 6 Months"
              />
              <FormControlLabel
                value="customRange"
                control={<Radio />}
                label="Custom Range"
              />
            </RadioGroup>

            {filterType === "customRange" && (
              <div className="flex space-x-4">
                <TextField
                  id="start-date"
                  label="Start Date"
                  variant="filled"
                  placeholder="YYYY-MM-DD"
                  value={start}
                  onChange={(e) => setStart(e.currentTarget.value)}
                  className="w-full"
                />
                <TextField
                  id="end-date"
                  label="End Date"
                  variant="filled"
                  placeholder="YYYY-MM-DD"
                  value={end}
                  onChange={(e) => setEnd(e.currentTarget.value)}
                  className="w-full"
                />
              </div>
            )}
          </FormControl>
        </div>

        {/* Pie Chart for expense breakdown */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-10">
          <h2 className="text-xl font-bold mb-6">Expense Breakdown</h2>
          {Object.keys(expenseTypes).length > 0 ? (
            <div className="flex justify-center">
              <div className="w-1/2">
                <Pie data={data} />
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No expenses available.</p>
          )}
        </div>

        {/* List of Expenses */}
        <div className="bg-white shadow-md rounded-lg p-6 mt-10">
          <h2 className="text-xl font-bold mb-4">Expenses List</h2>
          {expenses && expenses.length > 0 ? (
            expenses.map((exp, index) => (
              <div key={index} className="border-b border-gray-200 py-4">
                <h3 className="text-lg font-medium text-gray-800">
                  {exp.description || "No Description"}
                </h3>
                <p className="text-gray-600">Amount: ₹{exp.amount}</p>
                <p className="text-gray-600">Type: {exp.type}</p>
                <p className="text-gray-600">{exp.month}/{exp.year}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No expenses found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
