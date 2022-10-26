import { Income } from '@prisma/client';

interface IProps {
    incomes: Income[];
}
export const IncomeGrandTotals = ({ incomes }: IProps) => {
    function calcBiweeklyIncome(incomes: Income[]) {
        return incomes.reduce((prev, current) => prev + current.amount, 0);
    }
    const biweeklyAmount = calcBiweeklyIncome(incomes);
    return (
        <div>
            <h1>Income</h1>
            <h2>Minimum: ${(biweeklyAmount * 2).toFixed(2)}</h2>
            <h2>Max: ${(biweeklyAmount * 3).toFixed(2)}</h2>
            <h2>Avg: ${((biweeklyAmount * 26) / 12).toFixed(2)}</h2>
        </div>
    );
};
