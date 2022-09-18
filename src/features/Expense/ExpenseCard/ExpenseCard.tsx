import { PencilIcon } from '@heroicons/react/24/solid';
import { Expense, Income } from '@prisma/client';
import { format } from 'date-fns';
import { useState } from 'react';
import { EditIncomeDialog } from '../../EditIncomes';
import { EditExpenseDialog } from '../EditExpenseDialog/EditExpenseDialog';

interface ExpenseCardProps {
    expense: Expense;
}
export const ExpenseCard = ({ expense }: ExpenseCardProps) => {
    const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);
    const handleEditExpense = () => setIsEditExpenseModalOpen(true);
    const { title, amount, frequency, dayOfMonth, dayOfWeek } = expense;
    return (
        <div className="bg-slate-100 dark:bg-slate-800 flex py-4 px-10 rounded-md">
            <span className="text-gray-800 dark:text-slate-200 flex-grow font-semibold mr-4">
                {title}
            </span>
            <span className="text-red-700 dark:text-red-300 font-bold">
                {amount}
            </span>
            <EditExpenseDialog
                expense={expense}
                isOpen={isEditExpenseModalOpen}
                setIsOpen={setIsEditExpenseModalOpen}
            />
            <button
                onClick={handleEditExpense}
                className="bg-slate-300 p-1 rounded ml-4 hover:bg-slate-200"
            >
                <PencilIcon className="text-gray-500 h-4" />
            </button>
        </div>
    );
};
