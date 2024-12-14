import { FormEvent, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import ErrorPopup from './ErrorPopup';
import SuccessPopup from './SuccessPopup';

interface AddI {
  id: string | null;
  onExpenseAdd: () => void;
}

function AddExpense({ id, onExpenseAdd }: AddI) {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string | undefined>();
  const [type, setType] = useState<string>(""); // fixed, variable, savings/investment, repayments, miscellanious
  const [payment_method, setPayment_method] = useState(""); // credit card, debit card, cheque, online, bank transfer, cash
  const [err, setErr] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>("");

  const url = import.meta.env.VITE_URL;

  const onDateChange = (newDate: Dayjs | null) => {
    setDate(newDate?.toISOString());
    console.log(newDate?.toISOString());
  };

  const handleAdd = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (amount === "" || description === "" || date === undefined || type === "" || payment_method === "") {
      setErr("All fields are required");
      setShowPopup(true);
      return;
    }
    try {
      const token: string | null = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/add-expense`,
        { date, amount: parseInt(amount), type, payment_method, description, uId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 201) {
        setShowPopup(true);
        setSuccess("Expense Added Successfully");
        onExpenseAdd();
        setAmount("");
        setDescription("");
        setDate(undefined);
        setType("");
        setPayment_method("");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErr(error.response?.data);
      }
    }
  };

  if (showPopup) {
    setTimeout(() => {
      setShowPopup(false);
      setErr("");
    }, 8000);
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Add New Expense</h2>
      {err && showPopup && <ErrorPopup error={err} />}
      {success && showPopup && <SuccessPopup msg={success} />}
      <form onSubmit={handleAdd} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            value={amount}
            type="text"
            onChange={(e) => setAmount(e.currentTarget.value)}
            placeholder="Enter Amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            placeholder="Enter Description"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={type}
            onChange={(e) => setType(e.currentTarget.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Type
            </option>
            <option value="Fixed">Fixed</option>
            <option value="Variable">Variable</option>
            <option value="Savings/Investments">Savings/Investments</option>
            <option value="Repayments">Repayments</option>
            <option value="Miscellanious">Miscellaneous</option>
          </select>

          <select
            value={payment_method}
            onChange={(e) => setPayment_method(e.currentTarget.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Select Payment Method
            </option>
            <option value="Credit card">Credit Card</option>
            <option value="Debit card">Debit Card</option>
            <option value="Cheque">Cheque</option>
            <option value="Online">Online</option>
            <option value="Bank transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
          </select>
        </div>


        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex justify-center">
            <DateCalendar
              defaultValue={dayjs()}
              views={['year', 'month', 'day']}
              onChange={onDateChange}
              className="rounded-lg shadow-md w-full max-w-sm border border-gray-300"
            />
          </div>
        </LocalizationProvider>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}

export default AddExpense;
