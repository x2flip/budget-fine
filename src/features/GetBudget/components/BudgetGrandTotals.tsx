interface IProps {
    min: number;
    max: number;
    avg: number;
}
export const BudgetGrandTotals = ({ min, max, avg }: IProps) => {
    return (
        <div>
            <h1>Totals</h1>
            <h2>Minimum: ${min.toFixed(2)}</h2>
            <h2>Max: ${max.toFixed(2)}</h2>
            <h2>Avg: ${avg.toFixed(2)}</h2>
        </div>
    );
};
