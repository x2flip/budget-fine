import { Income } from '@prisma/client';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { BudgetHeaderData } from '../../../pages';

interface IProps {
    incomes: Income[];
    setBudgetHeaderData: Dispatch<SetStateAction<BudgetHeaderData>>;
}

function calculateIncomes(incomes: Income[]) {
    let min = 0;
    let max = 0;
    let avg = 0;
    for (let i = 0; i < incomes.length; i++) {
        min += incomes[i]!.amount * 2;
        max += incomes[i]!.amount * 3;
        avg += (incomes[i]!.amount * 26) / 12;
    }
    return { min, max, avg };
}

export const IncomeGrandTotals = ({ incomes, setBudgetHeaderData }: IProps) => {
    function calcBiweeklyIncome(incomes: Income[]) {
        return incomes.reduce((prev, current) => prev + current.amount, 0);
    }
    const biweeklyAmount = calculateIncomes(incomes);
    useEffect(() => {
        setBudgetHeaderData((prev) => {
            return {
                ...prev,
                minIncome: biweeklyAmount.min,
                maxIncome: biweeklyAmount.max,
                avgIncome: biweeklyAmount.avg,
            };
        });
    }, [incomes]);
    return (
        <div>
            <h1>Income</h1>
            <h2>Minimum: ${biweeklyAmount.min.toFixed(2)}</h2>
            <h2>Max: ${biweeklyAmount.max.toFixed(2)}</h2>
            <h2>Avg: ${biweeklyAmount.avg.toFixed(2)}</h2>
        </div>
    );
};
