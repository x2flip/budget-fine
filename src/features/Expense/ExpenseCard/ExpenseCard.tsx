import { PencilIcon } from '@heroicons/react/24/solid';
import { Expense, Income } from '@prisma/client';
import { format } from 'date-fns';
import { useState } from 'react';
import { EditExpenseDialog } from '../EditExpenseDialog/EditExpenseDialog';

interface ExpenseCardProps {
    expense: Expense;
}
export const ExpenseCard = ({ expense }: ExpenseCardProps) => {
    const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);
    const handleEditExpense = () => setIsEditExpenseModalOpen(true);
    const { title, amount, frequency, dayOfMonth, dayOfWeek } = expense;
    return (
        <div className="bg-slate-100 dark:bg-slate-800 flex rounded-md">
            <div className="flex-grow px-4 py-4">
                <div className="flex">
                    <span className="text-gray-800 dark:text-slate-200 flex-grow font-bold text-lg mr-4">
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
                </div>
                {/* {nextPaycheck && (
                    <span className="text-sm font-semibold">
                        Paydate: {format(nextPaycheck, 'MM/dd')}
                    </span>
                )} */}
            </div>
            <button
                onClick={handleEditExpense}
                className="self-center bg-slate-700 h-full px-2 rounded-r-md hover:bg-slate-600 duration-300"
            >
                <PencilIcon className="text-slate-300 h-4" />
            </button>
        </div>
    );
};
