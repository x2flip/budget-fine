import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface NextCheckProps {
    title: string;
}
export const NextCheck = ({ title }: NextCheckProps) => {
    const [date, setDate] = useState(new Date());
    return (
        <div className="text-sm">
            <label>Next Check for {title}</label>
            <DatePicker
                selected={date}
                onChange={(date: Date) => setDate(date)}
            />
        </div>
    );
};
