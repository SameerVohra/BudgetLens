import { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import dayjs from 'dayjs';

interface MonthlyI {
  onYearChange: (date: Dayjs | null) => void;
}

function MonthlyExpenses({ onYearChange }: MonthlyI) {
  const currentYear = new Date().getFullYear();
  const maxDate = dayjs().year(currentYear);

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <YearCalendar maxDate={maxDate} yearsOrder="desc" onChange={onYearChange} />
      </LocalizationProvider>
    </>
  );
}

export default MonthlyExpenses;
