import { useState } from "react";
import axios from "axios";
import link from "../assets/link.json";

function AddExpense() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const uId = localStorage.getItem("uId");

  const [type, setType] = useState<string>(""); 
  const [amount, setAmount] = useState<number | undefined>();
  const [description, setDescription] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Add loading state

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token: string | null = localStorage.getItem("token");
    
    if (type === "") {
      setErr("Please select an expense type");
      return;
    }
    
    try {
      setLoading(true); // Start loading
      const res = await axios.post(
        `${link.url}/add-expense`,
        {
          uId,
          type,
          amount,
          description,
          paymentMethod,
          month,
          year,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        setType("");
        setAmount(undefined);
        setDescription("");
        setPaymentMethod("");
        window.location.reload();
      }
      console.log(res);
    } catch (error) {
      console.error("Error adding expense:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Add New Expense
        </h2>

        {err && <p className="text-red-500 text-center mb-4">{err}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Expense Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expense Type
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="FIXED"
                  checked={type === "FIXED"}
                  onChange={(e) => setType(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Fixed</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="SAVINGS/INVESTMENTS"
                  checked={type === "SAVINGS/INVESTMENTS"}
                  onChange={(e) => setType(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Savings/Investments</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="DEBT REPAYMENTS"
                  checked={type === "DEBT REPAYMENTS"}
                  onChange={(e) => setType(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Debt Repayments</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="TAXES"
                  checked={type === "TAXES"}
                  onChange={(e) => setType(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Taxes</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="ONE TIME EXPENSES"
                  checked={type === "ONE TIME EXPENSES"}
                  onChange={(e) => setType(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">One-Time Expenses</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="MISCELLANEOUS"
                  checked={type === "MISCELLANEOUS"}
                  onChange={(e) => setType(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Miscellaneous</span>
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount || ""}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <input
              type="text"
              placeholder="Enter payment method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.currentTarget.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button or Loader */}
          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Expense
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpense;
