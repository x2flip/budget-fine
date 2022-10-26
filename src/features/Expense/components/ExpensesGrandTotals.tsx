import { Expense, Income } from '@prisma/client';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { BudgetHeaderData } from '../../../pages';

interface IProps {
    expenses: Expense[];
    setBudgetHeaderData: Dispatch<SetStateAction<BudgetHeaderData>>;
}

interface MonthlyExpensesCalculated {
    avgExpenses: number;
    minExpenses: number;
    maxExpenses: number;
}

function calculateMonthlyExpenses<MonthlyExpensesCalculated>(
    expenses: Expense[]
) {
    let avgExpenses = 0;
    let minExpenses = 0;
    let maxExpenses = 0;
    for (let i = 0; i < expenses.length; i++) {
        if (expenses[i]) {
            if (expenses[i]?.frequency === 'Monthly') {
                avgExpenses += expenses[i]!.amount;
                minExpenses += expenses[i]!.amount;
                maxExpenses += expenses[i]!.amount;
            }
            if (expenses[i]?.frequency === 'Weekly') {
                avgExpenses += (expenses[i]!.amount * 52) / 12;
                minExpenses += expenses[i]!.amount * 4;
                maxExpenses += expenses[i]!.amount * 5;
            }
            if (expenses[i]?.frequency === 'Daily') {
                avgExpenses += (expenses[i]!.amount * 365) / 12;
                minExpenses += expenses[i]!.amount * 28;
                maxExpenses += expenses[i]!.amount * 31;
            }
        }
    }
    return { avgExpenses, minExpenses, maxExpenses };
}

export const ExpensesGrandTotals = ({
    expenses,
    setBudgetHeaderData,
}: IProps) => {
    const monthlyExpenses: MonthlyExpensesCalculated =
        calculateMonthlyExpenses(expenses);

    useEffect(() => {
        setBudgetHeaderData((prev) => {
            return {
                ...prev,
                minExpense: monthlyExpenses.minExpenses,
                maxExpense: monthlyExpenses.maxExpenses,
                avgExpense: monthlyExpenses.avgExpenses,
            };
        });
    }, [expenses]);

    return (
        <div>
            <h1>Expenses</h1>
            <h2>Min. ${monthlyExpenses.minExpenses.toFixed(2)}</h2>
            <h2>Max. ${monthlyExpenses.maxExpenses.toFixed(2)}</h2>
            <h2>Avg. ${monthlyExpenses.avgExpenses.toFixed(2)}</h2>
        </div>
    );
};
