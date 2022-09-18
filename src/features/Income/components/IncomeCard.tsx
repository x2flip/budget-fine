import { PencilIcon } from '@heroicons/react/24/solid';
import { Income } from '@prisma/client';
import { format } from 'date-fns';
import { useState } from 'react';
import { EditIncomeDialog } from '../../EditIncomes';

interface IncomeCardProps {
    income: Income;
}
export const IncomeCard = ({ income }: IncomeCardProps) => {
    const [isEditIncomeModalOpen, setIsEditIncomeModalOpen] = useState(false);
    const handleEditIncome = () => setIsEditIncomeModalOpen(true);
    const { title, amount, payPeriod, nextPaycheck } = income;
    return (
        <div className="bg-slate-100 dark:bg-slate-800 flex py-4 px-10 rounded-md">
            <span className="text-gray-800 dark:text-slate-200 flex-grow font-semibold mr-4">
                {title}
            </span>
            <span className="text-green-700 dark:text-green-300 font-bold">
                {amount}
            </span>
            <EditIncomeDialog
                income={income}
                isOpen={isEditIncomeModalOpen}
                setIsOpen={setIsEditIncomeModalOpen}
            />
            {nextPaycheck && (
                <span className="ml-4">
                    Paydate: {format(nextPaycheck, 'MM/dd')}
                </span>
            )}
            <button
                onClick={handleEditIncome}
                className="bg-slate-300 p-1 rounded ml-4 hover:bg-slate-200"
            >
                <PencilIcon className="text-gray-500 h-4" />
            </button>
        </div>
    );
};
