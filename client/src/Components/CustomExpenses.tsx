import dayjs, { Dayjs } from 'dayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface customI {
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

function CustomExpenses({ onStartDateChange, onEndDateChange }: customI) {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-lg flex flex-col sm:flex-row sm:justify-between gap-6 sm:gap-12 ">
      {/* Start Date Section */}
      <div className="w-full sm:w-1/2 overflow-hidden">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center sm:text-left">
          Start Date
        </h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex justify-center">
            <DateCalendar
              defaultValue={dayjs()}
              views={['year', 'month', 'day']}
              onChange={onStartDateChange}
              className="rounded-lg shadow-md w-full max-w-sm border border-gray-300"
            />
          </div>
        </LocalizationProvider>
      </div>

      {/* End Date Section */}
      <div className="w-full sm:w-1/2 overflow-hidden">
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center sm:text-left">
          End Date
        </h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex justify-center">
            <DateCalendar
              defaultValue={dayjs()}
              views={['year', 'month', 'day']}
              onChange={onEndDateChange}
              className="rounded-lg shadow-md w-full max-w-sm border border-gray-300"
            />
          </div>
        </LocalizationProvider>
      </div>
    </div>
  );
}

export default CustomExpenses;
