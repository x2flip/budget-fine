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
        <div className="bg-slate-100 dark:bg-slate-800 flex rounded-md">
            <div className="flex-grow px-4 py-4">
                <div className="flex">
                    <span className="text-gray-800 dark:text-slate-200 flex-grow font-bold text-lg mr-4">
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
                </div>
                {nextPaycheck && (
                    <span className="text-sm font-semibold">
                        Paydate: {format(nextPaycheck, 'MM/dd')}
                    </span>
                )}
            </div>
            <button
                onClick={handleEditIncome}
                className="self-center bg-slate-700 h-full px-2 rounded-r-md hover:bg-slate-600 duration-300"
            >
                <PencilIcon className="text-slate-300 h-4" />
            </button>
        </div>
    );
};
