import dayjs from "dayjs";

interface ExpenseI {
  expenses: {
    amount: string;
    date: Date;
    description: string;
    payment_method: string;
    type: string;
  }[];
}

function ExpenseCard({ expenses }: ExpenseI) {
  return (
    <div className="flex flex-wrap justify-center gap-6 p-4">
      {expenses.map((e, ind) => (
        <div
          key={ind}
          className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-6 w-full sm:w-80 lg:w-96 flex flex-col space-y-4 hover:bg-gray-50"
        >
          {/* Type and Date */}
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-gray-800 break-words break-all">{e.type}</div>
            <div className="text-sm text-gray-500">
              {dayjs(e.date).format("DD/MM/YYYY")}
            </div>
          </div>

          {/* Description */}
          <div className="text-gray-700 text-base break-words break-all">{e.description}</div>

          {/* Payment Method and Amount */}
          <div className="flex justify-between items-center text-gray-800">
            <div className="text-sm font-semibold">{e.payment_method}</div>
            <div className="text-lg font-bold text-green-600">{e.amount}</div>
          </div>

          {/* Border and Hover Effect */}
          <div className="border-t mt-4 pt-4 border-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseCard;
