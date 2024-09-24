import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import link from "../assets/link.json";

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

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    const fetchData = async () => {
      try {
        const res = await axios.get(`${link.url}/get-expense?uId=${uId}&filterType=${filterType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExpenses(res.data[0].expenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchData();
  }, [filterType, uId]);

  return (
    <>
      <h1>Expenses for User ID: {uId}</h1>
      {expenses && expenses.length > 0 ? (
        expenses.map((exp, index) => (
          <div key={index}>
            <h2>{exp.description || ""}</h2>
            <p>Amount: {exp.amount}</p>
          </div>
        ))
      ) : (
        <p>No expenses found.</p>
      )}
    </>
  );
}

export default Home;
