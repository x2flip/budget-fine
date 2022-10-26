import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import { getSession, signIn, useSession } from 'next-auth/react';
import { UserAvatar } from '../components/UserAvatar';
import { GetBudgetModal } from '../features/GetBudget';
import { AddIncomeDialog } from '../features/Income';
import { IncomeCard } from '../features/Income/components/IncomeCard';
import { AddExpenseDialog } from '../features/Expense';
import { ExpenseCard } from '../features/Expense/ExpenseCard/ExpenseCard';
import { redirect } from 'next/dist/server/api-utils';
import { stat } from 'fs';
import { IncomeGrandTotals } from '../features/Income/components/IncomesGrandTotals';
import { GetBudgetButton } from '../features/GetBudget/components/GetBudgetButton';
import { ExpensesGrandTotals } from '../features/Expense/components/ExpensesGrandTotals';
import { BudgetGrandTotals } from '../features/GetBudget/components/BudgetGrandTotals';

// export async function getServerSideProps(context: any) {
//     const session = await getSession();
//     if (!session) {
//         return {
//             redirect: {
//                 destination: '/auth/signin',
//                 permanent: false,
//             },
//         };
//     }
//     return {
//         props: { session },
//     };
// }
export interface BudgetHeaderData {
    minIncome: number;
    maxIncome: number;
    avgIncome: number;
    minExpense: number;
    maxExpense: number;
    avgExpense: number;
    minTotal: number;
    maxTotal: number;
    avgTotal: number;
}
const Home: NextPage = () => {
    let { data: session, status } = useSession();
    const [isAddIncomeModalOpen, setIsAddIncomeModalOpen] = useState(false);
    const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
    const [isGetBudgetModalOpen, setIsGetBudgetModalOpen] = useState(false);
    const [budgetHeaderData, setBudgetHeaderData] = useState<BudgetHeaderData>({
        minIncome: 0,
        maxIncome: 0,
        avgIncome: 0,
        minExpense: 0,
        maxExpense: 0,
        avgExpense: 0,
        minTotal: 0,
        maxTotal: 0,
        avgTotal: 0,
    });
    const incomes = trpc.useQuery(['income.getAll']);
    const expenses = trpc.useQuery(['expense.getAll']);
    const users = trpc.useQuery(['user.getAll']);
    console.log(users);
    useEffect(() => {
        if (status === 'unauthenticated') {
            signIn();
        }
    }, [status]);

    return (
        <>
            <Head>
                <title>Budget Fine</title>
                <meta name="description" content="Budget Fine" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <nav className="dark:bg-slate-900 flex justify-end absolute w-full py-2">
                {session?.user?.image && (
                    <UserAvatar image={session.user.image} />
                )}
            </nav>
            <main className="flex items-center justify-center min-h-screen dark:bg-slate-900 dark:text-slate-100">
                <div className="flex flex-col my-20 space-y-10">
                    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 justify-evenly">
                        {incomes.data && (
                            <IncomeGrandTotals
                                setBudgetHeaderData={setBudgetHeaderData}
                                incomes={incomes.data}
                            />
                        )}
                        {expenses.data && (
                            <ExpensesGrandTotals
                                setBudgetHeaderData={setBudgetHeaderData}
                                expenses={expenses.data}
                            />
                        )}
                        {budgetHeaderData.minExpense !== 0 && (
                            <BudgetGrandTotals
                                min={
                                    budgetHeaderData.minIncome -
                                    budgetHeaderData.maxExpense
                                }
                                max={
                                    budgetHeaderData.maxIncome -
                                    budgetHeaderData.minExpense
                                }
                                avg={
                                    budgetHeaderData.avgIncome -
                                    budgetHeaderData.avgExpense
                                }
                            />
                        )}
                    </div>
                    <GetBudgetButton
                        setIsGetBudgetModalOpen={setIsGetBudgetModalOpen}
                    />
                    <GetBudgetModal
                        incomes={incomes?.data}
                        isOpen={isGetBudgetModalOpen}
                        setIsOpen={setIsGetBudgetModalOpen}
                    />
                    <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-10">
                        <div className="flex flex-col space-y-6 w-full">
                            <h2 className="text-3xl text-center font-bold">
                                Incomes
                            </h2>
                            <AddIncomeDialog
                                isOpen={isAddIncomeModalOpen}
                                setIsOpen={setIsAddIncomeModalOpen}
                            />
                            {incomes?.data &&
                                incomes.data.map((income) => (
                                    <IncomeCard
                                        key={income.id}
                                        income={income}
                                    />
                                ))}
                            <button
                                onClick={() => setIsAddIncomeModalOpen(true)}
                                className="py-2 px-4 border-2 border-green-500 text-green-500 shadow-xl shadow-green-500/20 rounded-md"
                            >
                                Add income
                            </button>
                        </div>
                        <div className="flex flex-col space-y-6 w-full">
                            <h2 className="text-3xl text-center font-bold">
                                Expenses
                            </h2>
                            <AddExpenseDialog
                                isOpen={isAddExpenseModalOpen}
                                setIsOpen={setIsAddExpenseModalOpen}
                            />
                            {expenses?.data &&
                                expenses.data.map((expense) => (
                                    <ExpenseCard
                                        key={expense.id}
                                        expense={expense}
                                    />
                                ))}
                            <button
                                onClick={() => setIsAddExpenseModalOpen(true)}
                                className="py-2 px-4 border-2 border-red-500 text-red-500 rounded-md shadow-xl shadow-red-400/20"
                            >
                                Add expense
                            </button>
                        </div>
                    </div>
                </div>
                {/* )} */}
            </main>
        </>
    );
};

export default Home;
