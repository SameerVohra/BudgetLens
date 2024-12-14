import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import axios from 'axios';
import dayjs, { Dayjs } from "dayjs";
import ErrorPopup from './ErrorPopup';
import ExpenseCard from './ExpenseCard';
import CustomExpenses from './CustomExpenses';
import MonthlyExpenses from './MonthlyExpenses';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import AddExpense from './AddExpense';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ExpenseI {
  amount: string;
  date: Date;
  description: string;
  payment_method: string;
  type: string;
}
interface MonthlyExpenseI {
  [key: string]: ExpenseI[];
}

function Home() {
  const location = useLocation();
  const urlParam = new URLSearchParams(location.search);
  const id = urlParam.get("id");
  const [selectedStartDate, setSelectedStartDate] = useState<string | undefined>();
  const [selectedEndDate, setSelectedEndDate] = useState<string | undefined>();
  const [expenses, setExpenses] = useState<ExpenseI[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [err, setErr] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [getCustom, setGetCustom] = useState<boolean>(false);
  const [getMonthly, setGetMonthly] = useState<boolean>(false);
  const [year, setYear] = useState<string | undefined>();
  const [monthlyExpense, setMonthlyExpense] = useState<MonthlyExpenseI>({});
  const [addExp, setAddExp] = useState<boolean>(false);

  const url = import.meta.env.VITE_URL;

  const getData = async () => {
    try {
      const token: string | null = localStorage.getItem("token");
      const data = async () => {
        setExpenses([]);
        const res = await axios.get(`${url}/user-data?uId=${id}`, { headers: { Authorization: `Bearer ${token}` } });

        setExpenses(res.data.user.expenses);
      };
      data();

    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErr(error.response?.data);
      }
    }
  };

  useEffect(() => {
    getData();
  }, [id, url]);

  const handleGetCustomExpense = async () => {
    const token = localStorage.getItem("token");
    if (selectedStartDate === undefined || selectedEndDate === undefined) {
      setErr("Enter Start and End Date");
      setShowPopup(true);
      return;
    }
    if (selectedStartDate !== undefined && selectedEndDate !== undefined && selectedStartDate > selectedEndDate) {
      setErr("Start Date should be less than or equal to End Date!!");
      setShowPopup(true);
      return;
    }
    try {
      setShowPopup(false);
      setErr("");
      const response = await axios.get(
        `${url}/get-custom-expense?uId=${id}&start=${selectedStartDate}&end=${selectedEndDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenses([]);
      if (response.data.expenses.length > 0) {
        setExpenses(response.data.expenses);
      }
      else {
        setErr(`No expenses found from Date: ${selectedStartDate} to ${selectedEndDate}`);
        setShowPopup(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErr(error.response?.data);
        console.log(error);
      }
    }
  };

  const handleEndDate = (newDate: Dayjs | null) => {
    setSelectedEndDate(newDate?.toISOString());
  };

  const handleStartDate = (newDate: Dayjs | null) => {
    setSelectedStartDate(newDate?.toISOString());
  };

  const handleYearChange = (newDate: Dayjs | null) => {
    setYear(newDate?.year().toString());
  };

  const handleExpenseAdd = () => {
    getData();
    setAddExp(false);
  };

  useEffect(() => {
    let totalAmt = 0;
    expenses.map((e) => totalAmt += parseFloat(e.amount));
    setTotal(totalAmt);
  }, [expenses]);

  const handleMonthly = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${url}/get-monthly-expense?uId=${id}&year=${year}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = response.data;
    const groupedExpenses: MonthlyExpenseI = {};

    Object.keys(data).forEach((month) => {
      groupedExpenses[month] = data[month].map((expense: ExpenseI) => {
        return {
          ...expense,
          date: new Date(expense.date)
        };
      });
    });

    setMonthlyExpense(groupedExpenses);
  };

  setTimeout(() => {
    setShowPopup(false);
  }, 7000);

  const chartData = {
    labels: Object.keys(monthlyExpense),
    datasets: [
      {
        label: 'Monthly Expenses',
        data: Object.keys(monthlyExpense).map(month => {
          return monthlyExpense[month].reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <>
      <div className='m-4'>
        {err && showPopup && <ErrorPopup error={err} />}

        {/* Expense Cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-white w-full sm:w-1/3">
            <h3 className="text-xl font-semibold text-center">Total Expenses</h3>
            <p className="text-3xl mt-4 text-center">{total.toFixed(2)}</p>
          </div>
        </div>

        {/* Button to switch between Custom and Monthly Expenses */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            className='px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition duration-300 w-full sm:w-auto'
            onClick={() => {
              setAddExp(!addExp);
              setGetCustom(false);
              setGetMonthly(false);
            }}
          >
            Add Expense</button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 w-full sm:w-auto"
            onClick={() => {
              setGetCustom(!getCustom);
              setGetMonthly(false);
              setAddExp(false);
            }}
          >
            Get Custom Expenses
          </button>

          <button
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 w-full sm:w-auto"
            onClick={() => {
              setGetMonthly(!getMonthly);
              setGetCustom(false);
              setAddExp(false);
            }}
          >
            Get Monthly Expenses
          </button>
        </div>

        {addExp && <AddExpense id={id} onExpenseAdd={handleExpenseAdd} />}

        {/* Custom Expenses */}
        {getCustom && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-xl font-semibold text-center">{dayjs(selectedStartDate).format('DD-MM-YYYY')} to {dayjs(selectedEndDate).format('DD-MM-YYYY')}</div>
            <CustomExpenses onStartDateChange={handleStartDate} onEndDateChange={handleEndDate} />
            <button
              className="px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-300 mt-6"
              onClick={handleGetCustomExpense}
            >
              Get Custom Expense
            </button>
          </div>
        )}

        {/* Monthly Expenses */}
        {getMonthly && (
          <div className="flex flex-col items-center gap-6">
            <MonthlyExpenses onYearChange={handleYearChange} />
            <button
              className="px-8 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition duration-300 mt-6"
              onClick={handleMonthly}
            >
              Get Monthly Expenses
            </button>
          </div>
        )}

        {expenses.length > 0 && <ExpenseCard expenses={expenses} />}
        {year && <h2 className="text-5xl mt-2 text-center font-bold m-5">Year: {year}</h2>}

        {Object.keys(monthlyExpense).length > 0 && (
          <div className="mt-8">
            <div className="max-w-4xl mx-auto">
              <Bar data={chartData} />
            </div>
          </div>
        )}
      </div >
    </>
  );
}

export default Home;
